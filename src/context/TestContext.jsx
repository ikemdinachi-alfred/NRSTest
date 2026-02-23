import React, { createContext, useState, useCallback, useEffect } from "react";
import { questions, getRandomizedQuestions } from "../data/questions";
import { submitTestResults } from "../services/googleSheetService";

export const TestContext = createContext();

export const TestProvider = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(100 * 30); // 30 seconds per question (100 questions = 3000 seconds = 50 minutes)
  const [testStarted, setTestStarted] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [allParticipants, setAllParticipants] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [randomizedQuestions, setRandomizedQuestions] = useState(questions);

  // Load participants from localStorage on mount
  useEffect(() => {
    const savedParticipants = localStorage.getItem("testParticipants");
    if (savedParticipants) {
      try {
        setAllParticipants(JSON.parse(savedParticipants));
      } catch (error) {
        console.error("Error loading participants:", error);
      }
    }
  }, []);

  const currentQuestion = randomizedQuestions[currentQuestionIndex];

  const handleAnswer = useCallback(
    (answer) => {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: answer,
      }));
    },
    [currentQuestion.id],
  );

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < randomizedQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, randomizedQuestions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const navigateToQuestion = useCallback(
    (questionNum) => {
      const newIndex = questionNum - 1;
      if (newIndex >= 0 && newIndex < randomizedQuestions.length) {
        setCurrentQuestionIndex(newIndex);
      }
    },
    [randomizedQuestions.length],
  );

  const calculateScore = useCallback(() => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  }, [answers]);

  const getCategoryScores = useCallback(() => {
    const categories = [
      "Taxation",
      "Accounting",
      "Maths",
      "Current Affairs",
      "English",
      "Financial Accounting",
    ];
    const scores = {};

    categories.forEach((category) => {
      const categoryQuestions = questions.filter(
        (q) => q.category === category,
      );
      let correct = 0;
      categoryQuestions.forEach((q) => {
        if (answers[q.id] === q.answer) {
          correct++;
        }
      });
      scores[category] = {
        correct,
        total: categoryQuestions.length,
        percentage: Math.round((correct / categoryQuestions.length) * 100),
      };
    });

    return scores;
  }, [answers]);

  const handleSubmit = useCallback(async () => {
    setTestSubmitted(true);

    // Calculate score
    const score = calculateScore();
    const categoryScores = getCategoryScores();

    // Prepare participant data
    const participantData = {
      id: Date.now(),
      ...userInfo,
      score,
      categoryScores,
      answers,
      submittedAt: new Date().toISOString(),
      googleSheetLink: null,
    };

    // Save to Google Sheets and get the link
    try {
      const result = await submitTestResults(
        userInfo,
        answers,
        score,
        categoryScores,
      );
      if (result.success && result.googleSheetLink) {
        participantData.googleSheetLink = result.googleSheetLink;
      }
    } catch (error) {
      console.error("Error submitting to Google Sheets:", error);
    }

    // Add to all participants and save to localStorage
    setAllParticipants((prev) => {
      const updated = [participantData, ...prev];
      localStorage.setItem("testParticipants", JSON.stringify(updated));
      return updated;
    });
  }, [userInfo, answers, calculateScore, getCategoryScores]);

  const startTest = useCallback((info) => {
    setUserInfo(info);
    setRandomizedQuestions(getRandomizedQuestions());
    setTestStarted(true);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeRemaining(100 * 30);
  }, []);

  const resetTest = useCallback(() => {
    setTestStarted(false);
    setTestSubmitted(false);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeRemaining(100 * 30);
    setUserInfo({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
  }, []);

  const loginAdmin = useCallback((password) => {
    if (password === "NRS2026") {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdmin(false);
    resetTest();
  }, [resetTest]);

  const deleteParticipant = useCallback((participantId) => {
    setAllParticipants((prev) => {
      const updated = prev.filter((p) => p.id !== participantId);
      localStorage.setItem("testParticipants", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const exportToCSV = useCallback(() => {
    if (allParticipants.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Score",
      "Percentage",
      "Status",
      "Submitted At",
      "Google Sheet Link",
    ];

    const rows = allParticipants.map((p) => [
      p.id,
      p.firstName,
      p.lastName,
      p.email,
      p.phone,
      `${p.score.correct}/${p.score.total}`,
      `${p.score.percentage}%`,
      p.score.percentage >= 60 ? "PASSED" : "FAILED",
      new Date(p.submittedAt).toLocaleString(),
      p.googleSheetLink || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `test_results_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, [allParticipants]);

  const isAnswered = (questionId) => questionId in answers;
  const isCurrentAnswered = isAnswered(currentQuestion.id);

  const value = {
    currentQuestion,
    currentQuestionIndex,
    questions: randomizedQuestions,
    answers,
    timeRemaining,
    setTimeRemaining,
    testStarted,
    testSubmitted,
    userInfo,
    allParticipants,
    isAdmin,
    handleAnswer,
    handleNext,
    handlePrevious,
    navigateToQuestion,
    handleSubmit,
    calculateScore,
    getCategoryScores,
    startTest,
    resetTest,
    isAnswered,
    isCurrentAnswered,
    loginAdmin,
    logoutAdmin,
    deleteParticipant,
    exportToCSV,
  };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
};
