import React, {useEffect, useState} from 'react'
import {db_auth} from "../../firebase"

import "./auth.css"

export default function Auth() {
 const initRegister = {
  name:"",
  last_name :"",
  email: "",
  password: "",
  confirm_pss: ""
 }
 
 const [registerInfo, setRegisterInfo] = useState(initRegister)
 const [loginInfo, setLoginInfo] = useState({
  email:"",
  password:"",
 })
 const [role,setRole] = useState("")
 const roles = ["Administrador", "Conductor", "Cliente"]
 const auth = db_auth.auth()
 
 function onChangeRegister (field, value) {
  setRegisterInfo({...registerInfo,[field]:value})
 }

 function onChangeLogin(field,value) {
  setLoginInfo({...loginInfo,[field]:value})
  console.log(field,value);
 }

 function toRegister() {
  console.log("esta aqui");
  auth
  .createUserWithEmailAndPassword(registerInfo.email, registerInfo.password)
  .then(userCred=>{
   console.log("registrado",userCred);
   setRegisterInfo(initRegister)
  }) 
 }

 function toLogin() {
  console.log("esta aqui");
  auth
  .signInWithEmailAndPassword(loginInfo.email, loginInfo.password)
  .then(userCred=>{
   console.log("logged",userCred);
   setLoginInfo(
    {
     email:"",
     password:"",
    }
   )
  }) 
 }

 return(
  <div className="auth_container" >
   <div className="both_forms_container">
    <div className="register_form">
     <h3>Registro</h3>
     <div className="role_group">
      <p>Elija un rol:</p>
      {
       roles.map((rol,index)=>{
        return(
         <span key={index} className={rol===role?"role_option option_selected":"role_option"} onClick={()=> setRole(rol)}>
          {rol}
         </span>
        )
       })
      }
     </div>
     <input 
      type="text" name='name'
      value={registerInfo.name} 
      onChange={(e)=>onChangeRegister(e.target.name, e.target.value)} 
      placeholder="Nombre" 
     />
     <input 
      type="text"
      value={registerInfo.last_name}
      name='last_name' 
      onChange={(e)=>onChangeRegister(e.target.name, e.target.value)} 
      placeholder="Apellido"
     />
     <input 
      type="text"
      value={registerInfo.email}
      name='email'
      onChange={(e)=>onChangeRegister(e.target.name, e.target.value)} 
      placeholder="Correo" 
     />
     <input 
      type="password"
      value={registerInfo.password} 
      name='password' 
      onChange={(e)=>onChangeRegister(e.target.name, e.target.value)} 
      placeholder="Contraseña"
     />
     <input 
      type="password"
      value={registerInfo.confirm_pss} 
      name='confirm_pss' 
      onChange={(e)=>onChangeRegister(e.target.name, e.target.value)} 
      placeholder="Confirma contraseña"
     />
     <div className="btn_register" onClick={()=>toRegister()}>
      Registrar
     </div>
    </div>
    <div className="login_form">
     <h3>Iniciar sesión</h3>
     <input 
      type="text" 
      value={loginInfo.email}
      name="email"
      onChange={(e)=>onChangeLogin(e.target.name, e.target.value)}
      placeholder="Correo" 
     />
     <input 
      type="text"
      value={loginInfo.password}
      name="password" 
      onChange={(e)=>onChangeLogin(e.target.name, e.target.value)}
      placeholder="Contraseña" 
     />
     <div className="btn_login" onClick={()=>toLogin()}> 
      Iniciar
     </div>
    </div>
   </div>
  </div>
 )
}
