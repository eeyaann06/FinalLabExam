import React, { useState, useEffect } from "react";
import PatientList from "./PatientList";
import PatientForm from "./PatientForm";
import "../styles/PatientManagement.css";

function PatientManagement() {
  // API base URL
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
  });

  // Fetch patients data
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/patients`);

        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }

        const data = await response.json();
        setPatients(data.patients);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatients();
  }, [API_BASE_URL]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Create new patient
  const handleCreatePatient = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create patient");
      }

      const data = await response.json();
      setPatients([...patients, data.patient]);
      resetForm();
      setIsAddMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update existing patient
  const handleUpdatePatient = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_BASE_URL}/patients/${selectedPatient.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update patient");
      }

      const data = await response.json();

      setPatients(
        patients.map((patient) =>
          patient.id === selectedPatient.id ? data.patient : patient
        )
      );

      resetForm();
      setSelectedPatient(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete patient
  const handleDeletePatient = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete patient");
        }

        setPatients(patients.filter((patient) => patient.id !== id));

        if (selectedPatient && selectedPatient.id === id) {
          setSelectedPatient(null);
          resetForm();
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Get patient records
  const handleViewPatientRecords = async (patientId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/patients/${patientId}/records`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch patient records");
      }

      const data = await response.json();
      // Handle showing records - you could set a state and show in modal/panel
      console.log("Patient records:", data.records);
      alert(`Patient has ${data.records.length} medical record(s)`);
    } catch (err) {
      setError(err.message);
    }
  };

  // Set form to edit mode
  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      firstname: patient.firstname || "",
      lastname: patient.lastname || "",
    });
    setIsAddMode(false);
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      firstname: "",
      lastname: "",
    });
  };

  // Toggle add new patient mode
  const toggleAddMode = () => {
    resetForm();
    setSelectedPatient(null);
    setIsAddMode(!isAddMode);
  };

  // Cancel form submission
  const handleCancel = () => {
    resetForm();
    setSelectedPatient(null);
    setIsAddMode(false);
  };

  return (
    <div className="patient-management-container">
      <PatientList
        patients={patients}
        loading={loading}
        error={error}
        isAddMode={isAddMode}
        onViewRecords={handleViewPatientRecords}
        onEditPatient={handleEditPatient}
        onDeletePatient={handleDeletePatient}
        onToggleAddMode={toggleAddMode}
      />

      {(isAddMode || selectedPatient) && (
        <PatientForm
          formData={formData}
          selectedPatient={selectedPatient}
          onInputChange={handleInputChange}
          onSubmit={selectedPatient ? handleUpdatePatient : handleCreatePatient}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default PatientManagement;
