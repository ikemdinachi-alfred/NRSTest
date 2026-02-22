import React, { useContext } from "react";
import { TestContext } from "../../context/TestContext";
import OptionButton from "./OptionButton";

const QuestionPanel = () => {
  const {
    currentQuestion,
    currentQuestionIndex,
    questions,
    answers,
    handleAnswer,
    handleNext,
    handlePrevious,
    handleSubmit,
  } = useContext(TestContext);

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="question-panel">
      <div className="question-header">
        <span className="question-number">
          Question {currentQuestionIndex + 1}
        </span>
        <span className="question-category">{currentQuestion.category}</span>
      </div>

      <div className="question-text">
        <p>{currentQuestion.question}</p>
      </div>

      <div className="options-container">
        {currentQuestion.options.map((option, index) => (
          <OptionButton
            key={index}
            option={option}
            isSelected={answers[currentQuestion.id] === option}
            onClick={() => handleAnswer(option)}
            label={String.fromCharCode(65 + index)} // A, B, C, D
          />
        ))}
      </div>

      <div className="question-navigation">
        <button
          className="nav-btn prev-btn"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>

        {!isLastQuestion && (
          <button className="nav-btn next-btn" onClick={handleNext}>
            Next
          </button>
        )}

        {isLastQuestion && (
          <button className="submit-btn" onClick={handleSubmit}>
            Submit Test
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionPanel;
