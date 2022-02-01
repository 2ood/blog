const params = new URLSearchParams(window.location.search);

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


db.collection('posts').doc(params.get("id")).get().then((snapshot)=>{
      if(snapshot.exists){
        const dat = snapshot.data()
        document.getElementById("title").innerHTML=dat.TITLE;
        document.getElementById("writer").innerHTML=dat.WRITER;

        const date = dat.LAST_UPDATE.toDate();
        document.getElementById("last-update").innerHTML=`
        ${date.getYear()+1900}/${date.getMonth()+1}/${date.getDate()}`;


        const content = makeItMultipleLine(dat.CONTENT);
        parseAndLoadMd(content);

      } else {
        console.log("doesn't exist!");
      }
  });

function parseAndLoadMd(rawMd){
  const md = document.getElementById("md");
  md.innerHTML = marked.parse(rawMd);
}

function makeItMultipleLine(string) {
  return string.split("\\n").join("\n");
}
