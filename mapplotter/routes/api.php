<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VesselsController;
use App\Http\Controllers\LocationHistoryController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
//vessel
Route::get('/vessels', [VesselsController::class, 'index']);
Route::post('/vessels', [VesselsController::class, 'store']);
Route::get('/vessels/{id}', [VesselsController::class, 'show']);
Route::get('/vessels/{id}/edit', [VesselsController::class, 'edit']);
Route::put('/vessels/{id}/edit', [VesselsController::class, 'update']);
Route::delete('/vessels/{id}/delete', [VesselsController::class, 'destroy']);


//history location
Route::post('/vessels/{vesselId}/location-history', [LocationHistoryController::class, 'store']);
Route::get('/vessels-location', [LocationHistoryController::class, 'index']);
Route::get('/vessels-location/filter', [LocationHistoryController::class, 'show']);
Route::get('/vessels/vessel-location/{id}/filter', [LocationHistoryController::class, 'filterDate']);
