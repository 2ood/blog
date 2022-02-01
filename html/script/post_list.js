const params = new URLSearchParams(window.location.search);

const content = document.getElementById("table");
db.collection('posts').orderBy("LAST_UPDATE", "desc").get().then((snapshot)=>{
  hideLoadingPlaceHolders();

  let index=1;
  snapshot.forEach((doc)=>{

    const timestamp = doc.data().LAST_UPDATE.toDate();
    const year = timestamp.getYear();
    const month = timestamp.getMonth();
    const date = timestamp.getDate();
    const hours = timestamp.getHours()<10?"0"+timestamp.getHours():timestamp.getHours()
    const minutes = timestamp.getMinutes()<10?"0"+timestamp.getMinutes():timestamp.getMinutes();
    const today = new Date();

    let last_update = `${year+1900}/${month+1}/${date}`;
    if(year==today.getYear()) {
      last_update = `${month+1}/${date}`;
      if(month==today.getMonth()) {
        if(date==today.getDate()) last_update = `오늘 ${hours}:${minutes}`;
        else ;
      } else ;
    }

    content.innerHTML+=`
      <tr class="${doc.id}">
        <td>${index++}</td>
        <td><a href="post.html?id=${doc.id}">${doc.data().TITLE}</br>
        <span class="grayscale-font">${doc.data().SUMMARY}</span></a></td>
        <td>${doc.data().WRITER}</td>
        <td>${last_update}</td>
      </tr>

    `;
  });
});

function hideLoadingPlaceHolders() {
  const loading = document.getElementsByClassName("loading");
  for(let i=0;i<loading.length;i++) {
    loading[i].hidden="true";
  }
}
