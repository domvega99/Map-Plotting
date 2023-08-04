<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vessel;
use App\Models\LocationHistory;
use Carbon\Carbon;
class LocationHistoryController extends Controller
{
    public function store(Request $request, $id)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $vessel = Vessel::find($id);

        if (!$vessel) {
            return response()->json(['message' => 'Vessel not found'], 404);
        }

        $locationData = [
            'latitude' => $request->input('latitude'),
            'longitude' => $request->input('longitude'),
            'timestamp' => now(),
        ];

        $locationHistory = new LocationHistory($locationData);

        $vessel->locationHistory()->save($locationHistory);

        return response()->json(['message' => 'Location history added successfully'], 201);
    }
    public function index()
    {
        $vessels = Vessel::with('locationHistory')->get();

        if ($vessels) {
            return response()->json([
                'status' => 200,
                'vessels' => $vessels
            ], 200);
        } else {

            return response()->json([
                'status' => 404,
                'message' => 'Not Found'
            ], 404);
        }
    }

    public function show(Request $request)
    {

        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);


        $startDate = Carbon::parse($request->input('start_date'));
        $endDate = Carbon::parse($request->input('end_date'));


        $vessels = Vessel::with(['locationHistory' => function ($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate])
            ->select('id', 'vessel_id', 'latitude', 'longitude', 'created_at as formatted_created_at');
        }])->get();

        if ($vessels->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'Not Found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'vessels' => $vessels
        ], 200);
    }

    public function filterDate(Request $request, $id)
    {

        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->input('start_date'));
        $endDate = Carbon::parse($request->input('end_date'));

        // $vessels = Vessel::with('locationHistory')->find($id);
        $vessels = Vessel::with(['locationHistory' => function ($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate])
                ->select('id', 'vessel_id', 'latitude', 'longitude', 'created_at as formatted_created_at');
        }])->find($id);

        if (!$vessels) {
            return response()->json([
                'status' => 404,
                'message' => 'Vessel Not Found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'vessels' => $vessels
        ], 200);
    }
}
