"use client"

import React, {useEffect, useState, } from "react";
import { useParams } from 'next/navigation';
import Map from '../../../../components/Map'
import axios from "axios";
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import Link from 'next/link';
import L from "leaflet";
import { FaLocationDot } from "react-icons/fa6";
import Image from "next/image";
const Vessel = () => {

  const {id} = useParams();
  const [vessel, setVessel] = useState({});
  const [history, setHistory] = useState({ location_history: [] });
  const [location, setLocation] = useState({});
  const [markerPosition, setMarkerPosition] = useState([10.355592, 483.983675]);
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
      const response = await axios.get(`http://127.0.0.1:8000/api/vessels/vessel-location/${id}/filter`, {
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

      setHistory(response.data.vessels);
    } catch (error) {
      console.error(error);
    }
  };

  const colorLine = { color: 'blue' }

  const handleInput = (e) => {
    e.preventDefault();
    setMarkerPosition({...markerPosition, [e.target.name]: e.target.value});
  }

  const handleReset = () => {
    window.location.reload(false);
  }
  const handleSave = async (e) => {
    e.preventDefault();

    const data = {
      latitude: markerPosition[0],
      longitude: markerPosition[1],
    }

    try {

      axios.post(`http://127.0.0.1:8000/api/vessels/${id}/location-history`, data)
     .then(res => {
          alert("Mark Successfully")
          window.location.reload(false);
      })

    } catch (error) {
      console.error(error);
    }
  };

  //display history location
  useEffect(() => {
     const fetch = async () => {
      const res = await axios.get(`http://127.0.0.1:8000/api/vessels/${id}`);
      setHistory(res.data.vessels);

     }

     fetch();
  }, [])

  useEffect(() => {
     const fetch = async () => {
      const res = await axios.get(`http://127.0.0.1:8000/api/vessels/${id}/edit`);
      setVessel(res.data.vessels);
     }

     fetch();
  }, [])

  const markIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
    iconSize: [38, 38]
  })

  

  const handleMapClick = (e) => {
      setMarkerPosition([e.latlng.lat, e.latlng.lng]);
      console.log(markerPosition)
    };

  const MapClickEvents = () => {
      useMapEvents({
        click: handleMapClick,
      });
      return null;
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
    

  return (
    <main className="wrapper">
      <div className="container">
        <div className="section1">
          <button type='button' className="btn2"><a href={`/`} className='link_style'>Back</a></button>
          <div className="filtersection">
            <div className='dateSection'>
              Select Date and Time: <br/>
              <input
                className='dateStyle'
                type="datetime-local"
                id="start_date"
                value={startDate}
                onChange={handleStartDateChange}
              /><br/>
              <span className='error'>{inputError.start_date}</span><br/>
              To: <br/>
              <input
                className='dateStyle'
                type="datetime-local"
                id="end_date"
                value={endDate}
                onChange={handleEndDateChange}
              /><br/>
              <span className='error'>{inputError.end_date}</span> <br/>
              <button className='btn3' onClick={filterSubmit} type='button'>Filter</button>
              <button className='btn2' onClick={handleReset} type='button'>Reset</button>
            </div>
          </div>
          <div>
            <div className="title">Vessel : {vessel.name}</div>
            <div className="description">Type : {vessel.type}</div>
          </div>
          <div className="history-details">
            <div className="title">Location Seleted</div>
            {history.location_history.map((timestamp, index) => (
            <div key={index} className="history-section">
              <div>Latitude : {timestamp.latitude}</div>
              <div>Longitude : {timestamp.longitude}</div>
              <div>- {formatDate(timestamp.formatted_created_at || timestamp.created_at)} </div>
            </div>))}
          </div>
          
        </div>
        
        <div className="section2">
            <div>
                <MapContainer center={markerPosition} zoom={13} scrollWheelZoom={false}>
                    <MapClickEvents />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {history.location_history.map((location, index) => (
                    <div key={index}>
                      <Marker position={[location.latitude, location.longitude]} icon={markIcon} >
                          <Popup>
                            <div>
                              <div>Vessel: {history.name}</div>
                              <div>Latitude: {location.latitude}</div>
                              <div>Longitude: {location.longitude}</div>
                              <div>{formatDate(location.formatted_created_at || location.created_at)}</div>
                            </div>
                          </Popup>
                          {index > 0 && (
                              <Polyline
                                  pathOptions={colorLine}
                                  positions={[
                                      [history.location_history[index - 1].latitude, history.location_history[index - 1].longitude],
                                      [location.latitude, location.longitude]
                                  ]}
                              />
                          )}
                      </Marker>
                    </div>))}
                </MapContainer>
                <div className='details'>
                    <div className='location-details'>
                        <p>Latitude : </p>
                        <input className='location-item' value={markerPosition[0]} onChange={handleInput} name="latitude" disabled></input>
                    </div>
                    <div className='location-details'>
                        <p>Longitude : </p>
                        <input className='location-item' value={markerPosition[1]} onChange={handleInput} name="longitude" disabled></input>
                    </div>
                </div>
                <div className="btn4">
                    <button type="button" onClick={handleSave} className="btn3" >Save</button>
                </div>
            </div>
        </div>
      </div>
    </main>
  )
}

export default Vessel