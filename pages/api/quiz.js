import axios from 'axios';

// Function to shuffle array elements
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export default async function handler(req, res) {
  const { moduleTitle } = req.body;
  const AI71_API_KEY = process.env.AI71_API_KEY;

  try {
    const response = await axios.post('https://api.ai71.ai/v1/chat/completions', {
      model: "tiiuae/falcon-180B-chat",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Generate a quiz with 3 questions and answers for the module: ${moduleTitle}. Each question should have one correct answer marked with an asterisk (*).` },
      ],
    }, {
      headers: { Authorization: `Bearer ${AI71_API_KEY}` }
    });

    const rawContent = response.data.choices[0].message.content;
    const quiz = rawContent.split('\n\n').map(q => {
      const [question, ...answers] = q.split('\n');
      const correctAnswer = answers.find(a => a.startsWith('*'));
      if (!correctAnswer) {
        return null; // Skip this question if there is no correct answer
      }
      const correctAnswerText = correctAnswer.replace('*', '').trim();
      const options = answers.filter(a => a !== correctAnswer).map(a => a.trim()); // Only non-correct answers
      shuffleArray(options); // Shuffle the options to randomize the position of the correct answer
      options.push(correctAnswerText); // Add the correct answer at a random position
      return {
        question: question.trim(),
        options: options.filter(Boolean), // Ensure all options are unique and shuffled
        correctAnswer: correctAnswerText,
      };
    }).filter(q => q && q.question && q.options.length && q.correctAnswer); // Filter out any incomplete questions

    res.status(200).json({ quiz });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ message: 'Error generating quiz', error: error.message });
  }
}
