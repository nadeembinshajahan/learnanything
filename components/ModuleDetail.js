import { useState, useEffect } from 'react';

const ModuleDetail = ({ module, submodules, detailedContents, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (submodules.length > 0) {
      setCurrentSlide(0); // Reset slide index when new submodules are loaded
    }
  }, [submodules]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % submodules.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + submodules.length) % submodules.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-4xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black">X</button>
        <h2 className="text-2xl font-bold mb-4">{module.title}</h2>
        <div className="mb-4 max-h-96 overflow-y-auto">
          <h3 className="text-xl font-semibold">{submodules[currentSlide]}</h3>
          <p>{detailedContents[submodules[currentSlide]]}</p>
        </div>
        <div className="flex justify-between">
          <button onClick={prevSlide} className="bg-blue-500 text-white px-4 py-2 rounded-lg" disabled={currentSlide === 0}>Previous</button>
          <button onClick={nextSlide} className="bg-blue-500 text-white px-4 py-2 rounded-lg" disabled={currentSlide === submodules.length - 1}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
