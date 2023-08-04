<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vessel;
use Illuminate\Support\Facades\Validator;

class VesselsController extends Controller
{
    public function index()
    {

        $vessels = Vessel::all();
        if ($vessels->count() > 0) {

            return response()->json([
                'status' => 200,
                'vessels' => $vessels
            ], 200);
        } else {

            return response()->json([
                'status' => 404,
                'message' => 'No Data Found'
            ], 200);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:191',
        ]);

        if($validator->fails()){

            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }else{
            $vessels = Vessel::create($request->all());
            return response()->json($vessels);
        };

        
    }

    public function show($id)
    {
        $vessels = Vessel::with('locationHistory')->find($id);

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

    public function edit($id)
    {

        $vessels = Vessel::find($id);
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

    public function update(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:191',
        ]);

        if ($validator->fails()) {

            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        } else {
            $vessels = Vessel::find($id);
                if ($vessels) {

                    $vessels->update($request->all());
                } else {

                    return response()->json([
                        'status' => 404,
                        'message' => 'Not Found'
                    ], 404);
                }
        };

        
    }

    public function destroy($id)
    {

        $vessels = Vessel::find($id);
        if ($vessels) {

            $vessels->delete();
        } else {

            return response()->json([
                'status' => 404,
                'message' => 'Not Found'
            ], 404);
        }
    }
}
