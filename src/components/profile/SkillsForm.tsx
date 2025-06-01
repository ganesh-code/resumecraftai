
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SkillsFormProps {
  initialSkills: string;
  onSave: (skills: string) => Promise<void>;
  isLoading: boolean;
}

export function SkillsForm({ 
  initialSkills, 
  onSave, 
  isLoading 
}: SkillsFormProps) {
  const [skills, setSkills] = useState(initialSkills);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(skills);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Expertise</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="skills">List your skills (separated by commas)</Label>
            <Textarea 
              id="skills" 
              rows={4}
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-2">List both technical skills and soft skills relevant to your field</p>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Skills"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
