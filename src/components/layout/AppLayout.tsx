import { FC, ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [resumeInfo, setResumeInfo] = useState<{ count: number; plan: string }>(
    { count: 0, plan: "Free" }
  );

  useEffect(() => {
    const fetchResumeInfo = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            // No active subscription found
            setResumeInfo({ count: 0, plan: "Free" });
          } else {
            console.error("Error fetching subscription:", error);
            setResumeInfo({ count: 0, plan: "Free" });
          }
          return;
        }

        if (data) {
          setResumeInfo({
            count: data.resumes_remaining,
            plan: data.plan_name,
          });
        } else {
          setResumeInfo({ count: 0, plan: "Free" });
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setResumeInfo({ count: 0, plan: "Free" });
      }
    };

    fetchResumeInfo();

    // Set up real-time subscription for resume count updates
    const channel = supabase.channel("subscription_changes");
    const subscription = channel
      .on<Subscription>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
          filter: `user_id=eq.${user?.id}`,
        },
        (payload: RealtimePostgresChangesPayload<Subscription>) => {
          const newSubscription = payload.new as Subscription | null;
          if (newSubscription && newSubscription.status === "active") {
            setResumeInfo({
              count: newSubscription.resumes_remaining,
              plan: newSubscription.plan_name,
            });
          } else {
            setResumeInfo({ count: 0, plan: "Free" });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/profile" },
    { label: "Subscription", path: "/subscription" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 bg-white border-b shadow-sm">
          <div className="h-full px-4 flex items-center justify-end">
            <div className="flex items-center gap-4">
              {resumeInfo.plan === "Free" ? (
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-4 py-1 text-sm shadow-sm"
                  onClick={() => navigate("/subscription")}
                >
                  Upgrade Plan
                </Button>
              ) : (
                <span className="bg-blue-100 text-blue-800 font-semibold rounded-full px-4 py-1 text-sm shadow-sm">
                  {resumeInfo.count} resume{resumeInfo.count !== 1 ? "s" : ""}{" "}
                  left today
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-16 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
