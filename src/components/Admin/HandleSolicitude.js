
import React, { useState, useEffect } from "react"
import { db } from "../../firebase"
import "./Admin.css"

export default function HandelSolicitud({ response, solicitude, drivers, close }) {
  console.log("solicitude:", solicitude);
  const [assignDriver, setAssignDriver] = useState({})

  function setDriverSolicitude(driver) {
    console.log(driver);
    setAssignDriver(driver)
  }

  async function setNewService() {
    close()
    await db.collection('servicios').doc(assignDriver.id).collection(assignDriver.id).doc().set(solicitude)
    //history.push(registerInfo.role.toLowerCase())

  }

  useEffect(() => {
    getServices()
  }, [])

  async function getServices() {
    console.log("añdojifsaiufpigu<safpugiugfsgdigoisf");
    db.collection("servicios").doc("bUjMx6U76ke2GJeBHtnZr0HPbCz1").collection("bUjMx6U76ke2GJeBHtnZr0HPbCz1").onSnapshot((querySnapshot) => {
      let drivers = []
      querySnapshot.forEach(user => {
        console.log("drivers, user");
        //drivers.push({ ...user.data(), id: user.id })
      });
      //console.log(drivers);
    });

  }

  const ListDrivers = () => {
    return (
      <div>
        {
          drivers.map((driver, index) => {
            return (
              <div key={index} className={driver.id === assignDriver.id ? "each_driver each_driver_selected" : "each_driver"} onClick={() => setDriverSolicitude(driver)}>
                {driver.name}
              </div>
            )
          })
        }
      </div>
    )
  }
  return (
    <div className="handle_solicitude_contanier">
      <div className="handle_solicitude_content">
        <div className="info_solicitude_container">
          <div className="info_solicitude_content">
            <p><b>Cliente:</b> {solicitude.usuario} </p>
            <p><b>Tipo de sercicio:</b> {solicitude.tipo} </p>
          </div>
          <div className="info_solicitude_content">
            <p><b>Trayecto:</b> {solicitude.salida} - {solicitude.llegada} </p>
            {solicitude.tipo === "puerta" &&
              <p><b>Dir salida:</b> {solicitude.dir_salida} - <b>Dir llegada:</b>  {solicitude.dir_llegada} </p>
            }
          </div>
        </div>
        <div className="infro_drivers_container">
          <div className="info_drivers_content">
            <h4>Saliendo desde Valledupar</h4>
            <div className="list_drivers">
              <ListDrivers />
            </div>
          </div>
          <div className="info_drivers_content">
            <h4>Saliendo desde Agunstin codazi</h4>
            <div className="list_drivers">
              <ListDrivers />
            </div>
          </div>
        </div>
        <div className="btn_service_response" onClick={() => setNewService()}>
          Asignar servicio
        </div>
        <div style={{ border: "2px solid red" }} className="btn_solicitud_response" onClick={() => close()}>
          Cancelar 
        </div>
      </div>
    </div>
  )
}