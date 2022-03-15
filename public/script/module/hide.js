const hide_list = document.getElementsByClassName("hide-button");

function createHideButton(content) {
  const inner = content==null?"X":content;
  const result = document.createElement("div");
  result.className="hide-button";
  result.innerHTML = inner;
  result.addEventListener("click",(evt)=>{

    evt.srcElement.parentNode.classList.add("hidden");
  });

  return result;
}
