
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { WorkExperienceForm, WorkExperienceType } from "./WorkExperienceForm";
import { EducationForm, EducationType } from "./EducationForm";
import { SkillsForm } from "./SkillsForm";
import { ProjectsAchievementsForm, ProjectType, AchievementType } from "./ProjectsAchievementsForm";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

type PersonalDetailsType = {
  name: string;
  email: string;
  mobile: string;
  location: string;
  linkedIn: string;
  portfolio: string;
};

interface ProfileTabsProps {
  user: User | null;
  personalDetails: PersonalDetailsType;
  workExperience: WorkExperienceType[];
  education: EducationType[];
  skills: string;
  projects: ProjectType[];
  achievements: AchievementType[];
  onSavePersonalInfo: (data: PersonalDetailsType) => Promise<void>;
  onSaveWorkExperience: (data: WorkExperienceType[]) => Promise<void>;
  onSaveEducation: (data: EducationType[]) => Promise<void>;
  onSaveSkills: (skills: string) => Promise<void>;
  onSaveProjects: (data: ProjectType[]) => Promise<void>;
  onSaveAchievements: (data: AchievementType[]) => Promise<void>;
}

export function ProfileTabs({
  user,
  personalDetails,
  workExperience,
  education,
  skills,
  projects,
  achievements,
  onSavePersonalInfo,
  onSaveWorkExperience,
  onSaveEducation,
  onSaveSkills,
  onSaveProjects,
  onSaveAchievements
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState({
    personal: false,
    experience: false,
    education: false,
    skills: false,
    projects: false,
    achievements: false
  });

  const handleSavePersonalInfo = async (data: PersonalDetailsType) => {
    setIsLoading(prev => ({ ...prev, personal: true }));
    try {
      await onSavePersonalInfo(data);
    } finally {
      setIsLoading(prev => ({ ...prev, personal: false }));
    }
  };

  const handleSaveWorkExperience = async (data: WorkExperienceType[]) => {
    setIsLoading(prev => ({ ...prev, experience: true }));
    try {
      await onSaveWorkExperience(data);
    } finally {
      setIsLoading(prev => ({ ...prev, experience: false }));
    }
  };

  const handleSaveEducation = async (data: EducationType[]) => {
    setIsLoading(prev => ({ ...prev, education: true }));
    try {
      await onSaveEducation(data);
    } finally {
      setIsLoading(prev => ({ ...prev, education: false }));
    }
  };

  const handleSaveSkills = async (data: string) => {
    setIsLoading(prev => ({ ...prev, skills: true }));
    try {
      await onSaveSkills(data);
    } finally {
      setIsLoading(prev => ({ ...prev, skills: false }));
    }
  };

  const handleSaveProjects = async (data: ProjectType[]) => {
    setIsLoading(prev => ({ ...prev, projects: true }));
    try {
      await onSaveProjects(data);
    } finally {
      setIsLoading(prev => ({ ...prev, projects: false }));
    }
  };

  const handleSaveAchievements = async (data: AchievementType[]) => {
    setIsLoading(prev => ({ ...prev, achievements: true }));
    try {
      await onSaveAchievements(data);
    } finally {
      setIsLoading(prev => ({ ...prev, achievements: false }));
    }
  };

  return (
    <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-5 mb-8">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal">
        <PersonalInfoForm 
          user={user}
          initialData={personalDetails}
          onSave={handleSavePersonalInfo}
          isLoading={isLoading.personal}
        />
      </TabsContent>
      
      <TabsContent value="experience">
        <WorkExperienceForm 
          experiences={workExperience}
          onSave={handleSaveWorkExperience}
          isLoading={isLoading.experience}
        />
      </TabsContent>
      
      <TabsContent value="education">
        <EducationForm 
          education={education}
          onSave={handleSaveEducation}
          isLoading={isLoading.education}
        />
      </TabsContent>
      
      <TabsContent value="skills">
        <SkillsForm 
          initialSkills={skills}
          onSave={handleSaveSkills}
          isLoading={isLoading.skills}
        />
      </TabsContent>
      
      <TabsContent value="projects">
        <ProjectsAchievementsForm 
          projects={projects}
          achievements={achievements}
          onSaveProjects={handleSaveProjects}
          onSaveAchievements={handleSaveAchievements}
          isLoading={isLoading.projects || isLoading.achievements}
        />
      </TabsContent>
    </Tabs>
  );
}
