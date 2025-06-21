
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { confession, goals, days } = await req.json()

    const openaiApikey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApikey) {
      throw new Error('OpenAI API key not configured')
    }

    // Calculate appropriate token limit based on number of days
    const baseTokens = 800
    const tokensPerDay = Math.min(days * 25, 1200) // Cap at 1200 extra tokens
    const maxTokens = baseTokens + tokensPerDay

    // Optimized shorter prompt to reduce token usage
    const prompt = `As a comeback coach, create a JSON response for someone who: "${confession}" and wants: "${goals}" in ${days} days.

JSON format:
{
  "roast": "Brief tough-love comment (1-2 sentences)",
  "realityCheck": "Reality check about their timeline (1-2 sentences)", 
  "dailyPlan": [${days} objects: {"day": number, "task": "specific action", "resource": "url/tool", "motivation": "short quote"}],
  "finalQuote": "Motivational quote"
}

Keep responses concise. Valid JSON only, no trailing commas.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApikey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Much cheaper model
        messages: [
          {
            role: 'system',
            content: 'Comeback coach. JSON only, no trailing commas, be concise.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: maxTokens, // Dynamic token limit based on days
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    console.log('Raw OpenAI response:', content)

    // Check if response was likely truncated
    if (data.choices[0].finish_reason === 'length') {
      console.error('Response was truncated due to token limit')
      throw new Error('Response too long for the given timeframe. Try reducing the number of days.')
    }

    // Clean up the response to remove any potential trailing commas
    let cleanedContent = content.trim()
    
    // Remove trailing commas before closing brackets/braces
    cleanedContent = cleanedContent.replace(/,(\s*[}\]])/g, '$1')

    // Parse the JSON response
    let aiResponse
    try {
      aiResponse = JSON.parse(cleanedContent)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', cleanedContent)
      console.error('Parse error:', parseError)
      throw new Error('Invalid response format from AI')
    }

    // Validate the response structure
    if (!aiResponse.roast || !aiResponse.realityCheck || !aiResponse.dailyPlan || !aiResponse.finalQuote) {
      console.error('Missing required fields in AI response:', aiResponse)
      throw new Error('AI response missing required fields')
    }

    if (!Array.isArray(aiResponse.dailyPlan) || aiResponse.dailyPlan.length !== days) {
      console.error('Invalid daily plan structure:', aiResponse.dailyPlan)
      throw new Error('AI response has invalid daily plan structure')
    }

    console.log('Successfully parsed AI response')

    return new Response(
      JSON.stringify(aiResponse),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})
