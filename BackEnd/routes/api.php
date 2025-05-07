<?php

use Illuminate\Http\Request;
use App\Http\Controllers\API\PatientController;
use App\Http\Controllers\API\MedicalRecordController;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('patients', PatientController::class);
Route::get('patients/{patient}/records', [PatientController::class, 'getPatientRecords']);

Route::prefix('medical-records')->group(function () {
    Route::get('/', [MedicalRecordController::class, 'index']);
    Route::post('/', [MedicalRecordController::class, 'store']);
    Route::put('/{record}', [MedicalRecordController::class, 'update']);
    Route::delete('/{record}', [MedicalRecordController::class, 'destroy']);
});