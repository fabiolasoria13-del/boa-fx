// BOA FX — Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTdwU9AV239k5qrkl6XDY_doMPFFSnxQI",
  authDomain: "boa-fx.firebaseapp.com",
  projectId: "boa-fx",
  storageBucket: "boa-fx.firebasestorage.app",
  messagingSenderId: "631830445654",
  appId: "1:631830445654:web:e8d56dd63407028abfc5f7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
