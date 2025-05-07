import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/MedicalRecords.css"; // Make sure to create this CSS file

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);

  const [formData, setFormData] = useState({
    patient_id: "",
    visit_date: "",
    diagnosis: "",
    prescription: "",
  });

  // API Base URL
  const API_URL = "http://127.0.0.1:8000/api";

  // Fetch all medical records
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/medical-records`);
      const data = await response.json();

      if (data.status) {
        setRecords(data.records);
      } else {
        setError("Failed to fetch records.");
      }
    } catch (err) {
      setError("An error occurred while fetching records.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all patients for the dropdown
  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      const response = await fetch(`${API_URL}/patients`);
      const data = await response.json();

      if (data.status) {
        setPatients(data.patients);
      } else {
        setError("Failed to fetch patients.");
      }
    } catch (err) {
      setError("An error occurred while fetching patients.");
      console.error(err);
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchPatients();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null); // Clear previous errors

      const url =
        formMode === "add"
          ? `${API_URL}/medical-records`
          : `${API_URL}/medical-records/${formData.id}`;

      const method = formMode === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content"),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle HTTP errors
        if (response.status === 422) {
          // Validation errors
          const errorMsg = Object.values(data.errors).join(" ");
          setError(errorMsg);
        } else {
          throw new Error(data.message || "Failed to save record");
        }
        return;
      }

      if (data.status) {
        fetchRecords();
        setShowForm(false);
        resetForm();
      } else {
        setError(data.message || "Failed to save record");
      }
    } catch (err) {
      setError(err.message || "An error occurred while saving the record.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a record
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/medical-records/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content"),
        },
      });

      const data = await response.json();

      if (data.status) {
        fetchRecords();
      } else {
        setError("Failed to delete record.");
      }
    } catch (err) {
      setError("An error occurred while deleting the record.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Edit a record
  const handleEdit = (record) => {
    setFormData({
      id: record.id,
      patient_id: record.patient_id,
      visit_date: record.visit_date,
      diagnosis: record.diagnosis,
      prescription: record.prescription,
    });
    setFormMode("edit");
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      patient_id: "",
      visit_date: "",
      diagnosis: "",
      prescription: "",
    });
  };

  // Handle adding a new record
  const handleAddRecord = () => {
    resetForm();
    setFormMode("add");
    setShowForm(true);
  };

  // Filter records based on search term
  const filteredRecords = records.filter((record) => {
    return (
      record.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.prescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="medical-records-container">
      <div className="container py-4">
        <div className="card shadow">
          {/* Header */}
          <div className="records-header">
            <div className="d-flex align-items-center">
              <i className="bi bi-clipboard-plus fs-4 me-2"></i>
              <h1 className="h4 mb-0">Medical Records Management</h1>
            </div>
          </div>

          <div className="card-body">
            {/* Search and Add New buttons */}
            <div className="search-add-container d-flex justify-content-between align-items-center">
              <div className="search-container col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setSearchTerm("")}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>
              </div>
              <div className="col-md-auto">
                <button
                  className="btn btn-primary add-record-btn"
                  onClick={handleAddRecord}
                >
                  <i className="bi bi-plus-circle me-1"></i> Add New Record
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                className="alert alert-danger alert-dismissible fade show error-message"
                role="alert"
              >
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError(null)}
                ></button>
              </div>
            )}

            {/* Medical Records Form */}
            {showForm && (
              <div className="record-form mb-4">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    {formMode === "add"
                      ? "Add New Medical Record"
                      : "Edit Medical Record"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowForm(false)}
                  ></button>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <label className="form-label">
                          <i className="bi bi-person me-1"></i> Patient
                        </label>
                        <select
                          name="patient_id"
                          className="form-select form-input"
                          value={formData.patient_id}
                          onChange={handleInputChange}
                          required
                          disabled={loadingPatients}
                        >
                          <option value="">Select a patient</option>
                          {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                              {patient.name} (ID: {patient.id})
                            </option>
                          ))}
                        </select>
                        {loadingPatients && (
                          <div className="text-muted small mt-1">
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                            ></span>
                            Loading patients...
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="bi bi-calendar me-1"></i> Visit Date
                        </label>
                        <input
                          type="date"
                          name="visit_date"
                          className="form-control form-input"
                          value={formData.visit_date}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        <i className="bi bi-clipboard-check me-1"></i> Diagnosis
                      </label>
                      <textarea
                        name="diagnosis"
                        rows="3"
                        className="form-control form-textarea"
                        value={formData.diagnosis}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        <i className="bi bi-capsule me-1"></i> Prescription
                      </label>
                      <textarea
                        name="prescription"
                        rows="3"
                        className="form-control form-textarea"
                        value={formData.prescription}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>

                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => setShowForm(false)}
                      >
                        <i className="bi bi-x-circle me-1"></i> Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary form-submit-btn"
                        disabled={loading}
                      >
                        <i className="bi bi-save me-1"></i>
                        {loading ? "Saving..." : "Save Record"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Medical Records Table */}
            {loading && !showForm ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p className="mt-3 text-muted">Loading records...</p>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-folder-x display-4 text-muted"></i>
                <h4 className="mt-3">
                  {searchTerm
                    ? "No matching records found"
                    : "No medical records available"}
                </h4>
                <p className="text-muted">
                  {searchTerm
                    ? "Try adjusting your search criteria."
                    : "Create your first medical record by clicking the 'Add New Record' button."}
                </p>
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary mt-2"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="table-responsive records-table">
                  <table className="table table-striped table-hover">
                    <thead className="table-header">
                      <tr>
                        <th>Patient</th>
                        <th>Visit Date</th>
                        <th>Diagnosis</th>
                        <th>Prescription</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRecords.map((record) => (
                        <tr key={record.id} className="record-row">
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="badge bg-primary rounded-circle p-2 me-2">
                                <i className="bi bi-person-fill"></i>
                              </span>
                              <span>
                                {record.patient?.name ||
                                  record.patient?.lastname ||
                                  "Unknown"}
                                <small className="text-muted ms-1">
                                  (ID: {record.patient_id})
                                </small>
                              </span>
                            </div>
                          </td>
                          <td>
                            <i className="bi bi-calendar-date me-1 text-muted"></i>
                            {new Date(record.visit_date).toLocaleDateString()}
                          </td>
                          <td
                            style={{ maxWidth: "200px" }}
                            className="text-truncate"
                            title={record.diagnosis}
                          >
                            {record.diagnosis}
                          </td>
                          <td
                            style={{ maxWidth: "200px" }}
                            className="text-truncate"
                            title={record.prescription}
                          >
                            {record.prescription}
                          </td>
                          <td className="text-end">
                            <div className="btn-group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit(record)}
                                title="Edit Record"
                              >
                                <i className="bi bi-pencil-square me-1"></i>
                                <span>Edit</span>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(record.id)}
                                title="Delete Record"
                              >
                                <i className="bi bi-trash me-1"></i>
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredRecords.length > recordsPerPage && (
                  <div className="pagination-container d-flex justify-content-between align-items-center">
                    <p className="text-muted mb-0">
                      Showing {indexOfFirstRecord + 1} to{" "}
                      {Math.min(indexOfLastRecord, filteredRecords.length)} of{" "}
                      {filteredRecords.length} records
                    </p>
                    <nav aria-label="Page navigation">
                      <ul className="pagination mb-0">
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link page-btn"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <i className="bi bi-chevron-left"></i>
                          </button>
                        </li>
                        {[
                          ...Array(
                            Math.ceil(filteredRecords.length / recordsPerPage)
                          ),
                        ].map((_, i) => (
                          <li
                            key={i + 1}
                            className={`page-item ${
                              currentPage === i + 1 ? "active active-page" : ""
                            }`}
                          >
                            <button
                              className="page-link page-btn"
                              onClick={() => paginate(i + 1)}
                            >
                              {i + 1}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`page-item ${
                            currentPage ===
                            Math.ceil(filteredRecords.length / recordsPerPage)
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link page-btn"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={
                              currentPage ===
                              Math.ceil(filteredRecords.length / recordsPerPage)
                            }
                          >
                            <i className="bi bi-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
