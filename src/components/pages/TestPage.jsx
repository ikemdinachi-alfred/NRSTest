import React from "react";
import Header from "../layout/Header";
import QuestionPanel from "../test/QuestionPanel";
import QuestionNavigator from "../layout/QuestionNavigator";

const TestPage = () => {
  return (
    <div className="test-page">
      <Header />
      <div className="test-container">
        <QuestionPanel />
        <QuestionNavigator />
      </div>
    </div>
  );
};

export default TestPage;
