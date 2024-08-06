import axios from 'axios';

export default async function handler(req, res) {
  const { moduleTitle } = req.body;
  const AI71_API_KEY = process.env.AI71_API_KEY;

  if (!AI71_API_KEY) {
    res.status(500).json({ message: 'AI71 API key not configured' });
    return;
  }

  try {
    const response = await axios.post('https://api.ai71.ai/v1/chat/completions', {
      model: "tiiuae/falcon-180B-chat",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Provide key takeaways for the module: ${moduleTitle}` },
      ],
      max_tokens: 1000,  // Limit the number of tokens
    }, {
      headers: { Authorization: `Bearer ${AI71_API_KEY}` }
    });

    const keyTakeaways = response.data.choices[0].message.content.trim();

    res.status(200).json({ keyTakeaways });
  } catch (error) {
    console.error('Error communicating with Falcon LLM:', error);
    res.status(500).json({ message: 'Error communicating with Falcon LLM', error: error.message });
  }
}
