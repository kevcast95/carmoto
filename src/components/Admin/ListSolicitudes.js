import React, { useState } from "react"

export default function ListSolicitudes({ allSolicitudes,accept,cancel }) {
 
 const solicitudeType = ["Pendientes", "Aceptadas", "Canceladas"]
 const pendientes = allSolicitudes.filter(sol => (sol.accepted === false && sol.canceled === false))
 const aceptadas = allSolicitudes.filter(sol => (sol.accepted === true))
 const canceladas = allSolicitudes.filter(sol => (sol.canceled === true))
 const back_title = ["type_title_pend", "type_title_acp","type_title_can"]
 return (
  <div className="list_solicitudes">
   <h3>Solicitudes</h3>
   {
    solicitudeType.map((type, ind) => {
     let solArray
     if (type === "Pendientes") {
      solArray = pendientes
     } else if (type === "Aceptadas") {
      solArray = aceptadas
     } else {
      solArray = canceladas
     }
     return (
      <div key={ind} className="type_list_container">
       <p className={`${back_title[ind]} type_title` }>{type}</p>
       {
        solArray.map((sol, indexS) => {
         return (
          <div key={indexS} className="info_solicitud">
           <div className="sol_info_text">
            
            <p><b>Ususario:</b> {sol.usuario}</p>
            <p> <b>Tipo:</b> {sol.tipo}</p>
           </div>
           {type === "Pendientes"?
            <div className="btn_containers">
             <div className="btn_solicitud_response" onClick={()=>accept(sol)}>
              <i class="material-icons">check</i>
             </div>
             <div style={{ border: "2px solid red" }} className="btn_solicitud_response"  onClick={()=>cancel(sol)}>
              <i class="material-icons">clear</i>
             </div>
            </div>
            :
            <div className="btn_containers">
             <div style={{ border: "2px solid cornflowerblue" }} className="btn_solicitud_response"  >
              <i class="material-icons">edit</i>
             </div>
            </div>
           }
          </div>
         )
        })
       }
      </div>
     )
    })
   }
  </div>
 )
}