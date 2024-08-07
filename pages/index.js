import { useState, useEffect } from 'react';
import axios from 'axios';
import '../app/globals.css';
import ModuleDetail from '../components/ModuleDetail';
import ThemeToggle from '../components/ThemeToggle';
export const runtime = "nodejs";

export default function Home() {
  const [topic, setTopic] = useState('');
  const [knowledgeStrength, setKnowledgeStrength] = useState('');
  const [includeQuizzes, setIncludeQuizzes] = useState(false);
  const [modules, setModules] = useState([]);
  const [detailedContents, setDetailedContents] = useState({});
  const [keyTakeaways, setKeyTakeaways] = useState({});
  const [quizzes, setQuizzes] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedModule, setExpandedModule] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searched, setSearched] = useState(false);
  const [step, setStep] = useState(1);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (modules.length > 0) {
      modules.forEach(module => {
        module.submodules.forEach(async submodule => {
          try {
            const response = await axios.post('/api/detail', { submoduleTitle: submodule });
            setDetailedContents(prevState => ({
              ...prevState,
              [submodule]: response.data.detailedContent,
            }));
          } catch (error) {
            console.error('Error fetching detailed content:', error);
          }
        });

        const fetchKeyTakeaways = async () => {
          try {
            const response = await axios.post('/api/key-takeaways', { moduleTitle: module.title });
            setKeyTakeaways(prevState => ({
              ...prevState,
              [module.title]: response.data.keyTakeaways,
            }));
          } catch (error) {
            console.error('Error fetching key takeaways:', error);
          }
        };

        fetchKeyTakeaways();

        if (includeQuizzes) {
          const fetchQuiz = async () => {
            try {
              const response = await axios.post('/api/quiz', { moduleTitle: module.title });
              setQuizzes(prevState => ({
                ...prevState,
                [module.title]: response.data.quiz,
              }));
            } catch (error) {
              console.error('Error fetching quiz:', error);
            }
          };

          fetchQuiz();
        }
      });
    }
  }, [modules, includeQuizzes]);

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleKnowledgeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setModules([]);
    setDetailedContents({});
    setKeyTakeaways({});
    setExpandedModule(null);
    setSearched(true);
    setScore(0);

    try {
      const response = await axios.post('/api/modules', { topic, knowledgeStrength });
      setModules(response.data.modules);
      setStep(3);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (module) => {
    setExpandedModule(module);
    setShowDetail(true);
  };

  const handleQuizSubmit = (moduleTitle, quizAnswers) => {
    let moduleScore = 0;
    quizAnswers.forEach((answer, index) => {
      if (answer === quizzes[moduleTitle][index].correctAnswer) {
        moduleScore += 1;
      }
    });
    setScore(prevScore => prevScore + moduleScore);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cream-light to-white dark:from-gray-800 dark:to-black flex flex-col items-center justify-center text-gray-900 dark:text-white p-4 transition duration-500 blur-background font-sans">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-bold mb-6">Learn Anything</h1>
      {step === 1 && (
        <>
          <form onSubmit={handleTopicSubmit} className="cream-box mb-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic to learn about..."
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-dark dark:bg-gray-800 dark:text-white"
            />
            <label className="flex items-center mt-4">
              <input
                type="checkbox"
                checked={includeQuizzes}
                onChange={() => setIncludeQuizzes(!includeQuizzes)}
                className="mr-2"
              />
              Include quizzes
            </label>
            <button type="submit" className="mt-4 w-full p-2 bg-cream-dark text-black dark:bg-blue-500 dark:text-white rounded-lg hover:bg-cream-dark-200 dark:hover:bg-blue-600">
              Next
            </button>
          </form>
        </>
      )}
      {step === 2 && (
        <form onSubmit={handleKnowledgeSubmit} className="cream-box">
          <label className="block mb-4">
            How would you rate your knowledge of this topic?
            <select
              value={knowledgeStrength}
              onChange={(e) => setKnowledgeStrength(e.target.value)}
              required
              className="w-full p-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-dark dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select one...</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
          <button type="submit" className="mt-4 w-full p-2 bg-cream-dark text-black dark:bg-blue-500 dark:text-white rounded-lg hover:bg-cream-dark-200 dark:hover:bg-blue-600">
            Submit
          </button>
        </form>
      )}
      {step === 3 && (
        <>
          <div className="mt-6 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {modules.length > 0 && modules.map((module, index) => (
              <div key={index} className="p-4 rounded-lg bg-teal-700 text-white cursor-pointer hover:bg-teal-800 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => handleModuleClick(module)}>
                <h2 className="text-xl font-bold mb-2">{module.title}</h2>
                <ul>
                  {module.submodules.map((submodule, subIndex) => (
                    <li key={subIndex} className="list-disc list-inside">{submodule}</li>
                  ))}
                </ul>
              </div>
            ))}
            {searched && modules.length === 0 && !loading && <p className="col-span-full text-center">No modules found. Try a different topic.</p>}
          </div>
          {showDetail && expandedModule && (
            <ModuleDetail
              module={expandedModule}
              submodules={expandedModule.submodules}
              detailedContents={detailedContents}
              keyTakeaways={keyTakeaways}
              quizzes={quizzes[expandedModule.title]}
              onClose={() => setShowDetail(false)}
              onQuizSubmit={handleQuizSubmit}
            />
          )}
        </>
      )}
      {step === 3 && !loading && (
        <div className="fixed bottom-4 right-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg">
          <p className="text-lg font-bold">Final Score: {score}</p>
        </div>
      )}
    </div>
  );
}
