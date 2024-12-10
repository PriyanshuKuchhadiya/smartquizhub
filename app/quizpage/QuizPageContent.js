"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function QuizPageContent() {
  const searchParams = useSearchParams();

  // State for query parameters
  const [amount, setAmount] = useState("10");
  const [category, setCategory] = useState("9");
  const [difficulty, setDifficulty] = useState("easy");
  const [type, setType] = useState("multiple");
  const [categoryName, setCategoryName] = useState("General Knowledge");

  // States for quiz logic
  const [showIntro, setShowIntro] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [showPopup, setShowPopup] = useState(false);
  const [showQuitPopup, setShowQuitPopup] = useState(false);
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);

  // Initialize query parameters
  useEffect(() => {
    if (searchParams) {
      setAmount(searchParams.get("amount") || "10");
      setCategory(searchParams.get("category") || "9");
      setDifficulty(searchParams.get("difficulty") || "easy");
      setType(searchParams.get("type") || "multiple");
      setCategoryName(searchParams.get("categoryName") || "General Knowledge");
    }
  }, [searchParams]);

  // Fetch quiz questions
  const fetchQuizQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch quiz questions");
      }

      const data = await response.json();

      if (data.response_code === 1) {
        throw new Error(
          "No questions available for the selected difficulty and category. Please try a different combination."
        );
      }

      setQuestions(
        data.results.map((q) => ({
          question: q.question,
          options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
          correct: q.correct_answer,
        }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [amount, category, difficulty, type]);

  useEffect(() => {
    if (!showIntro) {
      fetchQuizQuestions();
    }
  }, [showIntro, fetchQuizQuestions]);

  // Timer logic
  useEffect(() => {
    if (!submitted && timeLeft > 0 && !showIntro) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [timeLeft, submitted, showIntro]);

  const handleAnswerChange = (selectedOption) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: selectedOption,
    }));
  };

  const handleSubmit = useCallback(() => {
    let calculatedScore = 0;

    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setSubmitted(true);
    setShowSubmitPopup(false);
  }, [questions, userAnswers]);

  const quitQuiz = () => setShowQuitPopup(true);

  const confirmQuit = () => {
    setShowQuitPopup(false);
    setShowIntro(true);
  };

  const cancelQuit = () => setShowQuitPopup(false);

  const goToNextQuestion = () => {
    if (!userAnswers[currentQuestionIndex]) {
      setShowPopup(true);
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const renderTimer = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const closePopup = () => setShowPopup(false);

  // Rendering logic
  if (showIntro) {
    return (
      <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center">
        <div className="bg-gray-100 rounded-lg shadow-md p-8 text-center max-w-lg">
          <h1 className="text-4xl font-bold mb-4">{categoryName}</h1>
          <p className="text-lg mb-4">Get ready to test your knowledge in this exciting quiz!</p>
          <ul className="text-left text-lg mb-6">
            <li>
              <strong>Number of Questions:</strong> {amount}
            </li>
            <li>
              <strong>Difficulty:</strong> {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </li>
            <li>
              <strong>Type:</strong> {type === "multiple" ? "Multiple Choice" : "True/False"}
            </li>
          </ul>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/topics">
              <button className="px-6 py-3 bg-yellow-400 text-gray-800 rounded-lg font-bold hover:bg-yellow-500 transition-all">
                Back to Topics
              </button>
            </Link>
            <button
              onClick={() => setShowIntro(false)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-all"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div>Loading questions...</div>;

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800">
        <div className="bg-gray-100 rounded-lg shadow-md p-8 text-center max-w-lg">
          <h2 className="text-3xl font-bold mb-4">Oops!</h2>
          <p className="text-lg mb-6">{error || "No questions available for the selected topic."}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/topics">
              <button className="px-6 py-3 bg-yellow-400 text-gray-800 rounded-lg font-bold hover:bg-yellow-500 transition-all">
                Back to Topics
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  return (
    <div className="min-h-screen bg-white text-gray-800 relative">
      <div className="container mx-auto px-4 py-10">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">{`Quiz: ${categoryName}`}</h1>
          <div className="text-xl font-medium">Time Left: {renderTimer()}</div>
        </header>
        {submitted ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold">Quiz Completed!</h2>
            <p className="text-xl mt-4">
              Your Score: {score}/{questions.length}
            </p>
            <div className="mt-8 text-left bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Results:</h3>
              {questions.map((question, index) => (
                <div key={index} className="mb-6">
                  <h4 className="font-bold">
                    Q{index + 1}:{" "}
                    <span dangerouslySetInnerHTML={{ __html: question.question }} />
                  </h4>
                  <ul className="mt-2">
                    {question.options.map((option, idx) => (
                      <li
                        key={idx}
                        className={`p-2 rounded ${
                          option === question.correct
                            ? "bg-green-100 text-green-800 font-bold"
                            : option === userAnswers[index] && userAnswers[index] !== question.correct
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-200"
                        }`}
                      >
                        <span dangerouslySetInnerHTML={{ __html: option }} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Link href="/topics">
              <button className="mt-6 px-6 py-3 bg-yellow-400 text-gray-800 rounded-lg font-bold hover:bg-yellow-500">
                Back to Topics
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 bg-gray-200 rounded-lg shadow p-6 overflow-y-auto h-[calc(100vh-200px)]">
              <h3 className="text-lg font-bold mb-4">Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!userAnswers[currentQuestionIndex]) {
                        setShowPopup(true);
                      } else {
                        setCurrentQuestionIndex(index);
                      }
                    }}
                    className={`w-12 h-12 flex items-center justify-center font-bold text-lg rounded-full border-2 ${
                      index === currentQuestionIndex
                        ? "bg-blue-500 text-white border-blue-700"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-3">
              <div className="bg-gray-100 text-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  Question {currentQuestionIndex + 1} of {questions.length}:{" "}
                  <span dangerouslySetInnerHTML={{ __html: questions[currentQuestionIndex].question }} />
                </h2>
                <ul>
                  {questions[currentQuestionIndex].options.map((option, idx) => (
                    <li key={idx} className="mb-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${currentQuestionIndex}`}
                          value={option}
                          className="mr-2"
                          onChange={() => handleAnswerChange(option)}
                          checked={userAnswers[currentQuestionIndex] === option}
                          disabled={submitted}
                        />
                        <span dangerouslySetInnerHTML={{ __html: option }} />
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={quitQuiz}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Quit Quiz
                </button>
                <div className="flex space-x-4">
                  <button
                    onClick={goToPreviousQuestion}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    onClick={goToNextQuestion}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowSubmitPopup(true)}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600"
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {showPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Please select an option before proceeding!</h2>
            <button
              onClick={closePopup}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {showQuitPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to quit the quiz?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmQuit}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600"
              >
                Yes, Quit
              </button>
              <button
                onClick={cancelQuit}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600"
              >
                No, Stay
              </button>
            </div>
          </div>
        </div>
      )}
      {showSubmitPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to submit the quiz?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600"
              >
                Yes, Submit
              </button>
              <button
                onClick={() => setShowSubmitPopup(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
