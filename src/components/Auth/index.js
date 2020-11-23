import React, {useEffect, useState} from 'react'
import {db_auth, db} from "../../firebase"
import {toast} from "react-toastify"
import { connect } from 'react-redux';
import {useHistory} from "react-router-dom"
import "./auth.css"

function Auth({idUser,roleUser,dispatch}) {
 console.log(idUser,roleUser);
 let history = useHistory()
 const initRegister = {
  name:"",
  last_name :"",
  email: "",
  password: "",
  confirm_pss: "",
  role:""
 }
 
 const [registerInfo, setRegisterInfo] = useState(initRegister)
 const [loginInfo, setLoginInfo] = useState({
  email:"",
  password:"",
 })
 
 const roles = ["Administrador", "Conductor", "Cliente"]
 const auth = db_auth.auth()

 useEffect(()=>{
  dispatch({
   type: 'SET_ID_USER',
   payload: 12323,
});
  auth.onAuthStateChanged(user=>{
   if (user) {
    console.log("user:", user.uid);
    initUser(user.uid)
   }
  })
 },[])
 
 async function initUser(userId) {
  await db.collection("users").onSnapshot((querySnapshot)=>{
   const docs = []
   console.log(querySnapshot);
   querySnapshot.forEach(user => {
    console.log(user);
    docs.push({...user.data(),id:user.id})
   });
   history.push(docs[0].role.toLocaleLowerCase())
  })
 }

 async function setUserInfo(userId){
  await db.collection('users').doc(userId).set(registerInfo)
  history.push(registerInfo.role.toLocaleLowerCase())
  toast('Registro exitoso',{
   type: "success",
   autoClose:2000
  })
 }
 
 function onChangeRegister (field, value) {
  setRegisterInfo({...registerInfo,[field]:value})
 }

 function onChangeLogin(field,value) {
  setLoginInfo({...loginInfo,[field]:value})
  console.log(field,value);
 }

 function toRegister() {
  if (registerInfo.role==="") {
   toast('Por favor elegir un rol',{
    type: "error",
    autoClose:3000
   })
   return
  }

  if (registerInfo.password==="") {
   toast('Por favor ingrese contraseña',{
    type: "error",
    autoClose:3000
   })
   return
  }
  
  if (registerInfo.password!=registerInfo.confirm_pss) {
   toast('Contraseñas no coinciden',{
    type: "error",
    autoClose:3000
   })
   return
  }
  auth
  .createUserWithEmailAndPassword(registerInfo.email, registerInfo.password)
  .then(userCred=>{
   console.log("registrado",userCred.user.uid);
   setUserInfo(userCred.user.uid)
   setRegisterInfo(initRegister)
  })
 }

 function toLogin() {
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
         <span 
          key={index} 
          className={rol===registerInfo.role?"role_option option_selected":"role_option"} 
          onClick={()=> setRegisterInfo({...registerInfo,role:rol})}
         >
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
const mapStateToProps = (state) => ({
 idUser: state.carmoto.idUser,
 roleUser: state.carmoto.roleUser
    
});

export default connect(mapStateToProps)(Auth)
