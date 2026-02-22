import React, { useContext, useEffect } from "react";
import { TestContext } from "../../context/TestContext";

const Timer = () => {
  const { timeRemaining, setTimeRemaining, testSubmitted } =
    useContext(TestContext);

  useEffect(() => {
    if (testSubmitted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, setTimeRemaining, testSubmitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeRemaining < 600; // Less than 10 minutes

  return (
    <div className={`timer ${isLowTime ? "timer-low" : ""}`}>
      <span className="timer-label">Time Remaining:</span>
      <span className="timer-value">{formatTime(timeRemaining)}</span>
    </div>
  );
};

export default Timer;
