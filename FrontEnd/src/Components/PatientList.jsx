import React from "react";
import "../styles/PatientList.css";

function PatientList({
  patients,
  loading,
  error,
  isAddMode,
  onViewRecords,
  onEditPatient,
  onDeletePatient,
  onToggleAddMode,
}) {
  return (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <h2 className="section-title">Patients</h2>
        <button onClick={onToggleAddMode} className="btn btn-primary">
          {isAddMode ? "Cancel" : "Add New Patient"}
        </button>
      </div>

      {loading ? (
        <p className="message loading-message">Loading patients...</p>
      ) : error ? (
        <p className="message error-message">{error}</p>
      ) : patients.length === 0 ? (
        <p className="message empty-message">No patients found.</p>
      ) : (
        <div className="table-container">
          <table className="patient-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.firstname}</td>
                  <td>{patient.lastname}</td>
                  <td className="action-buttons">
                    <button
                      onClick={() => onViewRecords(patient.id)}
                      className="btn btn-success"
                    >
                      Records
                    </button>
                    <button
                      onClick={() => onEditPatient(patient)}
                      className="btn btn-warning"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeletePatient(patient.id)}
                      className="btn btn-danger"
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
    </div>
  );
}

export default PatientList;
