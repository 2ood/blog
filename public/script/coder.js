
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

  const first = document.querySelector(".slide-popout-container li[index='0'] div:first-of-type");

  const project_name = first.getAttribute('name');

  db.collection('projects').doc(project_name).get().then((doc)=>{
    if(doc.exists){
      first.querySelector("div:last-of-type").innerHTML=
      `<h3>${doc.data().TITLE}</h3>
      <p>${doc.data().SUMMARY}</p>
      `;  

      first.addEventListener('click',(evt)=>{
        window.location.href=doc.data().HREF;
      });

      storage.ref(doc.data().IMAGE).getDownloadURL().then((url) => {
        var img = first.querySelector("img");
        img.setAttribute('src', url);
      }).catch((error) => {
        console.log("error in downloading profile pic : ",error);
      });
    }
  });
}

function onAuthAnonymous() {
  onAuthAnonymousTopBar();
}
