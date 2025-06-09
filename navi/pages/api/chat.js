// pages/api/chat.js
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }
  try {
    const { messages, tone } = req.body;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',     // fallback in case gpt-4o isn’t available
      messages: [
        { role: 'system', content: `You are Navi in a ${tone} tone.` },
        ...messages,
      ],
    });
    return res.status(200).json({ result: completion.choices[0].message });
  } catch (err) {
    console.error('Chat API Error:', err);
    // Return the actual error message so you can see it in the browser/console
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
}
