import axios from 'axios';

export default async function handler(req, res) {
  const { topic } = req.body;

  try {
    const response = await axios.post('https://api.ai71.ai/v1/chat/completions', {
      model: "tiiuae/falcon-180B-chat",
      messages: [
        { role: "system", content: "Generate a list of learning modules and their submodules with titles and brief descriptions for the topic:" },
        { role: "user", content: `I want to learn about ${topic}.` },
      ],
    }, {
      headers: { Authorization: `Bearer ${process.env.AI71_API_KEY}` }
    });

    const rawContent = response.data.choices[0].message.content;
    const modules = rawContent.split('\n\n').map(module => {
      const [title, ...submodules] = module.split('\n');
      return {
        title: title.trim(),
        submodules: submodules.map(submodule => submodule.trim()).filter(submodule => submodule)
      };
    });

    res.status(200).json({ modules });
  } catch (error) {
    console.error('Error communicating with Falcon LLM:', error);
    res.status(500).json({ message: 'Error communicating with Falcon LLM', error: error.message });
  }
}
