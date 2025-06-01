
import { FC } from "react";

const testimonials = [
  {
    quote: "After using ResumeAI, I got calls for 4 interviews in just one week. The AI-optimized resume made all the difference!",
    name: "Sarah Johnson",
    title: "Marketing Professional",
    avatar: "https://randomuser.me/api/portraits/women/11.jpg"
  },
  {
    quote: "I struggled for months to get interviews until I found this tool. Now I have a job at a Fortune 500 company. Worth every penny!",
    name: "Michael Chen",
    title: "Software Engineer",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    quote: "The AI recommendations were spot on for my industry. My resume now perfectly highlights my achievements and skills.",
    name: "Jessica Martinez",
    title: "Healthcare Administrator",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  }
];

const TestimonialSection: FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Success Stories</h2>
          <p className="mt-4 text-xl text-gray-600">See how ResumeAI has helped job seekers land their dream roles</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <svg className="h-8 w-8 text-blue-500 mb-4" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-gray-600 italic mb-4">{testimonial.quote}</p>
                </div>
                <div className="flex items-center mt-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="h-10 w-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
