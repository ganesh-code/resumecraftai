import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

interface ProfileHeaderProps {
  user: User | null;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <div className="flex gap-4">
          <Button onClick={() => navigate("/resume-preview")}>
            Preview Resume
          </Button>
        </div>
      </div>
      <p className="text-gray-600 mt-2">
        Complete your profile information to generate a tailored resume
      </p>
    </div>
  );
}
