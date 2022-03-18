const firebaseConfig = {
  apiKey: "AIzaSyBpoEOgyGHiSt5w07sh_KkSg852Bw34Qxc",
  authDomain: "ood-blog.firebaseapp.com",
  projectId: "ood-blog",
  storageBucket: "ood-blog.appspot.com",
  messagingSenderId: "732775523621",
  appId: "1:732775523621:web:b134125ad811e63aef66cc",
  measurementId: "G-V2MZY72Y23"
};

class StaticFirebase {
  static app = firebase.initializeApp(firebaseConfig);
  static firestore  = this.app.firestore();
  static storage = this.app.storage();
  static auth = this.app.auth();

  static toString() {
    return "This is the static firebase";
  }

  static toJson() {
    return {
      APP : this.app,
      DB : this.firestore,
      AUTH : this.auth
    }
  }

  static get(collection, docName, jsonTemplate) {
    let result ={};
    firestore.collection(collection).doc(docName).get().then((docRef)=>{
      if(docRef.exists) {
        const keys = Object.keys(jsonTemplate);
        for(key of keys) {
          result[key] = doc.data().key;
        }
      }
      return result;
    });
  }


  static where(collection, query, jsonTemplate) {
    let result =[];
    let queryJson = query.toJson();
    firestore.collection(collection).where(queryJson.left,queryJson.operator,queryJson.right).get().then((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        const keys = Object.keys(jsonTemplate);
        const newJson = {};
        for(key of keys) {
          newJson[key] = doc.data().key;
        }
        result.push(newJson);
      });
      return result;
    });
  }
}

class firebaseQuery {
  constructor(left, operator, right) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  toString() {
    return this.left+this.operator+this.right;
  }
  toJson() {
    return  {
      left : this.left,
      operator : this.operator,
      right : this.right
    }
  }
}

class UserFirebase extends StaticFirebase {

  constructor(rootName) {
    this.root = rootName;
    this.userdb = super.firestore.collection(rootName);
    this.userstorage = super.storage;
  }
  toString() {
    return "This is the static firestore";
  }

  toJson() {
    return {
      APP : this.app,
      DB : this.db
    }
  }
}

const app = StaticFirebase.app;
const db = StaticFirebase.firestore;
const storage = StaticFirebase.storage;
const auth = StaticFirebase.auth;

auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);

function alertError(error, progressTitle) {
  var errorCode = error.code;
  var errorMessage = error.message;
  alert(`Error in ${progressTitle} : error(${errorCode}) : ${errorMessage}`);
}
