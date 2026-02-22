import React, { useContext } from "react";
import { TestContext } from "../../context/TestContext";

const AdminPage = () => {
  const { questions, answers, userInfo, calculateScore } =
    useContext(TestContext);

  const score = calculateScore();

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h1>Test Administration Review</h1>

        <div className="admin-section">
          <h2>Candidate Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Name:</span>
              <span className="value">
                {userInfo.firstName} {userInfo.lastName}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{userInfo.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Phone:</span>
              <span className="value">{userInfo.phone}</span>
            </div>
            <div className="info-item">
              <span className="label">Total Score:</span>
              <span className="value">
                {score.correct}/{score.total} ({score.percentage}%)
              </span>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h2>Detailed Answers Review</h2>
          <div className="answers-review">
            {questions.map((question) => {
              const isCorrect = answers[question.id] === question.answer;
              const answered = question.id in answers;

              return (
                <div
                  key={question.id}
                  className={`answer-item ${isCorrect ? "correct" : "incorrect"}`}
                >
                  <div className="answer-header">
                    <span className="question-num">Q{question.id}</span>
                    <span className="category">{question.category}</span>
                    <span
                      className={`status ${isCorrect ? "correct" : "incorrect"}`}
                    >
                      {isCorrect
                        ? "✓ Correct"
                        : answered
                          ? "✗ Incorrect"
                          : "- Not Answered"}
                    </span>
                  </div>
                  <p className="question-text">{question.question}</p>
                  <div className="answer-details">
                    <div>
                      <strong>Your Answer:</strong>{" "}
                      {answered ? answers[question.id] : "Not answered"}
                    </div>
                    {!isCorrect && (
                      <div>
                        <strong>Correct Answer:</strong> {question.answer}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
