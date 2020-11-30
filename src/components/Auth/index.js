import React, { useEffect, useState } from 'react'
import { db_auth, db } from "../../firebase"
import { toast } from "react-toastify"
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom"
import Loading from "../Loading"
import "./auth.css"

function Auth({ dispatch, userLogged }) {
  let history = useHistory()
  const initRegister = {
    name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_pss: "",
    role: ""
  }
  const [loading, setLoading] = useState(false)
  const [initUserPos, setInitUserPos] = useState({
    lat:0,
    lng:0
   })
  const [registerInfo, setRegisterInfo] = useState(initRegister)
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  })

  const roles = ["Administrador", "Conductor", "Cliente"]
  const auth = db_auth.auth()

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(
     function(position){
      setInitUserPos({
       lat: position.coords.latitude,
       lng: position.coords.longitude,
      })
     },
     function(error){
      console.log(error);
     },
     {
      enableHighAccuracy:true
     }
    )
   },[])

  useEffect(() => {
    /* auth.signOut().then(() => {
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
     }); */
    setLoading(true)
    auth.onAuthStateChanged(user => {

      if (user) {
        dispatch({
          type: 'SET_ID_USER',
          payload: user.uid,
        });
        dispatch({
          type: 'LOGED_IN',
          payload: true,
        });
        initUser(user.uid)
        setLoading(false)
      }
    })
    setLoading(false)
  }, [])

  async function initUser(userId) {
    setLoading(true)
    await db.collection("users").onSnapshot((querySnapshot) => {
      let docs
      querySnapshot.forEach(user => {
        if (user.id === userId) {
          docs = { ...user.data(), id: user.id }
          dispatch({
            type: 'SET_USER_LOGGED',
            payload: docs,
          });
        }
      });
      setLoading(false)
      history.push(docs.role.toLowerCase())
    })
  }

  async function setUserInfo(userId) {
    setLoading(true)
    let register_n_location = Object.assign(registerInfo,initUserPos)
    await db.collection('users').doc(userId).set(register_n_location)
    //history.push(registerInfo.role.toLowerCase())
    toast('Registro exitoso', {
      type: "success",
      autoClose: 2000
    })
  }

  function onChangeRegister(field, value) {

    setRegisterInfo({ ...registerInfo, [field]: value })
  }

  function onChangeLogin(field, value) {
    setLoginInfo({ ...loginInfo, [field]: value })
  }

  function toRegister() {
    if (registerInfo.role === "") {
      toast('Por favor elegir un rol', {
        type: "error",
        autoClose: 3000
      })
      return
    }

    if (registerInfo.password === "") {
      toast('Por favor ingrese contraseña', {
        type: "error",
        autoClose: 3000
      })
      return
    }

    if (registerInfo.password !== registerInfo.confirm_pss) {
      toast('Contraseñas no coinciden', {
        type: "error",
        autoClose: 3000
      })
      return
    }
    auth
      .createUserWithEmailAndPassword(registerInfo.email, registerInfo.password)
      .then(userCred => {
        setUserInfo(userCred.user.uid)
        setRegisterInfo(initRegister)
      })
  }

  function toLogin() {
    setLoading(true)
    auth
      .signInWithEmailAndPassword(loginInfo.email, loginInfo.password)
      .then(userCred => {
        setLoginInfo(
          {
            email: "",
            password: "",
          }
        )
      })
    //setLoading(false)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="auth_container" >
      <div className="both_forms_container">
        <div className="register_form">
          <h3>Registro</h3>
          <div className="role_group">
            <p>Elija un rol:</p>
            <div className="role_btn_g">
              {
                roles.map((rol, index) => {
                  return (
                    <div
                      key={index}
                      className={rol === registerInfo.role ? "role_option option_selected" : "role_option"}
                      onClick={() => setRegisterInfo({ ...registerInfo, role: rol })}
                    >
                      {rol}
                    </div>
                  )
                })
              }
            </div>
          </div>
          <input
            type="text" name='name'
            value={registerInfo.name}
            onChange={(e) => onChangeRegister(e.target.name, e.target.value)}
            placeholder="Nombre"
          />
          <input
            type="text"
            value={registerInfo.last_name}
            name='last_name'
            onChange={(e) => onChangeRegister(e.target.name, e.target.value)}
            placeholder="Apellido"
          />
          <input
            type="text"
            value={registerInfo.email}
            name='email'
            onChange={(e) => onChangeRegister(e.target.name, e.target.value)}
            placeholder="Correo"
          />
          <input
            type="password"
            value={registerInfo.password}
            name='password'
            onChange={(e) => onChangeRegister(e.target.name, e.target.value)}
            placeholder="Contraseña"
          />
          <input
            type="password"
            value={registerInfo.confirm_pss}
            name='confirm_pss'
            onChange={(e) => onChangeRegister(e.target.name, e.target.value)}
            placeholder="Confirma contraseña"
          />
          
          {registerInfo.role === "Conductor" &&
            <div className="info_car">
              <p>Información del vheiculo</p>
              <div className="carinfo_container">

                <input
                  type="text"
                  value={registerInfo.license}
                  name='licence'
                  onChange={(e) => onChangeRegister(e.target.name, e.target.value)}
                  placeholder="Placa"
                />
                <input
                  type="text"
                  value={registerInfo.year}
                  name='year'
                  onChange={(e) => onChangeRegister(e.target.name, e.target.value)}
                  placeholder="Año/Modelo"
                />
                <input
                  type="text"
                  value={registerInfo.brand}
                  name='brand'
                  onChange={(e) => onChangeRegister(e.target.name, e.target.value)}
                  placeholder="Marca"
                />
              </div>
            </div>

          }
          <div className="btn_register" onClick={() => toRegister()}>
            Registrar
     </div>
        </div>
        <div className="login_form">
          <h3>Iniciar sesión</h3>
          <input
            type="email"
            value={loginInfo.email}
            name="email"
            onChange={(e) => onChangeLogin(e.target.name, e.target.value)}
            placeholder="Correo"
          />
          <input
            type="password"
            value={loginInfo.password}
            name="password"
            onChange={(e) => onChangeLogin(e.target.name, e.target.value)}
            placeholder="Contraseña"
          />
          <div className="btn_login" onClick={() => toLogin()}>
            Iniciar
     </div>
        </div>
      </div>
    </div>
  )
}
const mapStateToProps = (state) => ({
  idUser: state.carmoto.idUser,
  roleUser: state.carmoto.roleUser

});

export default connect(mapStateToProps)(Auth)
