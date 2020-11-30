import React, { useEffect, useState } from "react";
import { db_auth, db } from "../../firebase"
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom"
import { toast } from "react-toastify"
import moment from "moment"
import Map from "../Map"
import logo from "../../asstes/logo.jpg"

import "./Client.css"

function Client({ logedIn, idUser, dispatch, userLogged }) {
  console.log(userLogged);
  //console.log(moment().unix());
  let history = useHistory()
  const auth = db_auth.auth()
  const [solAccepted, setSolAccepted] = useState(null)
  const [solCanceled, setSolCanceled] = useState(null)
  const [solicitudeId, setSolicitudeId] = useState(null)
  const [solicitude, setSolicitude] = useState({
    idUSer: idUser,
    usuario: userLogged.name + " " + userLogged.last_name,
    salida: "",
    llegada: "",
    Tipo: "",
    dir_salida: "",
    dir_llegada: "",
    accepted: false,
    canceled: false,
    date: moment().format("YYYY-MM-DD")

  })
  useEffect(() => {
    if (!logedIn) {
      history.push("")
    }
  }, [logedIn])

  useEffect(() => {
    var sol = db.collection("solicitudes").where("idUSer", "==", idUser).orderBy("time", "asc")
    sol.onSnapshot(handleSolicitudeCounter)
  }, [])

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

  function handleSnapshot(snapshot) {
    console.log("rastreando");
    snapshot.docChanges().forEach(function (change) {
      let solicitudeInfo = change.doc.data()
      console.log("change:", solicitudeInfo);
      setSolicitudeId(change.doc.id)
      setSolAccepted(solicitudeInfo.accepted)
      setSolCanceled(solicitudeInfo.canceled)
    });
  }

  const handleSolicitudeCounter = createFnCounter(handleSnapshot, 1);

  function onLogOut() {
    console.log("closing");
    auth.signOut().then(() => {
      console.log("sign-out");
      dispatch({
        type: 'SET_ID_USER',
        payload: "",
      });
      dispatch({
        type: 'LOGED_IN',
        payload: false,
      });
      // Sign-out successful.
    }).catch(function (error) {
      // An error happened.
    });
  }

  function onChangeSolicitude(field, value) {
    setSolicitude({ ...solicitude, [field]: value })
  }

  async function sendSolicitude() {
    console.log(solicitude);
    let solicitudeT = { ...solicitude, time: moment().unix() }
    await db.collection('solicitudes').doc().set(solicitudeT)
    //history.push(registerInfo.role.toLowerCase())
    toast('Solicitud enviada', {
      type: "success",
      autoClose: 2000
    })
  }

  async function cancelSolicitude() {
    await db.collection('solicitudes').doc(solicitudeId).update({ canceled: true })
  }

  return (
    <div className="all_menu_background">
      <div className="client_container" /* onClick={() => onLogOut()} */>
        <div className="client_menu_container">
          <div className="header_menu_client" onClick={() => onLogOut()}>
            <img src={logo} alt="logo" />
            <div className="user_logged_info">
              <i class="large material-icons">account_circle</i>
              <p>{userLogged.name} {userLogged.last_name}</p>
            </div>
          </div>

          <div className="menu_navigate_client" >
            {solAccepted?
              <div className="accepted_msg">
                Su soliciud ha sido aceptada, en momentos se le asignará un servicio.
              </div>
              :
              null
            }
          </div>


        </div>
        <div className="client_render_info">
          {solAccepted === false && solCanceled === false &&
            <div className="pop_up_wait">
              <div className="pup_up_info">
                <div>Esperando respuesta de la solicitud</div>
                <div className="btn_solicitud_cancele" onClick={() => cancelSolicitude()}>
                  Cancelar servicio
                </div>
              </div>
            </div>

          }
          <Map zoom={15} className={"map-size"} />
          <div className="form_service_container">
            <div className="inner_form">
              <select name="salida" id="" onChange={(e) => onChangeSolicitude(e.target.name, e.target.value)} >
                <option disabled selected>Lugar de salida</option>
                <option value="Agunstin codazi">Agunstin codazi</option>
                <option value="Valledupar">Valledupar</option>
              </select>
              <select name="llegada" id="" onChange={(e) => onChangeSolicitude(e.target.name, e.target.value)} >
                <option disabled selected value="">Lugar de llegada</option>
                <option value="Valledupar">Valledupar</option>
                <option value="Agunstin codazi">Agunstin codazi</option>
              </select>
              <select name="tipo" id="" onChange={(e) => onChangeSolicitude(e.target.name, e.target.value)} >
                <option disabled selected>Tipo de servicio</option>
                <option value="Estación-Estación">Estación-Estación</option>
                <option value="Puerta-Puerta">Puerta-Puerta</option>
              </select>
            </div>
            {solicitude.tipo === "Puerta-Puerta" &&
              <div className="set_address">
                <input
                  type="text"
                  name="dir_salida"
                  placeholder="Dirección de salida"
                  onChange={(e) => onChangeSolicitude(e.target.name, e.target.value)}
                />
                <input
                  type="text"
                  name="dir_llegada"
                  placeholder="Dirección de llegada"
                  onChange={(e) => onChangeSolicitude(e.target.name, e.target.value)}
                />
              </div>
            }
            <div className="btn_solicitud" onClick={() => sendSolicitude()}>
              Solicitar servicio
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  idUser: state.carmoto.idUser,
  logedIn: state.carmoto.logedIn,
  userLogged: state.carmoto.userLogged
});

export default connect(mapStateToProps)(Client);