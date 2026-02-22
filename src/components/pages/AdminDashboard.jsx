import React, { useContext, useState } from "react";
import { TestContext } from "../../context/TestContext";

const AdminDashboard = () => {
  const { allParticipants, deleteParticipant, exportToCSV, logoutAdmin } =
    useContext(TestContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("percentage");

  const filteredParticipants = allParticipants.filter(
    (p) =>
      p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm),
  );

  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    switch (sortBy) {
      case "percentage":
        return b.score.percentage - a.score.percentage;
      case "name":
        return a.firstName.localeCompare(b.firstName);
      case "date":
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      default:
        return 0;
    }
  });

  const stats = {
    totalParticipants: allParticipants.length,
    totalPassed: allParticipants.filter((p) => p.score.percentage >= 60).length,
    averageScore:
      allParticipants.length > 0
        ? Math.round(
            allParticipants.reduce((sum, p) => sum + p.score.percentage, 0) /
              allParticipants.length,
          )
        : 0,
    highestScore:
      allParticipants.length > 0
        ? Math.max(...allParticipants.map((p) => p.score.percentage))
        : 0,
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={logoutAdmin}>
          Logout
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.totalParticipants}</div>
          <div className="stat-label">Total Participants</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {stats.totalPassed}/{stats.totalParticipants}
          </div>
          <div className="stat-label">Passed (60%+)</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.averageScore}%</div>
          <div className="stat-label">Average Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.highestScore}%</div>
          <div className="stat-label">Highest Score</div>
        </div>
      </div>

      <div className="admin-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="control-buttons">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="percentage">Sort by Score</option>
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
          </select>

          <button className="export-btn" onClick={exportToCSV}>
            Export to CSV
          </button>
        </div>
      </div>

      {sortedParticipants.length === 0 ? (
        <div className="no-data">
          <p>
            No participants found.{" "}
            {allParticipants.length === 0 && "Awaiting test submissions..."}
          </p>
        </div>
      ) : (
        <div className="participants-table-container">
          <table className="participants-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Sheet Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedParticipants.map((participant) => (
                <tr key={participant.id} className="participant-row">
                  <td className="name-cell">
                    {participant.firstName} {participant.lastName}
                  </td>
                  <td>{participant.email}</td>
                  <td>{participant.phone}</td>
                  <td className="score-cell">
                    {participant.score.correct}/{participant.score.total}
                  </td>
                  <td className="percentage-cell">
                    <span
                      className={`percentage-badge ${
                        participant.score.percentage >= 60 ? "pass" : "fail"
                      }`}
                    >
                      {participant.score.percentage}%
                    </span>
                  </td>
                  <td className="status-cell">
                    <span
                      className={`status-badge ${
                        participant.score.percentage >= 60 ? "passed" : "failed"
                      }`}
                    >
                      {participant.score.percentage >= 60 ? "PASSED" : "FAILED"}
                    </span>
                  </td>
                  <td className="date-cell">
                    {new Date(participant.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="link-cell">
                    {participant.googleSheetLink ? (
                      <a
                        href={participant.googleSheetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sheet-link"
                      >
                        View
                      </a>
                    ) : (
                      <span className="no-link">N/A</span>
                    )}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="view-details-btn"
                      onClick={() => {
                        // Could implement a modal to view detailed results
                        console.log("View details for:", participant.id);
                      }}
                    >
                      Details
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete ${participant.firstName} ${participant.lastName}?`,
                          )
                        ) {
                          deleteParticipant(participant.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-footer">
        <p>
          Showing {sortedParticipants.length} of {allParticipants.length}{" "}
          participants
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
