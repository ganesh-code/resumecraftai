
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:text-left lg:px-0">
            <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-gray-900 sm:mt-5 sm:text-5xl lg:mt-6 xl:text-6xl">
              <span className="block">Get More Interviews</span>
              <span className="block text-blue-600">with AI-Optimized Resumes</span>
            </h1>
            <p className="mt-3 text-lg text-gray-500 sm:mt-5 sm:text-xl">
              Our AI analyzes your resume against job descriptions to create perfectly tailored 
              applications that pass Applicant Tracking Systems and impress hiring managers.
            </p>
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 justify-start">
              <Button size="lg" onClick={onGetStarted}>
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                See How It Works
              </Button>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              Already trusted by 10,000+ job seekers worldwide
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:relative">
            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
              <img
                className="w-full object-cover lg:absolute lg:inset-0 rounded-lg shadow-2xl"
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Person getting job interview"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
