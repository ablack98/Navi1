import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { messages, tone } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o', // or 'gpt-4o-mini' if cost-sensitive
      messages: [
        { role: 'system', content: `You are Navi, a calm and encouraging support coach with a "${tone}" tone. Always guide the user toward clarity and self-growth with warmth.` },
        ...messages,
      ],
      temperature: 0.7,
    });

    res.status(200).json({ result: completion.data.choices[0].message });
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Something went wrong with the AI response.' });
  }
}
