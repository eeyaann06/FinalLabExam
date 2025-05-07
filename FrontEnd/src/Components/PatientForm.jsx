import React from "react";
import "../styles/PatientForm.css";

function PatientForm({
  formData,
  selectedPatient,
  onInputChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="patient-form-container">
      <h2 className="form-title">
        {selectedPatient ? "Edit Patient" : "Add New Patient"}
      </h2>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="firstname">First Name *</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={onInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastname">Last Name *</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={onInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {selectedPatient ? "Update Patient" : "Create Patient"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PatientForm;
