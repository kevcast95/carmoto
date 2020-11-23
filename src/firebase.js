import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"

var firebaseConfig = {
 apiKey: "AIzaSyAFsnTdJZaCS3bxqurJ0nR7RCngLiPjilE",
 authDomain: "car-moto-57917.firebaseapp.com",
 databaseURL: "https://car-moto-57917.firebaseio.com",
 projectId: "car-moto-57917",
 storageBucket: "car-moto-57917.appspot.com",
 messagingSenderId: "158071590348",
 appId: "1:158071590348:web:bb51804b04dff50713e169"
};

const fb = firebase.initializeApp(firebaseConfig);
export const db = fb.firestore()
export const db_auth =  firebase