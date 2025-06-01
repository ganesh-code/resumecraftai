
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

type PersonalDetailsType = {
  name: string;
  email: string;
  mobile: string;
  location: string;
  linkedIn: string;
  portfolio: string;
};

interface PersonalInfoFormProps {
  user?: User | null; // Make user optional
  initialData: PersonalDetailsType;
  onSave: (data: PersonalDetailsType) => Promise<void>;
  isLoading: boolean;
}

export function PersonalInfoForm({ 
  user, 
  initialData, 
  onSave, 
  isLoading 
}: PersonalInfoFormProps) {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetailsType>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(personalDetails);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name"
                value={personalDetails.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                value={personalDetails.email}
                onChange={handleChange}
                disabled={!!user}
              />
              {user && (
                <p className="text-sm text-gray-500">Email is linked to your account and cannot be changed here.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Phone Number</Label>
              <Input 
                id="mobile" 
                name="mobile"
                value={personalDetails.mobile}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location"
                value={personalDetails.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedIn">LinkedIn Profile</Label>
              <Input 
                id="linkedIn" 
                name="linkedIn"
                value={personalDetails.linkedIn}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio Website</Label>
              <Input 
                id="portfolio" 
                name="portfolio"
                value={personalDetails.portfolio}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Information"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
