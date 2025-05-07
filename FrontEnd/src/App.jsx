import React, { useState } from "react";
import PatientManagement from "./Components/PatientManagement";
import MedicalRecords from "./Components/MedicalRecords";
import "./styles/App.css";

function App() {
  // State to track which component to show
  const [activeView, setActiveView] = useState("medical-records");

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">
            Mapatay Medical Clinic Management System
          </h1>
          <div className="user-controls">
            <i className="bi bi-person-circle me-2"></i>
            <span>Admin</span>
          </div>
        </div>
      </header>

      <div className="content-wrapper">
        {/* Navigation Sidebar */}
        <nav className="sidebar">
          <div className="logo-container">
            <i className="bi bi-hospital fs-1"></i>
            <h2 className="clinic-name">Mapatay Clinic</h2>
          </div>

          <div className="nav-links">
            <button
              className={`nav-link ${
                activeView === "medical-records" ? "active" : ""
              }`}
              onClick={() => setActiveView("medical-records")}
            >
              <i className="bi bi-clipboard-plus"></i>
              <span>Medical Records</span>
            </button>
            <button
              className={`nav-link ${
                activeView === "patient-management" ? "active" : ""
              }`}
              onClick={() => setActiveView("patient-management")}
            >
              <i className="bi bi-people"></i>
              <span>Patient Management</span>
            </button>
          </div>

          <div className="sidebar-footer">
            <button className="logout-btn">
              <i className="bi bi-box-arrow-right"></i>
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="main-container">
          {activeView === "medical-records" ? (
            <MedicalRecords />
          ) : (
            <PatientManagement />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
