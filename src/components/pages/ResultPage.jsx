import React, { useContext } from "react";
import { TestContext } from "../../context/TestContext";

const ResultPage = () => {
  const { userInfo, resetTest } = useContext(TestContext);

  return (
    <div className="result-container">
      <div className="result-card">
        <div className="result-header thank-you">
          <h1>Thank You for Taking the Test</h1>
          <div className="thank-you-message">
            <p>We will get back to you on the next line of action.</p>
          </div>
        </div>

        <div className="result-summary simplified">
          <div className="summary-item">
            <span className="label">Name:</span>
            <span className="value">
              {userInfo.firstName} {userInfo.lastName}
            </span>
          </div>
          <div className="summary-item">
            <span className="label">Email:</span>
            <span className="value">{userInfo.email}</span>
          </div>
        </div>

        <div className="result-actions">
          <button className="retake-btn" onClick={resetTest}>
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
