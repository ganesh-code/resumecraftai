
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";

export type ProjectType = {
  id?: string;
  name: string;
  description: string;
  url: string;
};

export type AchievementType = {
  id?: string;
  title: string;
  description: string;
  date: string;
};

interface ProjectsAchievementsFormProps {
  projects: ProjectType[]; // Changed from initialProjects
  achievements: AchievementType[]; // Changed from initialAchievements 
  onSaveProjects: (projects: ProjectType[]) => Promise<void>;
  onSaveAchievements: (achievements: AchievementType[]) => Promise<void>;
  isLoading: boolean;
}

export function ProjectsAchievementsForm({
  projects: initialProjects,
  achievements: initialAchievements,
  onSaveProjects,
  onSaveAchievements,
  isLoading
}: ProjectsAchievementsFormProps) {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState<ProjectType[]>(initialProjects);
  const [achievements, setAchievements] = useState<AchievementType[]>(initialAchievements);

  // Project handlers
  const handleProjectChange = (index: number, field: keyof ProjectType, value: string) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value
    };
    setProjects(updatedProjects);
  };

  const addProject = () => {
    setProjects([
      ...projects,
      { name: "", description: "", url: "" }
    ]);
  };

  const removeProject = (index: number) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);
  };

  const handleSubmitProjects = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveProjects(projects);
  };

  // Achievement handlers
  const handleAchievementChange = (index: number, field: keyof AchievementType, value: string) => {
    const updatedAchievements = [...achievements];
    updatedAchievements[index] = {
      ...updatedAchievements[index],
      [field]: value
    };
    setAchievements(updatedAchievements);
  };

  const addAchievement = () => {
    setAchievements([
      ...achievements,
      { title: "", description: "", date: "" }
    ]);
  };

  const removeAchievement = (index: number) => {
    const updatedAchievements = [...achievements];
    updatedAchievements.splice(index, 1);
    setAchievements(updatedAchievements);
  };

  const handleSubmitAchievements = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveAchievements(achievements);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects & Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <form onSubmit={handleSubmitProjects}>
              <div className="flex justify-end mb-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addProject}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} /> Add Project
                </Button>
              </div>

              <div className="space-y-8">
                {projects.map((project, index) => (
                  <div key={index} className="space-y-4 border-b pb-6 last:border-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Project {index + 1}</h3>
                      {projects.length > 0 && (
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeProject(index)}
                        >
                          <Trash2 size={16} className="mr-1" /> Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Project Name</Label>
                      <Input 
                        value={project.name}
                        onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea 
                        rows={3}
                        value={project.description}
                        onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Project URL</Label>
                      <Input 
                        type="url"
                        placeholder="https://example.com"
                        value={project.url || ""}
                        onChange={(e) => handleProjectChange(index, "url", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Projects"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="achievements">
            <form onSubmit={handleSubmitAchievements}>
              <div className="flex justify-end mb-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addAchievement}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} /> Add Achievement
                </Button>
              </div>

              <div className="space-y-8">
                {achievements.map((achievement, index) => (
                  <div key={index} className="space-y-4 border-b pb-6 last:border-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Achievement {index + 1}</h3>
                      {achievements.length > 0 && (
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeAchievement(index)}
                        >
                          <Trash2 size={16} className="mr-1" /> Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input 
                        value={achievement.title}
                        onChange={(e) => handleAchievementChange(index, "title", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea 
                        rows={3}
                        value={achievement.description || ""}
                        onChange={(e) => handleAchievementChange(index, "description", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input 
                        placeholder="May 2023"
                        value={achievement.date || ""}
                        onChange={(e) => handleAchievementChange(index, "date", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Achievements"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
