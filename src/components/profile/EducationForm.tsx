
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

export type EducationType = {
  id?: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
};

interface EducationFormProps {
  education: EducationType[]; // This is the correct prop name
  onSave: (education: EducationType[]) => Promise<void>;
  isLoading: boolean;
}

export function EducationForm({ 
  education: initialEducation, 
  onSave, 
  isLoading 
}: EducationFormProps) {
  const [education, setEducation] = useState<EducationType[]>(initialEducation);

  const handleEducationChange = (index: number, field: keyof EducationType, value: string) => {
    const updatedEducation = [...education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setEducation(updatedEducation);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { institution: "", degree: "", startDate: "", endDate: "", description: "" }
    ]);
  };

  const removeEducation = (index: number) => {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    setEducation(updatedEducation);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(education);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Education</CardTitle>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addEducation}
          className="flex items-center gap-1"
        >
          <Plus size={16} /> Add Education
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
          {education.map((edu, index) => (
            <div key={index} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Education {index + 1}</h3>
                {education.length > 1 && (
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeEducation(index)}
                  >
                    <Trash2 size={16} className="mr-1" /> Remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input 
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input 
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input 
                    type="month" 
                    value={edu.startDate}
                    onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input 
                    type="month" 
                    value={edu.endDate}
                    onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  rows={2}
                  value={edu.description}
                  onChange={(e) => handleEducationChange(index, "description", e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Education"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
