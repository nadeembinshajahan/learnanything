import axios from 'axios';

export default async function handler(req, res) {
  const { submoduleTitle } = req.body;
  const AI71_API_KEY = process.env.AI71_API_KEY;

  try {
    const response = await axios.post('https://api.ai71.ai/v1/chat/completions', {
      model: "tiiuae/falcon-180B-chat",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Generate detailed content and key takeaways for the submodule: ${submoduleTitle}.` },
      ],
    }, {
      headers: { Authorization: `Bearer ${AI71_API_KEY}` }
    });

    const content = response.data.choices[0].message.content;
    const [detailedContent, keyTakeaways] = content.split('Key Takeaways:').map(part => part.trim());

    res.status(200).json({ detailedContent, keyTakeaways });
  } catch (error) {
    console.error('Error communicating with Falcon LLM:', error);
    res.status(500).json({ message: 'Error communicating with Falcon LLM', error: error.message });
  }
}
