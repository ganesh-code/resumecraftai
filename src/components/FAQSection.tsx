
import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the AI optimize my resume?",
    answer: "Our AI analyzes both your resume and the job description to identify keywords and phrases that are likely to pass through Applicant Tracking Systems (ATS). It then restructures your content to highlight relevant experience, skills, and achievements that match what the employer is looking for."
  },
  {
    question: "Will my resume look unique or will it be templated?",
    answer: "Your resume content will be uniquely tailored to your experience and the specific job you're applying for. We offer various professional templates for the visual layout, but the content is personalized to showcase your unique value proposition."
  },
  {
    question: "How many resumes can I create?",
    answer: "Free users can create 1 AI-optimized resume. Pro users get unlimited resume creations and optimizations, allowing you to customize for every job application you submit."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. You won't be charged again after cancellation, and you can continue to use the service until the end of your billing period."
  },
  {
    question: "Can I edit my resume after the AI generates it?",
    answer: "Absolutely! After the AI generates your optimized resume, you can make manual edits to any section before downloading. This gives you full control over the final result while still benefiting from the AI's optimization."
  },
  {
    question: "How do I know if my resume will pass ATS systems?",
    answer: "Our AI is specifically designed to create ATS-friendly resumes. We analyze the formatting, keywords, and structure to ensure compatibility with most ATS systems. Pro users also get an ATS compatibility score with specific improvement suggestions."
  }
];

const FAQSection: FC = () => {
  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
          <p className="mt-4 text-xl text-gray-600">Everything you need to know about ResumeAI</p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600">Still have questions?</p>
          <a href="#" className="text-blue-600 font-medium hover:underline">Contact our support team</a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
