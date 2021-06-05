import firebase from 'firebase'; 
import '@firebase/firestore'; 
// Required for side-effects 
require("firebase/firestore");

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB-RYKn-rqWzj0PzWI38hwlLPzqZ3oACPI",
    authDomain: "animalcare-730f7.firebaseapp.com",
    projectId: "animalcare-730f7",
    storageBucket: "animalcare-730f7.appspot.com",
    messagingSenderId: "327903252473",
    appId: "1:327903252473:web:163cbd0a6f828d3093f728"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
if(!firebase.apps.length){ firebase.initializeApp(firebaseConfig); } 
//export default firebase.database() 
var db = firebase.firestore(); 
export default db;