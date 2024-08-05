import axios from 'axios';

export default async function handler(req, res) {
  const { submoduleTitle } = req.body;

  try {
    const response = await axios.post('https://api.ai71.ai/v1/chat/completions', {
      model: "tiiuae/falcon-180B-chat",
      messages: [
        { role: "system", content: "Provide detailed content for the following submodule:" },
        { role: "user", content: submoduleTitle },
      ],
    }, {
      headers: { Authorization: `Bearer ${process.env.AI71_API_KEY}` }
    });

    const detailedContent = response.data.choices[0].message.content.replace(/User:.*$/s, '').trim();

    res.status(200).json({ title: submoduleTitle, detailedContent });
  } catch (error) {
    console.error('Error communicating with Falcon LLM:', error);
    res.status(500).json({ message: 'Error communicating with Falcon LLM', error: error.message });
  }
}
