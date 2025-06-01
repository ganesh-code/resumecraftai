
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

export type WorkExperienceType = {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
};

interface WorkExperienceFormProps {
  experiences: WorkExperienceType[]; // This is the correct prop name
  onSave: (experiences: WorkExperienceType[]) => Promise<void>;
  isLoading: boolean;
}

export function WorkExperienceForm({ 
  experiences: initialExperiences, 
  onSave, 
  isLoading 
}: WorkExperienceFormProps) {
  const [experiences, setExperiences] = useState<WorkExperienceType[]>(initialExperiences);

  const handleExperienceChange = (index: number, field: keyof WorkExperienceType, value: string) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    setExperiences(updatedExperiences);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { company: "", position: "", startDate: "", endDate: "", description: "" }
    ]);
  };

  const removeExperience = (index: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    setExperiences(updatedExperiences);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(experiences);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Work Experience</CardTitle>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addExperience}
          className="flex items-center gap-1"
        >
          <Plus size={16} /> Add Position
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Position {index + 1}</h3>
                {experiences.length > 1 && (
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeExperience(index)}
                  >
                    <Trash2 size={16} className="mr-1" /> Remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input 
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position Title</Label>
                  <Input 
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input 
                    type="month" 
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input 
                    type="text" 
                    value={exp.endDate}
                    placeholder="Present or MM/YYYY"
                    onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description & Achievements</Label>
                <Textarea 
                  rows={3}
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Experience"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
