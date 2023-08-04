"use client"

import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents  } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from "axios";
import Map from '../../components/Map';
export default function Home() {
  const [show, setShow] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [dataVessels, setDataVessels] = useState([]);
  const [inputError, setInputError] = useState({})
  const [vessels, setVessels] = useState({
    name: '',
    type: '',
  })

  const handleInput = (e) => {
    e.preventDefault();
    setVessels({...vessels, [e.target.name]: e.target.value});
  }
  
  // Add vessel
  const create =  (e) => {
    e.preventDefault();

    const data = {
      name: vessels.name,
      type: vessels.type,
    }
     axios.post(`http://127.0.0.1:8000/api/vessels`, data)
     .then(res => {
          alert("Vessel Added Successfully")
          window.location.reload(false);
          setShow(false);
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

  }
  // display vessel
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/vessels`).then(res =>{
        // console.log(res)
        setDataVessels(res.data.vessels)

    })
  }, [])
  // delete vessel
  const deleteVessel = async (e, id) => {
    e.preventDefault();

     await axios.delete(`http://127.0.0.1:8000/api/vessels/${id}/delete`).then();
     alert("Vessel has been deleted");
     window.location.reload(false);
  }
  // edit vessel
  const editVessel =  (e, id) => {
    e.preventDefault();
    setShow(false);
    setShowUpdate(true)
     const fetch = async () => {
      const res = await axios.get(`http://127.0.0.1:8000/api/vessels/${id}/edit`);
      console.log(res)
      setVessels(res.data.vessels);
     }

     fetch();
  }
  // update vessel
  const updateVessel = async (e, id) => {
    e.preventDefault();

    const data = {
      name: vessels.name,
      type: vessels.type,
    }

    await axios.put(`http://127.0.0.1:8000/api/vessels/${id}/edit`, data)
      .then(res => {
          alert("Updated Successfully")
          window.location.reload(false);
          setShow(false);
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

  }

  const handleShow = () => {
    setVessels("");
    setShow(true);
    setShowUpdate(false);
  }
  const handleHide = () => {
    setShow(false);
    setVessels("");
  }
  const handleHideUpdate = () => {
    setShowUpdate(false);
    setVessels("");
  }

  return (
    <main className="wrapper">
      <div className="container">
        <div className="section1">
          <div>
            <div className='header'>
                <button type='button' onClick={handleShow} className="btn3">Add Vessel</button>
            </div>
            <div className="items" >
              {dataVessels && dataVessels.map((vessel, id) => (
              <div key={id}>
                <div>
                  <div className='title'>{vessel.name.toUpperCase()}</div>
                  <div className='description'>Type : {vessel.type}</div>
                </div>
                <div className="item-button">
                  <button className="btn1" type='button' onClick={(e) => deleteVessel(e, vessel.id)}>Delete</button>
                  <button className="btn2" type='button' onClick={(e) => editVessel(e, vessel.id)}>Edit</button>
                  <button className="btn3" type='button'><a href={`/vessel/${vessel.id}`} className='link_style'>View Mark</a></button>
                </div>
                <div className="line"></div>
              </div>))}
              {show &&
              <div className='hideshow'>
                <div className='inputSection1'>
                  Vessel Name : 
                  <input className='inputStyle' type='text' name='name' value={vessels.name} onChange={handleInput}></input>
                  <span className='error'>{inputError.name}</span>
                </div>
                <div className='inputSection2'>
                  <label>Type :</label>
                    <select name="type" id="type" className='inputStyle' onChange={handleInput}>
                      <option value="Cargo">Cargo</option>
                      <option value="Barge">Barge</option>
                      <option value="Tugboat">Tugboat</option>
                    </select>
                </div>
                <div>
                  <button type='button' className="btn2" onClick={handleHide}>Close</button>
                  <button type='submit' className="btn3" onClick={create}>Save</button>
                </div>
              </div>}
              {showUpdate &&
              <div className='hideshow'>
                <div className='inputSection1'>
                  Vessel Name : 
                  <input className='inputStyle' type='text' name='name' value={vessels.name} onChange={handleInput}></input>
                  <span className='error'>{inputError.name}</span>
                </div>
                <div className='inputSection2'>
                  <label>Type :</label>
                    <select name="type" id="type" className='inputStyle' onChange={handleInput}>
                      <option value={vessels.type}>{vessels.type}</option>
                      <option value="Cargo">Cargo</option>
                      <option value="Barge">Barge</option>
                      <option value="Tugboat">Tugboat</option>
                    </select>
                </div>
                <div>
                  <button type='button' className="btn2" onClick={handleHideUpdate}>Close</button>
                  <button type='button' className="btn3" onClick={(e) => updateVessel(e, vessels.id)}>Update</button>
                </div>
              </div>}
            </div>
            
            
          </div>
          
        </div>
        
        <div className="section2">
          <Map />
        </div>
      </div>
    </main>
  )
}
