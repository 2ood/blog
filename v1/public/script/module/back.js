const back = document.getElementById("back");

if(!(back===null)) {
  back.innerHTML=`<span class="material-icons">arrow_back</span>`;
  back.addEventListener("click",()=>{
    history.back();
  });
}
