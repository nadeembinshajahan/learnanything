import { useState, useEffect, useRef } from 'react';

export default function ModuleDetail({ module, submodules, detailedContents, keyTakeaways, quizzes, onClose, onQuizSubmit }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const modalRef = useRef();

  useEffect(() => {
    if (quizzes) {
      setLoadingQuiz(false);
    }
  }, [quizzes]);

  const handleNextSlide = () => {
    if (currentSlide < submodules.length + (quizzes ? 2 : 1)) setCurrentSlide(currentSlide + 1);
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const handleQuizAnswer = (question, answer) => {
    setQuizAnswers(prevState => ({ ...prevState, [question]: answer }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    onQuizSubmit(module.title, Object.values(quizAnswers));
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div id="moduleDetailOverlay" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-full overflow-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-black dark:text-white text-2xl">&times;</button>
        <h2 className="text-2xl font-bold mb-4">{module.title}</h2>
        {currentSlide < submodules.length && (
          <>
            <h3 className="text-xl font-semibold mb-2">{submodules[currentSlide]}</h3>
            <p className="mb-4 whitespace-pre-wrap">{detailedContents[submodules[currentSlide]] || 'Loading content...'}</p>
          </>
        )}
        {currentSlide === submodules.length && (
          <>
            <h3 className="text-xl font-semibold mb-2">Key Takeaways</h3>
            <p className="mb-4 whitespace-pre-wrap">{keyTakeaways[module.title] || 'Loading key takeaways...'}</p>
          </>
        )}
        {currentSlide === submodules.length + 1 && (
          <>
            <h3 className="text-xl font-semibold mb-2">Quiz</h3>
            {!quizzes ? (
              <p>Loading quiz...</p>
            ) : (
              quizzes.map((quiz, index) => (
                <div key={index} className="mb-4">
                  <p className="font-bold">{quiz.question}</p>
                  {quiz.options.map((option, i) => (
                    <div key={i} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={`${quiz.question}-${i}`}
                        name={quiz.question}
                        value={option}
                        onChange={() => handleQuizAnswer(quiz.question, option)}
                        disabled={quizSubmitted}
                        checked={quizAnswers[quiz.question] === option}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`${quiz.question}-${i}`}
                        className={
                          quizSubmitted && option === quiz.correctAnswer
                            ? "text-green-500"
                            : quizSubmitted && quizAnswers[quiz.question] === option
                            ? "text-red-500 line-through"
                            : ""
                        }
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              ))
            )}
            {!quizSubmitted && !loadingQuiz && (
              <button onClick={handleSubmitQuiz} className="mt-4 p-2 bg-cream-dark text-black dark:bg-blue-500 dark:text-white rounded-lg hover:bg-cream-dark-200 dark:hover:bg-blue-600">
                Submit Quiz
              </button>
            )}
            {quizSubmitted && (
              <p className="text-lg font-bold mt-4">
                Your score: {Object.keys(quizAnswers).filter(q => quizAnswers[q] === quizzes.find(quiz => quiz.question === q).correctAnswer).length}/{quizzes.length}
              </p>
            )}
          </>
        )}
        <div className="flex justify-between mt-4">
          <button onClick={handlePrevSlide} className="p-2 bg-cream-dark text-black dark:bg-blue-500 dark:text-white rounded-lg hover:bg-cream-dark-200 dark:hover:bg-blue-600" disabled={currentSlide === 0}>
            Previous
          </button>
          <button onClick={handleNextSlide} className="p-2 bg-cream-dark text-black dark:bg-blue-500 dark:text-white rounded-lg hover:bg-cream-dark-200 dark:hover:bg-blue-600" disabled={currentSlide >= submodules.length + (quizzes ? 1 : 0)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
