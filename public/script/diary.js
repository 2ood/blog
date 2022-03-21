class Note {
  static format = ["DATE","CONTENT"];

    constructor (date, content) {
        this.DATE = date;
        this.CONTENT = content;
    }
    toString() {
        return this.DATE+", "+this.CONTENT;
    }
    toJson() {
        return {
            DATE: this.DATE,
            CONTENT: this.CONTENT
            };
    }
}

function onAuthLogined(user) {
  onAuthLoginedTopBar(user);

  StaticFirebase.util.pathToRef(['notes','categories']).get().then((doc)=>{
    categories = doc.data().data;
    categoryReady=true;
    console.log("category ready");
    more_note.parentNode.insertBefore(buildNote(categories),more_note);
  });
}

function onAuthAnonymous() {
  onAuthAnonymousTopBar();
}

const more_note = document.getElementById("more-note");
more_note.addEventListener("click",(evt)=>{
  evt.srcElement.parentNode.insertBefore(buildNote(categories),evt.srcElement );
});

let categories =[];
let categoryReady = false;

function buildNote(category) {
  const result = document.createElement("div");
  result.className="note";

  result.appendChild(buildSearch());
  result.appendChild(document.createElement("hr"));
  result.appendChild(buildTextarea("text","content","content"));

  const submit = document.createElement("button");
  submit.type="submit";
  submit.className = "submit-notes";
  submit.innerHTML="Push";
  submit.addEventListener("click",handleSubmit);
  result.appendChild(submit);
  result.appendChild(createHideButton());

  const add_cat = result.querySelectorAll("li.add-category");
  for(obj of add_cat) {obj.addEventListener("click",handleAddCategory);}

  return result;
}

function buildSearch() {
  const result = document.createElement("div");
  result.className="search";

  const search_input = buildInput("text","type category","search-input");
  search_input.addEventListener("input", handleSearchInput);
  result.appendChild(search_input);

  const suggestions = document.createElement("div");
  suggestions.className="suggestions hidden";
  const ul = document.createElement("ul");

  const add_cat = document.createElement("li");
  add_cat.className = "hidden add-category";
  add_cat.addEventListener("click", handleAddCategory);
  ul.appendChild(add_cat);

  for(category of categories) {
    let child = buildNoteLi(suggestions, category);
    ul.appendChild(child);
  }
  suggestions.appendChild(ul);

  result.appendChild(suggestions);

  result.addEventListener("focusin",(evt)=>{
    handleSearchInput(evt);
    show(suggestions);
  });
  result.addEventListener("keydown",(evt)=>{
    const source = evt.srcElement;

    if(evt.code=="Enter") {
      const li_list =  source.parentNode.querySelectorAll("li:not(.hidden)");

      for(i=0;i<li_list.length;i++) {
        if(li_list[i].textContent===source.value) {
          li_list[i].click();
          break;
        }
      }
      handleSearchInput(evt);
    }
    else if(evt.code=="Escape") {
      hide(suggestions);
      source.value="";
    }
    else if(evt.code =="Backspace") {
      if(source.value=="") {
        const selected_list = source.parentNode.getElementsByClassName("selected-cat");
        source.parentNode.removeChild(selected_list[selected_list.length-1]);
        handleSearchInput(evt);
      }
    }
    else if(evt.code =="Tab") {
      evt.preventDefault();
        source.value = autoCompleteSuggestion(source.value);
    }

    else show(suggestions);

  });


  return result;
}

function buildInput(type, placeholder, className) {
  const result = document.createElement("input");
  result.type = type;
  result.placeholder = placeholder;
  result.className = className;

  return result;
}

function buildTextarea(type, placeholder, className) {
  const result = document.createElement("textarea");
  result.type = type;
  result.placeholder = placeholder;
  result.className = className;

  return result;
}

function buildNoteLi(suggestions, content) {
  let li = document.createElement("li");
  li.innerHTML=content;
  li.addEventListener("click",(evt)=>{
    addSelectedCat(evt.srcElement);
    hide(suggestions);
  });
  return li;
}

function handleSearchInput(evt) {
    const source = evt.srcElement;
    const add_cat = source.parentNode.querySelector("li.add-category");
    const suggestions_li = add_cat.parentNode.getElementsByTagName("li");
    const selected_list = source.parentNode.getElementsByClassName("selected-cat");
    add_cat.innerHTML =source.value;

    let flag=0;
    for(i=1;i<suggestions_li.length;i++) {
      const li = suggestions_li[i]  ;
      onlyShowIf(li.textContent.includes(source.value),li);
      if(li.textContent==source.value) flag++;
      for(selected of selected_list) {
        onlyShowIf(selected.innerHTML!=li.textContent, li);
      }
    }
    onlyShowIf(flag==0 && source.value.length>0,add_cat);

}

function handleAddCategory(evt) {
  const source = evt.srcElement;
  const new_cat_name = source.textContent;

  /*update notes/categories in firestore*/
  db.collection('notes').doc('categories').get().then((catDoc)=>{
    const former_cats = catDoc.data().data;

    db.collection('notes').doc('categories').update({
        data : [...former_cats,new_cat_name]
      }).catch((error) => {
        alertError(error,"updating category document");
    });
  });

  /*make new document of the new category and make nested collection*/
  db.collection('notes').doc(new_cat_name).set({}).then(()=>{
    const time = new Date();
    const json = new Note(time, ["Generated this category"]).toJson();
    const doc_name = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`;
    console.log(doc_name);
    db.collection('notes').doc(new_cat_name).collection('data').doc(doc_name).set(json);
  });

  /*update categories array on session*/
  categories.push(new_cat_name);

  /*update all suggestions_li*/
  const suggestions = document.getElementsByClassName("suggestions");
  for(s of suggestions) {
    const ul = s.querySelector("ul:first-of-type");
    ul.appendChild(buildNoteLi(s, new_cat_name));
  }

  /*add new category to selected_cats*/
  addSelectedCat(evt.srcElement);
}

function handleSubmit(evt){
  evt.preventDefault();

  const source  = evt.srcElement;
  const object  = source.parentNode;
  const markdown = object.querySelector("textarea.content");
  const selected_list = object.getElementsByClassName("selected-cat");

  const time = new Date();
  const content = markdown.value.split("\n").join("\\n");

  const newNote = new Note(time,[content]);
  const user = auth.currentUser;

  if(user==null) {
    alert("you should login to post a note.");
    return;
  }
  const doc_name = `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`;

  for(cat of selected_list) {
    const cat_name = cat.innerHTML;
    console.log("user", cat_name);
    let json ={};
    db.collection('notes').doc(cat_name).collection('data').doc(doc_name).get().then((docRef)=>{
      if(docRef.exists) {
        json = {
          DATE : time,
          CONTENT : [...docRef.data().CONTENT, content]
        };
        db.collection('notes').doc(cat_name).collection('data').doc(doc_name).update(json).then(()=>{console.log("updated")});
      }
      else db.collection('notes').doc(cat_name).collection('data').doc(doc_name).set(newNote.toJson()).then(()=>{console.log("added")});
    });

  }
  object.classList.add("swift-away");

}

function addSelectedCat(source) {
  const result = document.createElement("div");
  result.className="selected-cat";
  result.innerHTML = source.innerHTML;

  const target = source.parentNode.parentNode.parentNode;
  const input = target.querySelector("input.search-input");
  target.insertBefore(result,input);
  input.value="";
}

function autoCompleteSuggestion(query) {
  let result = [];
  for(cat of categories) {
    if(cat.includes(query)) result.push(cat);
  }

  return result;
}

function hide(target) {target.classList.add("hidden");}
function show(target) {target.classList.remove("hidden");}
function onlyShowIf(statement, target) {if(statement) show(target); else hide(target);}
