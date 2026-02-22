import React, { useContext } from "react";
import { TestContext } from "../../context/TestContext";

const QuestionNavigator = () => {
  const { questions, currentQuestionIndex, navigateToQuestion, isAnswered } =
    useContext(TestContext);

  const getStatusClass = (questionNum) => {
    const questionId = questions[questionNum - 1].id;
    if (questionNum === currentQuestionIndex + 1) {
      return "current";
    }
    if (isAnswered(questionId)) {
      return "answered";
    }
    return "not-answered";
  };

  // Grid layout: 5 questions per row
  const rows = [];
  for (let i = 0; i < questions.length; i += 5) {
    rows.push(questions.slice(i, i + 5));
  }

  return (
    <div className="question-navigator">
      <h3>Question Navigator</h3>
      <div className="navigator-grid">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="navigator-row">
            {row.map((q) => (
              <button
                key={q.id}
                className={`nav-button ${getStatusClass(q.id)}`}
                onClick={() => navigateToQuestion(q.id)}
                title={`Question ${q.id} - ${q.category}`}
              >
                {q.id}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="navigator-legend">
        <div className="legend-item">
          <span className="legend-box current"></span>
          <span>Current</span>
        </div>
        <div className="legend-item">
          <span className="legend-box answered"></span>
          <span>Answered</span>
        </div>
        <div className="legend-item">
          <span className="legend-box not-answered"></span>
          <span>Not Answered</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigator;
