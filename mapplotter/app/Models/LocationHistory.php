<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LocationHistory extends Model
{
    use HasFactory;
    protected $table = 'location_history';

    protected $fillable = [
        'vessel_id',
        'latitude',
        'longitude',
    ];

    public function vessel()
    {
        return $this->belongsTo(Vessel::class);
    }
}
