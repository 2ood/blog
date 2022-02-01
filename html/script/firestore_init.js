
const firebaseConfig = {
  apiKey: "AIzaSyBpoEOgyGHiSt5w07sh_KkSg852Bw34Qxc",
  authDomain: "ood-blog.firebaseapp.com",
  projectId: "ood-blog",
  storageBucket: "ood-blog.appspot.com",
  messagingSenderId: "732775523621",
  appId: "1:732775523621:web:b134125ad811e63aef66cc",
  measurementId: "G-V2MZY72Y23"
};

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();
const storage = app.storage();
const auth = app.auth();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

app.auth().onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("login").style.display="flex";
    var uid = user.uid;
    console.log("logined");

  } else {
    document.getElementById("logout").style.display="flex";
        console.log("logout");
  }
});
