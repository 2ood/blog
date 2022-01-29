const to_top = document.querySelector("#to_top");
if(!(to_top===null)){
  to_top.innerHTML=`<span class="material-icons">
expand_less
</span>`;
  to_top.addEventListener('click',()=>{
    console.log("clicked!");
  });
}
