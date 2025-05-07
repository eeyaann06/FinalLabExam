<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
    public function index()
    {
        $records = MedicalRecord::with('patient')->get();
        return response()->json([
            'status' => true,
            'records' => $records
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'visit_date' => 'required|date',
            'diagnosis' => 'required|string',
            'prescription' => 'required|string',
        ]);

        $record = MedicalRecord::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Medical record created successfully',
            'record' => $record
        ], 201);
    }

    public function show(MedicalRecord $record)
    {
        return response()->json([
            'status' => true,
            'record' => $record->load('patient')
        ]);
    }

    public function update(Request $request, MedicalRecord $record)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'visit_date' => 'required|date',
            'diagnosis' => 'required|string',
            'prescription' => 'required|string',
        ]);

        $record->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Medical record updated successfully',
            'record' => $record
        ]);
    }

    public function destroy(MedicalRecord $record)
    {
        $record->delete();

        return response()->json([
            'status' => true,
            'message' => 'Medical record deleted successfully'
        ]);
    }
}