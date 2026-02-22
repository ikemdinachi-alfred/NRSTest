import React, { useContext, useState } from "react";
import { TestContext } from "../../context/TestContext";

const RegistrationPage = () => {
  const { startTest, allParticipants } = useContext(TestContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [alreadyTaken, setAlreadyTaken] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    // Clear already taken message when email changes
    if (name === "email") {
      setAlreadyTaken(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    } else {
      // Check if email has already taken the test
      const emailExists = allParticipants.some(
        (participant) =>
          participant.email.toLowerCase() === formData.email.toLowerCase(),
      );
      if (emailExists) {
        setAlreadyTaken(true);
        return false;
      }
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      startTest(formData);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
          <h1>NRS Onboarding Assessment</h1>
          <p className="subtitle">Professional CBT Version</p>
        </div>

        <div className="registration-info">
          <h2>Test Information</h2>
          <ul>
            <li>
              Total Questions: <strong>35</strong>
            </li>
            <li>
              Time Duration: <strong>45 Minutes</strong>
            </li>
            <li>
              Categories: <strong>6</strong> (Taxation, Accounting, Maths,
              Current Affairs, English, Financial Accounting)
            </li>
            <li>
              Passing Score: <strong>60%</strong>
            </li>
          </ul>
        </div>

        {alreadyTaken && (
          <div className="alert-box alert-warning">
            <p>
              <strong>This email has already taken the test.</strong> Each
              candidate can only take the test once. If you believe this is an
              error, please contact the administrator.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          <h3>Candidate Information</h3>

          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? "input-error" : ""}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <span className="error-message">{errors.firstName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? "input-error" : ""}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <span className="error-message">{errors.lastName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "input-error" : ""}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>

          <div className="form-notice">
            <p>
              Please ensure all information is correct before proceeding. You
              will not be able to edit this information after starting the test.
            </p>
          </div>

          <button type="submit" className="start-test-btn">
            Start Test
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
