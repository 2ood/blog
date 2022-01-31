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

const content = document.getElementById("table");
db.collection('posts').get().then((snapshot)=>{
  snapshot.forEach((doc)=>{

    const timestamp = doc.data().LAST_UPDATE.toDate();
    const year = timestamp.getYear();
    const month = timestamp.getMonth();
    const date = timestamp.getDate();
    const hours = timestamp.getHours()==0?"00":timestamp.getHours()
    const minutes = timestamp.getMinutes()==0?"00":timestamp.getMinutes();
    const today = new Date();

    let last_update="";
    if(year==today.getYear() && month==today.getMonth() && date==today.getDate()) {
        last_update = hours+":"+minutes;
    } else {
        last_update = `${year+1900}/${month+1}/${date}`;
    }
    content.innerHTML+=`

      <tr class="${doc.data().id}">
        <td>${doc.data().id}</td>
        <td><a href="post.html?id=${doc.data().TITLE}">${doc.data().TITLE}</a></td>
        <td>${doc.data().WRITER}</td>
        <td>${last_update}</td>
      </tr>

    `;
    console.dir(doc.data().LAST_UPDATE);
  });
});

const trs = document.getElementsByTagName("tr");
