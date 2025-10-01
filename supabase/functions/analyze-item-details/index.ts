import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, itemType } = await req.json();

    const prompt = `You are an AI assistant helping students write better lost and found item posts. Analyze the following ${itemType} item details and provide:

1. A strength score (0-100) indicating how detailed and helpful the post is
2. Specific suggestions to improve findability
3. What's missing or could be better

Title: "${title || 'Not provided'}"
Description: "${description || 'Not provided'}"

Respond in JSON format:
{
  "score": <number 0-100>,
  "suggestions": ["suggestion1", "suggestion2", ...],
  "strengths": ["strength1", "strength2", ...],
  "missingDetails": ["detail1", "detail2", ...]
}

Consider these factors:
- Does the title include key identifiers (brand, color, model)?
- Does the description mention distinctive features?
- Is the location specific enough?
- Are there unique identifying marks or characteristics?
- Is the information clear and concise?

Score guidelines:
- 0-30: Very basic, missing crucial details
- 31-60: Some details but needs improvement
- 61-80: Good details, minor improvements possible
- 81-100: Excellent, comprehensive details`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in analyze-item-details:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});