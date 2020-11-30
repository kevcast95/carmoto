import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"

import taxi_icon from "../../asstes/Car-icon.png"
import "leaflet/dist/leaflet.css"
import "./Map.css"

function Map({ zoom, className }) {
  const center = { lat: 11.01563541, lng: -74.83849168 }

  const markers = [{ lat: 11.10563541, lng: -74.80849168 }, { lat: 11.01563541, lng: -74.83849168 }, { lat: 11.01563541, lng: -74.63849168 }]
  const [drivers, setDrivers] = useState([])
  const iconsMarker = L.icon({
    iconUrl: taxi_icon,
    iconRetinaUrl: taxi_icon,
    className: "leaflet-venue-icon",
    iconSize: [30, 30]
  })


  return (
    <div className={className}>
      <MapContainer center={center} zoom={zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          markers.map((marker, indx) => {
            return (
              <Marker key={indx} position={marker} icon={iconsMarker}>


              </Marker>
            )
          })
        }
      </MapContainer >
    </div>

  )
}

export default Map