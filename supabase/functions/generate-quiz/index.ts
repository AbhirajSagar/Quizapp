import "jsr:@supabase/functions-js/edge-runtime.d.ts"
console.log("Hello from Functions!")

// supabase/functions/generate-quiz/index.ts
Deno.serve(async (req)=>
{
  if (req.method === 'OPTIONS')
  {
      return new Response(null,
      {
          status: 204,
          headers:
          {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, apikey'
          }
      });
  }
    
  const { topic, count, level } = await req.json()

  const prompt = `Create a JSON quiz with ${count} ${level} level questions about "${topic}". Use the format:
  {
    "title": "${topic}",
    "questions": [
      {
        "question": "...",
        "options": ["...", "...", "...", "..."],
        "answer": 0
      }
    ]
  }`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions',
  {
    method: 'POST',
    headers:
    {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('GROQ_KEY')}`
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that creates structured quiz data.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  const result = await response.json();
  const quizJson = result.choices?.[0]?.message?.content;

  return new Response(JSON.stringify({quiz: quizJson}),
  {
    headers: { 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' }
  });
})
