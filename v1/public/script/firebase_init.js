const firebaseConfig = {
  apiKey: "AIzaSyBpoEOgyGHiSt5w07sh_KkSg852Bw34Qxc",
  authDomain: "ood-blog.firebaseapp.com",
  projectId: "ood-blog",
  storageBucket: "ood-blog.appspot.com",
  messagingSenderId: "732775523621",
  appId: "1:732775523621:web:b134125ad811e63aef66cc",
  measurementId: "G-V2MZY72Y23"
};
class FirestoreUtil {
  constructor(userfs) {
    this.firestore = userfs;
  }
  pathToRef(stringArray) {
    let result =this.firestore;
    for(let i=0; i<stringArray.length;i++) {
      if(i%2==0) result=result.collection(stringArray[i]);
      else result = result.doc(stringArray[i]);
    }
    return result;
  }

  docToJson(docRef, jsonTemplateArray) {
    let result = {};
    if(docRef.exists) {
      const docs = docRef.data();
      for(let key of jsonTemplateArray) {
        result[key] = docs[key];
      }
    }
    return result;
  }

  get(collectionRef, docName, jsonTemplateArray) {
    collectionRef.doc(docName).get().then((docRef)=>{
      return docToJson(docRef,jsonTemplateArray);
    });
  }

  orderByGet(collectionRef, orderTarget, isAscend, jsonTemplateArray) {
    let result =[];
    collectionRef.orderBy(orderTarget,isAscend?'asc':'desc').get().then((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        result.push(docToJson(doc,jsonTemplateArray));
      });
    });
    return result;
  }


  where(collectionRef, query, jsonTemplateArray) {
    let result =[];
    let queryJson = query.toJson();
    collectionRef.where(queryJson.left,queryJson.operator,queryJson.right).get().then((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        result.push(docToJson(doc,jsonTemplateArray));
      });
    });
    return result;
  }
}

class StaticFirebase {
  static app = firebase.initializeApp(firebaseConfig);
  static firestore  = this.app.firestore();
  static storage = this.app.storage();
  static auth = this.app.auth();
  static util = new FirestoreUtil(this.firestore);

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
}

class UserFirebase extends StaticFirebase {

  constructor(rootName) {
    super();
    this.root = rootName;
    this.userdb = StaticFirebase.firestore.collection('user_data').doc(rootName);
    this.userstorage = StaticFirebase.storage;
    this.util = new FirestoreUtil(this.userdb);
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
