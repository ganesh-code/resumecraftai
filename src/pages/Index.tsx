
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import FeaturesList from "@/components/FeaturesList";
import TestimonialSection from "@/components/TestimonialSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"signin" | "signup">("signin");

  // If user is logged in, redirect to dashboard
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const openSignIn = () => {
    setAuthType("signin");
    setAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthType("signup");
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Navigation */}
      <header className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800">ResumeAI</h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={openSignIn}>Sign In</Button>
          <Button onClick={openSignUp}>Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <Hero onGetStarted={openSignUp} />

      {/* Features */}
      <FeaturesList />

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Enter Your Details",
              description: "Fill in your work history, education, skills, and personal information."
            },
            {
              step: "2",
              title: "Paste Job Description",
              description: "Add the job description you're applying for to optimize your resume."
            },
            {
              step: "3",
              title: "Get Your ATS-Optimized Resume",
              description: "Our AI analyzes and creates a tailored resume that passes ATS systems."
            }
          ].map((item, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mb-4 font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to land your dream job?</h2>
          <p className="text-xl mb-8">Get started with ResumeAI today and increase your interview chances by 4X</p>
          <Button onClick={openSignUp} size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            Create Your Optimized Resume <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

      {/* Pricing */}
      <PricingSection onSelectPlan={openSignUp} />

      {/* FAQs */}
      <FAQSection />

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        type={authType}
        onToggleType={() => setAuthType(authType === "signin" ? "signup" : "signin")}
      />
    </div>
  );
};

export default Index;
