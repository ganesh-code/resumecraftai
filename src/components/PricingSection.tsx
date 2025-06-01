
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PricingProps {
  onSelectPlan: () => void;
}

const plans = [
  {
    name: "Basic",
    price: "Free",
    description: "For casual job seekers",
    features: [
      "1 AI-optimized resume",
      "Standard templates",
      "PDF downloads",
      "7-day history"
    ]
  },
  {
    name: "Pro",
    price: "$14",
    period: "per month",
    description: "For active job seekers",
    features: [
      "Unlimited AI-optimized resumes",
      "Premium templates",
      "PDF & Word downloads",
      "Keyword optimization",
      "Resume storage & versioning",
      "Email support"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per year",
    description: "For career professionals",
    features: [
      "Everything in Pro",
      "Cover letter generation",
      "LinkedIn profile optimization",
      "Career coach consultation",
      "Priority support",
      "Personal branding tools"
    ]
  }
];

const PricingSection: FC<PricingProps> = ({ onSelectPlan }) => {
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Simple Pricing</h2>
          <p className="mt-4 text-xl text-gray-600">Choose the plan that fits your job search needs</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`border ${plan.popular ? 'border-blue-500 shadow-xl' : 'border-gray-200'} relative flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-sm font-bold py-1 px-3 rounded-bl-lg rounded-tr-lg">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 ml-2">{plan.period}</span>}
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={onSelectPlan} 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.name === "Basic" ? "Start Free" : "Get Started"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center text-gray-600">
          <p>All plans include a 14-day money back guarantee</p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
