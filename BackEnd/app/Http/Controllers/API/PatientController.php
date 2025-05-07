<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index()
    {
        $patients = Patient::all();
        return response()->json([
            'status' => true,
            'patients' => $patients
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
        ]);

        $patient = Patient::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Patient created successfully',
            'patient' => $patient
        ], 201);
    }

    public function show(Patient $patient)
    {
        return response()->json([
            'status' => true,
            'patient' => $patient
        ]);
    }

    public function update(Request $request, Patient $patient)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
        ]);

        $patient->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Patient updated successfully',
            'patient' => $patient
        ]);
    }

    public function destroy(Patient $patient)
    {
        $patient->delete();

        return response()->json([
            'status' => true,
            'message' => 'Patient deleted successfully'
        ]);
    }

    public function getPatientRecords(Patient $patient)
    {
        $records = $patient->medicalRecords;

        return response()->json([
            'status' => true,
            'records' => $records
        ]);
    }
}
