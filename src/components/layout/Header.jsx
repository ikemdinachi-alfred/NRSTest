import React, { useContext } from "react";
import { TestContext } from "../../context/TestContext";
import Timer from "../test/Timer";

const Header = () => {
  const { questions, currentQuestionIndex } = useContext(TestContext);

  return (
    <header className="header">
      <div className="header-left">
        <h1>NRS Onboarding Assessment</h1>
        <span className="question-counter">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>
      <div className="header-right">
        <Timer />
      </div>
    </header>
  );
};

export default Header;
