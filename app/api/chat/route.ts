import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function fallbackReply(message: string): string {
  const text = message.toLowerCase();

  if (text.includes('quiz')) {
    return `Sure! Here is a quick quiz:\n1. What is the capital of France?\n2. Solve: 3x + 5 = 20\n3. What is photosynthesis?\nI can also give answers or make it harder.`;
  }

  if (text.includes('math') || text.includes('algebra') || text.includes('equation')) {
    return 'I can help with math. Send me the exact equation or problem, and I will solve it step by step in a simple way.';
  }

  if (text.includes('science') || text.includes('photosynthesis') || text.includes('biology')) {
    return 'Photosynthesis is how plants make their food using sunlight, water, and carbon dioxide. The basic result is glucose and oxygen.';
  }

  if (text.includes('study') || text.includes('revision') || text.includes('plan')) {
    return 'Here is a good study plan: 25 minutes read, 10 minutes notes, 15 minutes practice questions, and 10 minutes recap.';
  }

  if (text.includes('python') || text.includes('coding') || text.includes('programming')) {
    return 'Python is a great beginner language. Start with variables, loops, functions, and if-statements. I can help you learn and explain any code.';
  }

  if (text.includes('homework') || text.includes('assignment')) {
    return 'I can help with homework. Send the exact question and I will explain it step by step.';
  }

  return 'Hi! I am EduPath, your AI study assistant. I can help with math, science, coding, homework, revision, and exam prep.';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message || '';

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ reply: 'Please send a valid message.' });
    }

    if (client) {
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are EduPath, a helpful AI tutor for students. Explain ideas clearly, simply, and with examples. Help with homework, revision, math, science, coding, and exams.',
          },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      const reply = completion.choices[0]?.message?.content || fallbackReply(message);
      return NextResponse.json({ reply });
    }

    return NextResponse.json({ reply: fallbackReply(message) });
  } catch (error) {
    return NextResponse.json({
      reply: 'I can still help. Please try again with a shorter question.',
    });
  }
}
