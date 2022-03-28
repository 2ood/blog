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
  initializeSlideContainers();
  buildSlides(project_slides_ul, StaticFirebase.util.pathToRef(['projects']), projectTemplate, storage);
  buildSlides(upcoming_slides_ul, StaticFirebase.util.pathToRef(['upcoming-projects']), projectTemplate, storage);
}

function projectTemplate(index, json, storage) {

  const result = document.createElement("li");
  result.setAttribute("index",index);
  result.innerHTML=`
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
  `;

  storage.ref(json.IMAGE).getDownloadURL().then((url) => {
    var img = result.querySelector(`img[alt='${json.IMAGE}']`);
    img.setAttribute('src', url);
  }).catch((error) => {
    console.log("error in downloading profile pic :",error);
  });

  return result;
}
