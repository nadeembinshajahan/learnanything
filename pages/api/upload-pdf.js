import pdfParse from 'pdf-parse';
import axios from 'axios';
import { OpenAI, Document, VectorStoreIndex } from 'llamaindex';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const pdfBuffer = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });

    const data = await pdfParse(pdfBuffer);
    const pdfText = data.text;

    process.env.OPENAI_API_KEY = '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'


    // Initialize LlamaIndex with the AI71 API key
    const ai71 = new OpenAI(process.env.OPENAI_API_KEY);
    const document = new Document({ text: pdfText });

    // Create an index with the document
    const index = await VectorStoreIndex.fromDocuments([document], { llm: ai71 });

    // Query the index for learning modules
    const query = 'Generate a list of learning modules and their submodules with titles and brief descriptions';
    const queryEngine = index.asQueryEngine();
    const response = await queryEngine.query({ query });

    const rawContent = response.toString();
    const modules = rawContent.split('\n\n').map(module => {
      const [title, ...submodules] = module.split('\n');
      return {
        title: title.trim(),
        submodules: submodules.map(submodule => submodule.replace(/^- /, '').trim()).filter(submodule => submodule),
      };
    });

    res.status(200).json({ modules });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ message: 'Error processing PDF', error: error.message });
  }
}
