
/*
async function getCommits(octokit){
  const commits = await octokit.request('GET /repos/2ood/blog/commits', {
    owner: 'octocat',
    repo: 'hello-world'
  });

  return commits;
}
*/

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
  db.collection('projects').orderBy("START", "desc").get().then((querySnapshot)=>{
    let index= 0;
    querySnapshot.forEach((doc) => {
        project_slides_ul.innerHTML+=`
        <li index="${index++}">
          <div class="slide-div60-div40" name="${doc.data().TITLE}">
            <div>
              <img src="#" alt="${doc.data().IMAGE}"/>
            </div>
            <div>
              <h3>${doc.data().TITLE}</h3>
              <p>${doc.data().SUMMARY}</p>
              <a class="show-more-github" href="${doc.data().HREF}">show more</a>
            </div>
          </div>
        </li>
        `;

        storage.ref(doc.data().IMAGE).getDownloadURL().then((url) => {
          var img = project_slides_ul.querySelector(`img[alt='${doc.data().IMAGE}']`);
          img.setAttribute('src', url);
        }).catch((error) => {
          console.log("error in downloading profile pic : ",error);
        });
      }
    );
  }).then(()=>{
    const project_slides_li = project_slides_ul.getElementsByTagName("li");

    project_slides_li[0].classList.add("show");
    project_slides_li[0].classList.add("current");
    if(project_slides_li.length>1) project_slides_li[1].classList.add("show");
  });

  const write = document.querySelector("button[name='add-project']");
  write.addEventListener('click',(event)=>{
    event.preventDefault();
    window.location.href="project_write.html";
  });
}
