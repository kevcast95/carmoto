import React,{useEffect} from "react";
import {db_auth, db} from "../../firebase"
import { connect } from 'react-redux';
import {useHistory} from "react-router-dom"

function Dirver({logedIn,idUser,dispatch}) {
 let history = useHistory()
 const auth = db_auth.auth()
 useEffect(() => {
  if (!logedIn) {
   history.push("")
  }
 }, [logedIn])

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

 return(
  <div onClick={()=>onLogOut()}>Este es el conductor</div>
 )
}
const mapStateToProps = (state) => ({
 idUser: state.carmoto.idUser,
 logedIn: state.carmoto.logedIn
    
});

export default connect(mapStateToProps)(Dirver)