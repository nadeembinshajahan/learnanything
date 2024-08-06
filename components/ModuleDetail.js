import { useState, useEffect } from 'react';

const ModuleDetail = ({ module, submodules, detailedContents, keyTakeaways, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (submodules.length > 0) {
      setCurrentSlide(0); // Reset slide index when new submodules are loaded
    }
  }, [submodules]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (submodules.length + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + submodules.length + 1) % (submodules.length + 1));
  };

  const formatContent = (content) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4">{paragraph}</p>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto module-detail">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-4xl relative dark:bg-gray-700 dark:text-white">
        <button onClick={onClose} className="absolute top-4 right-4 text-black dark:text-white">X</button>
        <h2 className="text-2xl font-bold mb-4">{module.title}</h2>
        <div className="mb-4 max-h-96 overflow-y-auto">
          {currentSlide < submodules.length ? (
            <>
              <h3 className="text-xl font-semibold mb-2">{submodules[currentSlide]}</h3>
              {formatContent(detailedContents[submodules[currentSlide]])}
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-2">Key Takeaways</h3>
              {formatContent(keyTakeaways[module.title])}
            </>
          )}
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={prevSlide}
            className="bg-gray-300 text-black dark:bg-gray-600 dark:text-white rounded px-4 py-2"
            disabled={currentSlide === 0}
          >
            Previous
          </button>
          <button
            onClick={nextSlide}
            className="bg-gray-300 text-black dark:bg-gray-600 dark:text-white rounded px-4 py-2"
            disabled={currentSlide === submodules.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
