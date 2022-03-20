class Projects {
  static format = ["START","SUMMARY","TITLE","IMAGE","HREF"];

  constructor (start, summary, titile, image, href) {
      this.START = start;
      this.SUMMARY = summary;
      this.TITLE = title;
      this.IMAGE = image;
      this.HREF = href;
  }
  toString() {
      return this.START+","+this.SUMMARY+","+this.TITLE+","+this.IMAGE+","+this.HREF;
  }
  toJson() {
      return {
          START : this.START,
          SUMMARY : this.SUMMARY,
          TITLE : this.TITLE,
          IMAGE : this.IMAGE,
          HREF : this.HREF
        };
  }
}

function onAuthLogined(user) {
  onAuthLoginedTopBar(user);
  onAuthLoginedCoder();
  onAuthLoginedProjects();
}

function onAuthAnonymous() {
  onAuthAnonymousTopBar();
  alert("You need to login to watch the content.");
  window.location.href="login.html?from=coder.html";
}


function onAuthLoginedCoder() {
  const write = document.querySelector("button[name='add-project']");
  write.disabled = false;
  write.innerHTML = "add project";
}

function onAuthLoginedProjects() {
  const project_slides_ul = document.querySelector("#projects ul");
  const upcoming_slides_ul = document.querySelector("#upcoming ul");
  buildSlides(project_slides_ul, StaticFirebase.util.pathToRef(['projects']), projectTemplate);
  buildSlides(upcoming_slides_ul, StaticFirebase.util.pathToRef(['upcoming-projects']), projectTemplate);
}

function buildSlides(target_ul, collectionRef, templateFunc) {
  collectionRef.orderBy("START", "desc").get().then((querySnapshot)=>{
    let index= 0;
    querySnapshot.forEach((doc) => {
        target_ul.innerHTML+=projectTemplate(index++, doc.data());
        storage.ref(doc.data().IMAGE).getDownloadURL().then((url) => {
          var img = target_ul.querySelector(`img[alt='${doc.data().IMAGE}']`);
          img.setAttribute('src', url);
        }).catch((error) => {
          console.log("error in downloading profile pic : ",error);
        });

      }
    );
  }).then(()=>{
  const target_li = target_ul.getElementsByTagName("li");

  target_li[0].classList.add("show");
  target_li[0].classList.add("current");
  if(target_li.length>1) target_li[1].classList.add("show");

  const write = document.querySelector("button[name='add-project']");
  write.addEventListener('click',(event)=>{
    event.preventDefault();
    window.location.href="project_write.html";
  });
  });
}

function projectTemplate(index, json) {
  return `
  <li index="${index}">
    <div class="slide-div60-div40" name="${json.TITLE}">
      <div>
        <img src="#" alt="${json.IMAGE}"/>
      </div>
      <div>
        <h3>${json.TITLE}</h3>
        <p>${json.SUMMARY}</p>
        <a class="show-more-github" href="${json.HREF}">show more</a>
      </div>
    </div>
  </li>
  `;
}
