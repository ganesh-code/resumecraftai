import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Plan definitions
const plans = [
  {
    plan_name: "Starter",
    price_inr: 99,
    resumes_per_day: 10,
    razorpay_plan_id: "plan_test_starter",
  },
  {
    plan_name: "Elite",
    price_inr: 129,
    resumes_per_day: 20,
    razorpay_plan_id: "plan_test_elite",
  },
  {
    plan_name: "Pro",
    price_inr: 199,
    resumes_per_day: 30,
    razorpay_plan_id: "plan_test_pro",
  },
];

type PlanName = "Starter" | "Elite" | "Pro";

type UserSubscription = {
  plan_name: PlanName;
  status: "active" | "cancelled" | "failed" | "pending";
  resumes_remaining: number;
  start_date: string;
  end_date: string;
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Subscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [userSub, setUserSub] = useState<UserSubscription | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch current subscription
  useEffect(() => {
    const fetchSub = async () => {
      if (!user?.id) return;
      setIsFetching(true);
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setUserSub(data);
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setUserSub(null);
      } finally {
        setIsFetching(false);
      }
    };
    fetchSub();
  }, [user]);

  // Handle subscribe
  const handleSubscribe = async (plan: (typeof plans)[0]) => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }
    setLoading(plan.plan_name);
    try {
      // Call Supabase Edge Function to create subscription and Razorpay order
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            plan_name: plan.plan_name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create subscription");
      }

      const { subscription_id, razorpay_order_id, amount, currency, key_id } =
        await response.json();

      // Initialize Razorpay
      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: "Resume Genius",
        description: `${plan.plan_name} Plan Subscription`,
        order_id: razorpay_order_id,
        handler: async function (response: any) {
          try {
            // Update subscription status
            const { error: updateError } = await supabase
              .from("subscriptions")
              .update({
                status: "active",
                resumes_remaining: plan.resumes_per_day,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
              .eq("id", subscription_id);

            if (updateError) throw updateError;

            toast.success("Subscription activated successfully!");
            window.location.reload();
          } catch (error) {
            console.error("Error updating subscription:", error);
            toast.error("Failed to activate subscription");
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to process subscription");
      } else {
        toast.error("Failed to process subscription");
      }
    } finally {
      setLoading(null);
    }
  };

  // UI
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Plan</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {plans.map((plan) => {
          const isActive =
            userSub?.plan_name === plan.plan_name &&
            userSub.status === "active";
          return (
            <Card
              key={plan.plan_name}
              className={isActive ? "border-blue-600 shadow-lg" : ""}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-baseline">
                  <span>{plan.plan_name}</span>
                  <span className="text-3xl font-bold">
                    ₹{plan.price_inr}/day
                  </span>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {plan.resumes_per_day} resumes/day
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>AI-optimized resumes</li>
                  <li>ATS keyword analysis</li>
                  <li>Priority support</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.plan_name || isActive}
                >
                  {isActive
                    ? "Current Plan"
                    : loading === plan.plan_name
                    ? "Processing..."
                    : "Subscribe Now"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      {/* Current Plan Summary */}
      <div className="mt-8 text-center">
        {isFetching ? (
          <span className="text-gray-500">Loading your subscription...</span>
        ) : userSub && userSub.status === "active" ? (
          <div className="inline-block bg-blue-100 text-blue-800 rounded-full px-4 py-2 font-medium">
            You're on the <b>{userSub.plan_name}</b> Plan.{" "}
            {userSub.resumes_remaining} resumes left today.
          </div>
        ) : (
          <div className="inline-block bg-gray-100 text-gray-700 rounded-full px-4 py-2 font-medium">
            Not subscribed.{" "}
            <span className="text-blue-600 font-semibold cursor-pointer">
              Upgrade to unlock more resumes!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
