import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const plans = [
  {
    id: "plan_monthly",
    name: "Monthly",
    price: 999, // ₹9.99
    description: "Perfect for active job seekers",
    features: [
      "Unlimited AI-optimized resumes",
      "Premium templates",
      "ATS keyword analysis",
      "Priority support"
    ]
  },
  {
    id: "plan_yearly",
    name: "Yearly",
    price: 9999, // ₹99.99
    description: "Best value for professionals",
    features: [
      "Everything in Monthly",
      "Cover letter generation",
      "LinkedIn profile optimization",
      "Career coaching session"
    ]
  }
];

export function SubscriptionPlans() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string, amount: number) => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }

    setLoading(planId);
    try {
      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      // Create order on your backend
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          userId: user.id,
          amount
        }),
      });

      const order = await response.json();

      if (!order.id) {
        throw new Error("Failed to create order");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "ResumeAI",
        description: `${planId === "plan_monthly" ? "Monthly" : "Yearly"} Subscription`,
        order_id: order.id,
        prefill: {
          email: user.email
        },
        handler: async (response: any) => {
          // Verify payment on your backend
          const verifyResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.id,
              planId
            }),
          });

          const verification = await verifyResponse.json();

          if (verification.success) {
            toast.success("Subscription activated successfully!");
          } else {
            toast.error("Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(null);
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(error.message || "Failed to process subscription");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {plans.map((plan) => (
        <Card key={plan.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex justify-between items-baseline">
              <span>{plan.name}</span>
              <span className="text-3xl font-bold">₹{(plan.price / 100).toFixed(2)}</span>
            </CardTitle>
            <p className="text-sm text-gray-600">{plan.description}</p>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-green-500 flex-shrink-0"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleSubscribe(plan.id, plan.price)}
              disabled={loading === plan.id}
            >
              {loading === plan.id ? "Processing..." : `Subscribe ${plan.name}`}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}