// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4p_D7eGRNvNzhyX_O40L2LvpM19kv2H0",
  authDomain: "read-and-rate.firebaseapp.com",
  projectId: "read-and-rate",
  storageBucket: "read-and-rate.appspot.com",
  messagingSenderId: "860048381098",
  appId: "1:860048381098:web:b926c1e702a9442bacacd3",
  measurementId: "G-6KG74VGNQ2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// module.exports = { app };
