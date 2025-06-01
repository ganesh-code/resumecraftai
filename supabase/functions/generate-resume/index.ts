
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request data
    const { 
      jobDescription, 
      profile, 
      workExperience, 
      education, 
      skills, 
      projects, 
      achievements 
    } = await req.json();

    // Prepare data for AI processing
    const userProfile = {
      name: profile?.name || "",
      email: profile?.email || "",
      mobile: profile?.mobile || "",
      location: profile?.location || "",
      linkedin_url: profile?.linkedin_url || "",
      portfolio_url: profile?.portfolio_url || "",
      experience: workExperience || [],
      education: education || [],
      skills: skills || [],
      projects: projects || [],
      achievements: achievements || []
    };

    // Prepare the prompt for the AI
    const prompt = `
      Create an ATS-optimized resume based on the following information:
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      CANDIDATE PROFILE:
      ${JSON.stringify(userProfile, null, 2)}
      
      I need you to:
      1. Extract 10 relevant keywords from the job description
      2. Generate a professional summary (max 3 sentences) tailored to match the job
      3. Calculate an ATS match score (0-100) based on keyword matches and profile strength
      4. Provide 5 specific improvement suggestions for the resume
      5. Highlight which skills from the candidate's profile match the job description
      6. Add quantifiable achievements (with numbers/percentages) to work experiences where applicable
      
      Return the response as a JSON object with the following structure:
      {
        "keywordMatches": ["keyword1", "keyword2", ...],
        "atsScore": 85,
        "professionalSummary": "...",
        "suggestions": ["suggestion1", "suggestion2", ...],
        "highlightedSkills": ["skill1", "skill2", ...],
        "enhancedExperiences": [{ original job object with enhanced descriptions }, ...],
        "enhancedEducation": [{ original education object with enhanced descriptions }, ...],
        "enhancedProjects": [{ original project object with enhanced descriptions }, ...]
      }
    `;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert ATS resume optimizer that helps job seekers tailor their resumes to specific job descriptions.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Parse AI response (it should be JSON)
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (e) {
      console.error('Error parsing AI response:', e);
      console.log('Raw AI response:', aiResponse);
      throw new Error('Failed to parse AI response');
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-resume function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
