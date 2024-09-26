import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBA6q_SkQXGnJS11uxTsHBOi295nXUtiyc",
  authDomain: "deakin-app-15393.firebaseapp.com",
  projectId: "deakin-app-15393",
  storageBucket: "deakin-app-15393.appspot.com",
  messagingSenderId: "707367987477",
  appId: "1:707367987477:web:c1700c689e3f9d6782a11c"
  };

  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();
  
  export { auth, db, storage };
