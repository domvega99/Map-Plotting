"use client"

import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents  } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import Link from 'next/link';
import L from "leaflet";
import axios from "axios";
import { FaLocationDot } from "react-icons/fa6";
const Map = () => {
  
  const [postData, setpostData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [inputError, setInputError] = useState({})

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const filterSubmit = async (e) => {
    console.log(startDate, endDate)
    e.preventDefault();

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/vessels-location/filter`, {
        params: { start_date: startDate, end_date: endDate },
      })
      .catch(function (error){
          if(error.response){
            if(error.response.status === 422){
                setInputError(error.response.data.errors)
            }
            if(error.response.status === 500){
                setInputError(error.response.data.errors)
            }
          }
      });
      console.log(response.data.vessels)
      setpostData(response.data.vessels);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    };
    return dateObject.toLocaleString('en-US', options);
  };

  const markIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
    iconSize: [38, 38]
  })

  const [markerPosition, setMarkerPosition] = useState([10.355592, 483.983675]);

  const handleMapClick = (e) => {
      setMarkerPosition([e.latlng.lat, e.latlng.lng]);
      // console.log(markerPosition)
    };

  const MapClickEvents = () => {
      useMapEvents({
        click: handleMapClick,
      });
      return null;
    };

  // display vessel with location histories
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/vessels-location`).then(res =>{
        // console.log(res)
        setpostData(res.data.vessels)

    })
  }, [])

  const handleReset = () => {
    window.location.reload(false);
  }

  return (
    <div>
      <div className='dateSection'>
        Select Date and Time: <br/>
        <input
          className='dateStyle'
          type="datetime-local"
          id="start_date"
          value={startDate}
          onChange={handleStartDateChange}
        />
        <span className='error'>{inputError.start_date}</span><br/>
        To: <br/>
        <input
          className='dateStyle'
          type="datetime-local"
          id="end_date"
          value={endDate}
          onChange={handleEndDateChange}
        />
        <span className='error'>{inputError.end_date}</span> <br/>
        <button className='btn3' onClick={filterSubmit} type='button'>Filter</button>
        <button className='btn2' onClick={handleReset} type='button'>Reset</button>
      </div>
        <MapContainer center={markerPosition} zoom={13} scrollWheelZoom={false}>
            <MapClickEvents />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {postData.map((vessel, index) => (
            <div key={index}>
              {vessel.location_history && vessel.location_history.map((location, index) => (
              <Marker position={[location.latitude, location.longitude]} icon={markIcon} key={index}>
                  <Popup>
                    <div>
                      <div>Vessel: {vessel.name}</div>
                      <div>Type: {vessel.type}</div>
                      <div>Latitude: {location.latitude}</div>
                      <div>Longitude: {location.longitude}</div>
                      <div>{formatDate(location.formatted_created_at || location.created_at)}</div>
                    </div>
                  </Popup>
              </Marker>))}
            </div>
            ))}
        </MapContainer>
       
    </div>
  )
}

export default Map