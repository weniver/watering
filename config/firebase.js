import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDyAJoROXeaT502lDi_BSYy0HJBATGoJeU",
  authDomain: "watering-928c1.firebaseapp.com",
  databaseURL: "https://watering-928c1.firebaseio.com",
  projectId: "watering-928c1",
  storageBucket: "watering-928c1.appspot.com",
  messagingSenderId: "217633306671",
  appId: "1:217633306671:web:e066a7887852e98afd6eda",
  measurementId: "G-52E1TKHPX6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export var db = firebase.firestore();
export var auth =firebase.auth();
