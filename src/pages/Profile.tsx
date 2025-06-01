import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Added missing import
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { WorkExperienceType } from "@/components/profile/WorkExperienceForm";
import { EducationType } from "@/components/profile/EducationForm";
import {
  ProjectType,
  AchievementType,
} from "@/components/profile/ProjectsAchievementsForm";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    email: "",
    mobile: "",
    location: "",
    linkedIn: "",
    portfolio: "",
  });

  const [workExperience, setWorkExperience] = useState<WorkExperienceType[]>(
    []
  );
  const [education, setEducation] = useState<EducationType[]>([]);
  const [skills, setSkills] = useState("");
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [achievements, setAchievements] = useState<AchievementType[]>([]);

  // Check for authenticated user
  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // Redirect to login if no authenticated user
          navigate("/");
          return;
        }

        setUser(user);

        // Load profile data
        await loadProfileData(user.id);
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast({
          title: "Authentication Error",
          description: "Please try signing in again.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  const loadProfileData = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileData) {
        setPersonalDetails({
          name: profileData.name || "",
          email: profileData.email || "",
          mobile: profileData.mobile || "",
          location: profileData.location || "",
          linkedIn: profileData.linkedin_url || "",
          portfolio: profileData.portfolio_url || "",
        });
      }

      // Load work experience
      const { data: experienceData } = await supabase
        .from("work_experience")
        .select("*")
        .eq("profile_id", userId);

      if (experienceData && experienceData.length > 0) {
        setWorkExperience(
          experienceData.map((exp) => ({
            id: exp.id,
            company: exp.company,
            position: exp.position,
            startDate: exp.start_date,
            endDate: exp.end_date || "",
            description: exp.description || "",
          }))
        );
      } else {
        setWorkExperience([
          {
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ]);
      }

      // Load education
      const { data: educationData } = await supabase
        .from("education")
        .select("*")
        .eq("profile_id", userId);

      if (educationData && educationData.length > 0) {
        setEducation(
          educationData.map((edu) => ({
            id: edu.id,
            institution: edu.institution,
            degree: edu.degree,
            startDate: edu.start_date,
            endDate: edu.end_date || "",
            description: edu.description || "",
          }))
        );
      } else {
        setEducation([
          {
            institution: "",
            degree: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ]);
      }

      // Load skills
      const { data: skillsData } = await supabase
        .from("skills")
        .select("*")
        .eq("profile_id", userId);

      if (skillsData && skillsData.length > 0) {
        setSkills(skillsData.map((skill) => skill.name).join(", "));
      }

      // Load projects
      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .eq("profile_id", userId);

      if (projectsData && projectsData.length > 0) {
        setProjects(
          projectsData.map((project) => ({
            id: project.id,
            name: project.name,
            description: project.description || "",
            url: project.url || "",
          }))
        );
      } else {
        setProjects([{ name: "", description: "", url: "" }]);
      }

      // Load achievements
      const { data: achievementsData } = await supabase
        .from("achievements")
        .select("*")
        .eq("profile_id", userId);

      if (achievementsData && achievementsData.length > 0) {
        setAchievements(
          achievementsData.map((achievement) => ({
            id: achievement.id,
            title: achievement.title,
            description: achievement.description || "",
            date: achievement.date || "",
          }))
        );
      } else {
        setAchievements([{ title: "", description: "", date: "" }]);
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
      toast({
        title: "Failed to load profile",
        description: "Could not retrieve your profile information.",
        variant: "destructive",
      });
    }
  };

  const handleSavePersonalInfo = async (data: typeof personalDetails) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: data.name,
          mobile: data.mobile,
          location: data.location,
          linkedin_url: data.linkedIn,
          portfolio_url: data.portfolio,
        })
        .eq("id", user.id);

      if (error) throw error;

      setPersonalDetails(data);
      toast({ title: "Personal information saved" });
    } catch (error) {
      console.error("Error saving personal info:", error);
      toast({
        title: "Failed to save",
        description:
          "An error occurred while saving your personal information.",
        variant: "destructive",
      });
    }
  };

  const handleSaveWorkExperience = async (data: WorkExperienceType[]) => {
    if (!user) return;

    try {
      // Get existing experience ids
      const existingIds = workExperience
        .filter((exp) => exp.id)
        .map((exp) => exp.id);

      // Get ids from the updated data
      const updatedIds = data.filter((exp) => exp.id).map((exp) => exp.id);

      // Find ids to delete (in existing but not in updated)
      const idsToDelete = existingIds.filter((id) => !updatedIds.includes(id));

      // Delete removed experiences
      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("work_experience")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) throw deleteError;
      }

      // Update or insert each experience
      for (const exp of data) {
        if (exp.company && exp.position) {
          if (exp.id) {
            // Update existing
            const { error: updateError } = await supabase
              .from("work_experience")
              .update({
                company: exp.company,
                position: exp.position,
                start_date: exp.startDate,
                end_date: exp.endDate,
                description: exp.description,
              })
              .eq("id", exp.id);

            if (updateError) throw updateError;
          } else {
            // Insert new
            const { error: insertError } = await supabase
              .from("work_experience")
              .insert({
                profile_id: user.id,
                company: exp.company,
                position: exp.position,
                start_date: exp.startDate,
                end_date: exp.endDate,
                description: exp.description,
              });

            if (insertError) throw insertError;
          }
        }
      }

      setWorkExperience(data);
      toast({ title: "Work experience saved" });
    } catch (error) {
      console.error("Error saving work experience:", error);
      toast({
        title: "Failed to save",
        description: "An error occurred while saving your work experience.",
        variant: "destructive",
      });
    }
  };

  const handleSaveEducation = async (data: EducationType[]) => {
    if (!user) return;

    try {
      // Similar approach as work experience
      const existingIds = education
        .filter((edu) => edu.id)
        .map((edu) => edu.id);

      const updatedIds = data.filter((edu) => edu.id).map((edu) => edu.id);

      const idsToDelete = existingIds.filter((id) => !updatedIds.includes(id));

      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("education")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) throw deleteError;
      }

      for (const edu of data) {
        if (edu.institution && edu.degree) {
          if (edu.id) {
            const { error: updateError } = await supabase
              .from("education")
              .update({
                institution: edu.institution,
                degree: edu.degree,
                start_date: edu.startDate,
                end_date: edu.endDate,
                description: edu.description,
              })
              .eq("id", edu.id);

            if (updateError) throw updateError;
          } else {
            const { error: insertError } = await supabase
              .from("education")
              .insert({
                profile_id: user.id,
                institution: edu.institution,
                degree: edu.degree,
                start_date: edu.startDate,
                end_date: edu.endDate,
                description: edu.description,
              });

            if (insertError) throw insertError;
          }
        }
      }

      setEducation(data);
      toast({ title: "Education information saved" });
    } catch (error) {
      console.error("Error saving education:", error);
      toast({
        title: "Failed to save",
        description:
          "An error occurred while saving your education information.",
        variant: "destructive",
      });
    }
  };

  const handleSaveSkills = async (skillsString: string) => {
    if (!user) return;

    try {
      // Delete existing skills
      await supabase.from("skills").delete().eq("profile_id", user.id);

      // Parse and insert new skills
      const skillsArray = skillsString
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      if (skillsArray.length > 0) {
        const skillsToInsert = skillsArray.map((skill) => ({
          profile_id: user.id,
          name: skill,
        }));

        const { error } = await supabase.from("skills").insert(skillsToInsert);

        if (error) throw error;
      }

      setSkills(skillsString);
      toast({ title: "Skills saved" });
    } catch (error) {
      console.error("Error saving skills:", error);
      toast({
        title: "Failed to save",
        description: "An error occurred while saving your skills.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProjects = async (data: ProjectType[]) => {
    if (!user) return;

    try {
      // Similar approach as work experience
      const existingIds = projects
        .filter((proj) => proj.id)
        .map((proj) => proj.id);

      const updatedIds = data.filter((proj) => proj.id).map((proj) => proj.id);

      const idsToDelete = existingIds.filter((id) => !updatedIds.includes(id));

      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("projects")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) throw deleteError;
      }

      for (const project of data) {
        if (project.name) {
          if (project.id) {
            const { error: updateError } = await supabase
              .from("projects")
              .update({
                name: project.name,
                description: project.description,
                url: project.url,
              })
              .eq("id", project.id);

            if (updateError) throw updateError;
          } else {
            const { error: insertError } = await supabase
              .from("projects")
              .insert({
                profile_id: user.id,
                name: project.name,
                description: project.description,
                url: project.url,
              });

            if (insertError) throw insertError;
          }
        }
      }

      setProjects(data);
      toast({ title: "Projects saved" });
    } catch (error) {
      console.error("Error saving projects:", error);
      toast({
        title: "Failed to save",
        description: "An error occurred while saving your projects.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAchievements = async (data: AchievementType[]) => {
    if (!user) return;

    try {
      // Similar approach as other sections
      const existingIds = achievements
        .filter((ach) => ach.id)
        .map((ach) => ach.id);

      const updatedIds = data.filter((ach) => ach.id).map((ach) => ach.id);

      const idsToDelete = existingIds.filter((id) => !updatedIds.includes(id));

      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from("achievements")
          .delete()
          .in("id", idsToDelete);

        if (deleteError) throw deleteError;
      }

      for (const achievement of data) {
        if (achievement.title) {
          if (achievement.id) {
            const { error: updateError } = await supabase
              .from("achievements")
              .update({
                title: achievement.title,
                description: achievement.description,
                date: achievement.date,
              })
              .eq("id", achievement.id);

            if (updateError) throw updateError;
          } else {
            const { error: insertError } = await supabase
              .from("achievements")
              .insert({
                profile_id: user.id,
                title: achievement.title,
                description: achievement.description,
                date: achievement.date,
              });

            if (insertError) throw insertError;
          }
        }
      }

      setAchievements(data);
      toast({ title: "Achievements saved" });
    } catch (error) {
      console.error("Error saving achievements:", error);
      toast({
        title: "Failed to save",
        description: "An error occurred while saving your achievements.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProfileHeader user={user} />

        <ProfileTabs
          user={user}
          personalDetails={personalDetails}
          workExperience={workExperience}
          education={education}
          skills={skills}
          projects={projects}
          achievements={achievements}
          onSavePersonalInfo={handleSavePersonalInfo}
          onSaveWorkExperience={handleSaveWorkExperience}
          onSaveEducation={handleSaveEducation}
          onSaveSkills={handleSaveSkills}
          onSaveProjects={handleSaveProjects}
          onSaveAchievements={handleSaveAchievements}
        />
      </div>
    </div>
  );
};

export default Profile;
