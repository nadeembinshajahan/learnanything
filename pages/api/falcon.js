import axios from 'axios';

export default async function handler(req, res) {
  const { topic } = req.body;
  try {
    const response = await axios.post('https://api.ai71.ai/v1/chat/completions', {
      model: "tiiuae/falcon-180B-chat",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: topic },
      ],
    }, {
      headers: { Authorization: `Bearer ${process.env.AI71_API_KEY}` }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error communicating with Falcon LLM', error: error.message });
  }
}
