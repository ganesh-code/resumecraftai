
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { WorkExperienceForm } from "@/components/profile/WorkExperienceForm";
import { EducationForm } from "@/components/profile/EducationForm";
import { SkillsForm } from "@/components/profile/SkillsForm";
import { ProjectsAchievementsForm } from "@/components/profile/ProjectsAchievementsForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personalInfo");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default data for forms
  const defaultPersonalInfo = {
    name: user?.user_metadata?.name || "",
    email: user?.email || "",
    mobile: "",
    location: "",
    linkedIn: "",
    portfolio: ""
  };

  const defaultExperiences = [
    { company: "", position: "", startDate: "", endDate: "", description: "" }
  ];

  const defaultEducation = [
    { institution: "", degree: "", startDate: "", endDate: "", description: "" }
  ];

  const defaultProjects = [
    { name: "", description: "", url: "" }
  ];

  const defaultAchievements = [
    { title: "", description: "", date: "" }
  ];

  const goToNextTab = (current: string, next: string) => {
    setActiveTab(next);
  };

  const handleSavePersonalInfo = async (data: typeof defaultPersonalInfo) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          location: data.location,
          linkedin_url: data.linkedIn,
          portfolio_url: data.portfolio
        });
        
      if (error) throw error;
      
      toast.success("Personal details saved!");
      goToNextTab('personalInfo', 'experience');
    } catch (error: any) {
      toast.error(error.message || "Failed to save personal information");
    }
  };

  const handleSaveExperience = async (data: typeof defaultExperiences) => {
    if (!user) return;
    
    try {
      // Filter out empty entries
      const validExperiences = data.filter(exp => exp.company && exp.position);
      
      if (validExperiences.length > 0) {
        // Prepare data for insertion
        const experiencesToInsert = validExperiences.map(exp => ({
          profile_id: user.id,
          company: exp.company,
          position: exp.position,
          start_date: exp.startDate,
          end_date: exp.endDate,
          description: exp.description
        }));
        
        const { error } = await supabase
          .from("work_experience")
          .insert(experiencesToInsert);
          
        if (error) throw error;
      }
      
      toast.success("Work experience saved!");
      goToNextTab('experience', 'education');
    } catch (error: any) {
      toast.error(error.message || "Failed to save work experience");
    }
  };

  const handleSaveEducation = async (data: typeof defaultEducation) => {
    if (!user) return;
    
    try {
      // Filter out empty entries
      const validEducation = data.filter(edu => edu.institution && edu.degree);
      
      if (validEducation.length > 0) {
        // Prepare data for insertion
        const educationToInsert = validEducation.map(edu => ({
          profile_id: user.id,
          institution: edu.institution,
          degree: edu.degree,
          start_date: edu.startDate,
          end_date: edu.endDate,
          description: edu.description
        }));
        
        const { error } = await supabase
          .from("education")
          .insert(educationToInsert);
          
        if (error) throw error;
      }
      
      toast.success("Education details saved!");
      goToNextTab('education', 'skills');
    } catch (error: any) {
      toast.error(error.message || "Failed to save education details");
    }
  };

  const handleSaveSkills = async (skillsString: string) => {
    if (!user) return;
    
    try {
      // Parse and insert skills
      const skillsArray = skillsString
        .split(",")
        .map(skill => skill.trim())
        .filter(skill => skill !== "");
        
      if (skillsArray.length > 0) {
        const skillsToInsert = skillsArray.map(skill => ({
          profile_id: user.id,
          name: skill
        }));
        
        const { error } = await supabase
          .from("skills")
          .insert(skillsToInsert);
          
        if (error) throw error;
      }
      
      toast.success("Skills saved!");
      goToNextTab('skills', 'projects');
    } catch (error: any) {
      toast.error(error.message || "Failed to save skills");
    }
  };

  const handleSaveProjects = async (data: typeof defaultProjects) => {
    if (!user) return;
    
    try {
      // Filter out empty entries
      const validProjects = data.filter(project => project.name);
      
      if (validProjects.length > 0) {
        // Prepare data for insertion
        const projectsToInsert = validProjects.map(project => ({
          profile_id: user.id,
          name: project.name,
          description: project.description,
          url: project.url
        }));
        
        const { error } = await supabase
          .from("projects")
          .insert(projectsToInsert);
          
        if (error) throw error;
      }
      
      toast.success("Projects saved!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save projects");
    }
  };

  const handleSaveAchievements = async (data: typeof defaultAchievements) => {
    if (!user) return;
    
    try {
      // Filter out empty entries
      const validAchievements = data.filter(achievement => achievement.title);
      
      if (validAchievements.length > 0) {
        // Prepare data for insertion
        const achievementsToInsert = validAchievements.map(achievement => ({
          profile_id: user.id,
          title: achievement.title,
          description: achievement.description,
          date: achievement.date
        }));
        
        const { error } = await supabase
          .from("achievements")
          .insert(achievementsToInsert);
          
        if (error) throw error;
      }
      
      toast.success("Achievements saved!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save achievements");
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    try {
      toast.success("Profile completed successfully!");
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      toast.error("There was an issue completing your profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
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
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Complete Your Profile</h1>
          <p className="text-gray-600">Fill in your details to get started with personalized resume generation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="personalInfo" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="personalInfo">Personal Info</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personalInfo">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PersonalInfoForm 
                      user={user}
                      initialData={defaultPersonalInfo}
                      onSave={handleSavePersonalInfo}
                      isLoading={isSubmitting}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="experience">
                <Card>
                  <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WorkExperienceForm 
                      experiences={defaultExperiences}
                      onSave={handleSaveExperience}
                      isLoading={isSubmitting}
                    />
                  </CardContent>
                  <CardFooter className="justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("personalInfo")}>Previous</Button>
                    <Button onClick={() => goToNextTab('experience', 'education')}>Next: Education</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="education">
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EducationForm 
                      education={defaultEducation}
                      onSave={handleSaveEducation}
                      isLoading={isSubmitting}
                    />
                  </CardContent>
                  <CardFooter className="justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("experience")}>Previous</Button>
                    <Button onClick={() => goToNextTab('education', 'skills')}>Next: Skills</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="skills">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SkillsForm 
                      initialSkills=""
                      onSave={handleSaveSkills}
                      isLoading={isSubmitting}
                    />
                  </CardContent>
                  <CardFooter className="justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("education")}>Previous</Button>
                    <Button onClick={() => goToNextTab('skills', 'projects')}>Next: Projects</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="projects">
                <Card>
                  <CardHeader>
                    <CardTitle>Projects & Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProjectsAchievementsForm 
                      projects={defaultProjects}
                      achievements={defaultAchievements}
                      onSaveProjects={handleSaveProjects}
                      onSaveAchievements={handleSaveAchievements}
                      isLoading={isSubmitting}
                    />
                  </CardContent>
                  <CardFooter className="justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("skills")}>Previous</Button>
                    <Button onClick={handleComplete} disabled={isSubmitting}>Complete Profile</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Personal Info</span>
                    <span className={activeTab === "personalInfo" ? "text-blue-600 font-bold" : (activeTab > "personalInfo" ? "text-green-600" : "")}>
                      {activeTab === "personalInfo" ? "In Progress" : (activeTab > "personalInfo" ? "Completed" : "Pending")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Work Experience</span>
                    <span className={activeTab === "experience" ? "text-blue-600 font-bold" : (activeTab > "experience" ? "text-green-600" : "")}>
                      {activeTab === "experience" ? "In Progress" : (activeTab > "experience" ? "Completed" : "Pending")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Education</span>
                    <span className={activeTab === "education" ? "text-blue-600 font-bold" : (activeTab > "education" ? "text-green-600" : "")}>
                      {activeTab === "education" ? "In Progress" : (activeTab > "education" ? "Completed" : "Pending")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Skills</span>
                    <span className={activeTab === "skills" ? "text-blue-600 font-bold" : (activeTab > "skills" ? "text-green-600" : "")}>
                      {activeTab === "skills" ? "In Progress" : (activeTab > "skills" ? "Completed" : "Pending")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Projects & Achievements</span>
                    <span className={activeTab === "projects" ? "text-blue-600 font-bold" : (activeTab > "projects" ? "text-green-600" : "")}>
                      {activeTab === "projects" ? "In Progress" : (activeTab > "projects" ? "Completed" : "Pending")}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">
                  Complete all sections to unlock AI resume generation
                </p>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Why This Matters</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  The more complete and detailed your profile is, the better our AI can tailor your resume to each job 
                  application. This significantly increases your chances of getting past ATS systems and landing interviews.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
