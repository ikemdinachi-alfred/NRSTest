import React, { useContext, useState } from "react";
import { TestProvider, TestContext } from "./context/TestContext";
import RegistrationPage from "./components/pages/RegistrationPage";
import TestPage from "./components/pages/TestPage";
import ResultPage from "./components/pages/ResultPage";
import AdminLoginPage from "./components/pages/AdminLoginPage";
import AdminDashboard from "./components/pages/AdminDashboard";
import "./index.css";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            margin: "20px",
            backgroundColor: "#ffeeee",
            border: "2px solid #ff0000",
            borderRadius: "5px",
            color: "#cc0000",
          }}
        >
          <h2>Error in Application</h2>
          <p>{this.state.error?.message || "Unknown error occurred"}</p>
          <p>Please check the browser console (F12) for more details</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const { testStarted, testSubmitted, isAdmin } = useContext(TestContext);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Admin flow
  if (showAdminLogin && !isAdmin) {
    return (
      <>
        <AdminLoginPage />
        <button
          className="floating-back-btn"
          onClick={() => setShowAdminLogin(false)}
        >
          ← Back
        </button>
      </>
    );
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  // Regular test flow
  if (!testStarted) {
    return (
      <>
        <RegistrationPage />
        <button
          className="floating-admin-btn"
          onClick={() => setShowAdminLogin(true)}
          title="Admin Access"
        >
          👤
        </button>
      </>
    );
  }

  if (testSubmitted) {
    return <ResultPage />;
  }

  return <TestPage />;
}

function App() {
  return (
    <AppErrorBoundary>
      <TestProvider>
        <AppContent />
      </TestProvider>
    </AppErrorBoundary>
  );
}

export default App;
