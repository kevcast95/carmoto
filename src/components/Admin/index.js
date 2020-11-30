import React, { useEffect, useState } from "react"
import { db_auth, db } from "../../firebase"
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom"

import Services from "./Services";
import Clients from "./Clients";
import Udrivers from "./Udrivers";

import logo from "../../asstes/logo.jpg"

import "./Admin.css"

function Admin({ logedIn,idUser,dispatch,userLogged }) {
  
 let history = useHistory()
 const auth = db_auth.auth()
 const navigateOpt = ["Servicios","Conductores","Clientes","Cerrar"]
 const icons = ["event","local_taxi","people","close"]
 const [renderView, setRenderView] = useState(navigateOpt[0]) 
 const [listSolicitudes, setListSolicitudes] = useState([])

 useEffect(() => {
  if (!logedIn) {
   history.push("")
  }
 }, [logedIn])

 useEffect(()=>{
  getListSolicitude() 
 },[])

 async function getListSolicitude() {
  await db.collection("solicitudes").orderBy("time", "asc").onSnapshot((querySnapshot) => {
    let allSolicitudes = []
    querySnapshot.forEach(user => {
      allSolicitudes.push({ ...user.data(), id: user.id })
    });
    setListSolicitudes(allSolicitudes)
  });
 }
 function onLogOut() {
  auth.signOut().then(() => {
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

 function naviagteTo(opt) {
   setRenderView(opt)
 }

 return (
  <div className="all_menu_background">
    <div className="admin_container" /* onClick={() => onLogOut()} */>
   <div className="admin_menu_container">
    <div className="header_menu">
      <img src={logo} alt="logo" />
      <div className="user_logged_info">
        <i class="large material-icons">account_circle</i>
        <p>{userLogged.name}{userLogged.last_name}</p>
      </div>
    </div>
    
    <div className="menu_navigate" >
      {
        navigateOpt.map((opt,index)=>{
          return (
            <div className="container_opt">
              <div 
                key={index} 
                className="single_opt" 
                onClick={index===navigateOpt.length-1?()=>onLogOut():()=>naviagteTo(opt)}
              >
               <i class="large material-icons">{icons[index]}</i>
              {opt}
            </div>
            </div>
          )
        })
      }
    </div>

   
   </div>
   <div className="admin_render_info">
      {renderView===navigateOpt[0] &&
        <Services
         allSolicitudes={listSolicitudes}
        />
      }
      {renderView===navigateOpt[1] &&
        <Udrivers/>
      }
      {renderView===navigateOpt[2] &&
        <Clients/>
      }
   </div>
  </div>
  </div>
 )
}

const mapStateToProps = (state) => ({
 idUser: state.carmoto.idUser,
 logedIn: state.carmoto.logedIn,
 userLogged:state.carmoto.userLogged

});

export default connect(mapStateToProps)(Admin)