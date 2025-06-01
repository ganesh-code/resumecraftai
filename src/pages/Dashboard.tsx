import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";
import html2pdf from "html2pdf.js";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobDescription, setJobDescription] = useState("");

  const handleGenerateResume = async () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      toast.error(
        "Please enter a detailed job description (at least 50 characters)"
      );
      return;
    }

    setIsGenerating(true);

    try {
      // Make sure we have a valid user ID
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // Check subscription status and remaining resumes
      const { data: subscription, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (subError && subError.code !== "PGRST116") {
        throw subError;
      }

      if (!subscription || subscription.resumes_remaining <= 0) {
        toast.error("You have no resumes remaining. Please upgrade your plan.");
        navigate("/subscription");
        return;
      }

      // Call the stored procedure to insert the job description
      const { error } = await supabase.rpc("insert_job_description", {
        p_user_id: user.id,
        p_content: jobDescription,
      });

      if (error) throw error;

      // Generate the resume HTML (you may want to use a template or component)
      const resumeHtml = `<div style='padding:32px;font-family:sans-serif;'><h1>Resume for ${user.email}</h1><p>${jobDescription}</p></div>`;

      // Configure html2pdf options
      const opt = {
        margin: 1,
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      // Generate PDF
      const pdfBlob = await html2pdf()
        .set(opt)
        .from(resumeHtml)
        .outputPdf("blob");

      // Upload PDF to Supabase Storage with proper path structure
      const filePath = `${user.id}/resume.pdf`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, pdfBlob, {
          upsert: true,
          contentType: "application/pdf",
          cacheControl: "3600",
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Failed to upload resume: ${uploadError.message}`);
      }

      // Decrement the resumes_remaining count
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          resumes_remaining: subscription.resumes_remaining - 1,
        })
        .eq("id", subscription.id);

      if (updateError) throw updateError;

      // Navigate to resume preview
      navigate("/resume-preview");
      toast.success("Resume generated and uploaded successfully!");
    } catch (error) {
      console.error("Error generating resume:", error);
      if (error instanceof PostgrestError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to generate resume");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Resume Generator</h1>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            <Button
              onClick={handleGenerateResume}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? "Generating..." : "Generate Resume"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
