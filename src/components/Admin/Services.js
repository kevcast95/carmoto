import React, { useEffect, useState } from "react"
import { db } from "../../firebase"
import Map from "../Map"
import ListSolicitudes from "./ListSolicitudes"
import HandleSolicitude from "./HandleSolicitude"
import { toast } from "react-toastify"
import "leaflet/dist/leaflet.css"


function Services({ allSolicitudes }) {
  const [drivers, setDrivers] = useState([])
  const [newSolicitude, setNewSolicitude] = useState({})
  const [flagSolicitude, setFlagSolicitude] = useState(false)
  const [acceptSolicitude, setAcceptSolicitude] = useState(false)

  useEffect(() => {
    getDrivers()
    recievinSolicitude()
  }, [])

  // Funcion para contar el numero de ejecuciones
  function createFnCounter(fn, invokeBeforeExecution) {
    let count = 0;
    return (snapshot) => {

      count++;
      if (count <= invokeBeforeExecution) {
        return null;
      }

      return fn(snapshot, count);
    }
  }

  // funcion que recibe la data al haber cambio
  function handleSnapshot(snapshot) {
    snapshot.docChanges().forEach(function (change) {
      let solicitudeInfo = Object.assign(change.doc.data(), { id: change.doc.id })
      
      //setNewSolicitude(solicitudeInfo)
    });
  }
  // DEvuelve el valor de la data despues de la primera ejecución 
  const handleSolicitudeCounter = createFnCounter(handleSnapshot, 1);

  async function getDrivers() {

    await db.collection("users").onSnapshot((querySnapshot) => {
      let drivers = []
      querySnapshot.forEach(user => {
        if (user.data().role === "Conductor") {
          drivers.push({ ...user.data(), id: user.id })

        }
      });
      setDrivers(drivers)
    });
  }

  async function recievinSolicitude() {
    await db.collection("solicitudes").onSnapshot(handleSolicitudeCounter)


  }



  async function responseSolicitude(response,sol) {
    setNewSolicitude(sol)
    setFlagSolicitude(response)
    await db.collection('solicitudes').doc(sol.id).update({ accepted: response, canceled:!response })
  }

  function closeHandleSol() {
    setFlagSolicitude(false)
  }
  console.log("newSolicitude:", newSolicitude);
  const ListDrivers = () => {
    return (
      <div>
        {
          drivers.map((driver, index) => {
            return (
              <div key={index} className="each_driver">
                {driver.name}
              </div>
            )
          })
        }
      </div>
    )
  }
  return (
    <div className="services_container">
      {flagSolicitude &&
        <HandleSolicitude
          close={()=>closeHandleSol()}
          response={false}
          solicitude={newSolicitude}
          drivers={drivers}
        />
      }
      <ListSolicitudes
        allSolicitudes={allSolicitudes}
        accept = {(sol)=>responseSolicitude(true,sol)} 
        cancel = {(sol)=>responseSolicitude(false,sol)}
      />
      <div className="map_n_taxis">
        <Map zoom={13} className={"map_size"} />
        <div className="list_drivers_container">
          <div className="drivers_list_container">
            <h3>Taxis disponibles</h3>
            <ListDrivers />
          </div>
          <div className="drivers_list_container">
            <h3>Taxis con cupos</h3>
          </div>
          <div className="drivers_list_container">
            <h3>Taxis en servicio</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services