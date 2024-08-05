import { useState, useEffect } from 'react';
import axios from 'axios';
import '../app/globals.css';
import ModuleDetail from '../components/ModuleDetail';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [modules, setModules] = useState([]);
  const [detailedContents, setDetailedContents] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedModule, setExpandedModule] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searched, setSearched] = useState(false);

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
      });
    }
  }, [modules]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setModules([]);
    setDetailedContents({});
    setExpandedModule(null);
    setSearched(true);

    try {
      const response = await axios.post('/api/modules', { topic });
      setModules(response.data.modules);
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-cream-light to-white dark:from-gray-800 dark:to-black flex flex-col items-center justify-center text-gray-900 dark:text-white p-4 transition duration-500 blur-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-bold mb-6">Learn Anything</h1>
      <form onSubmit={handleSubmit} className="bg-cream-light dark:bg-gray-700 text-black dark:text-white p-6 rounded-lg shadow-lg w-full max-w-md blur-background">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic to learn about..."
          required
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-dark dark:bg-gray-800 dark:text-white"
        />
        <button type="submit" className="mt-4 w-full p-2 bg-cream-dark text-black dark:bg-blue-500 dark:text-white rounded-lg hover:bg-cream-dark-200 dark:hover:bg-blue-600">
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>
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
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}