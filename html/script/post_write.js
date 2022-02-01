
const markdown = document.querySelector("textarea[name='CONTENT']");
const preview = document.querySelector("div.preview");

const viewButton = document.querySelector("button[name='viewButton']");

viewButton.addEventListener("click", (event)=>{
  preview.innerHTML=marked.parse(markdown.value);
  markdown.style.display=(markdown.style.display=="none")?"block":"none";
  preview.style.display=(preview.style.display=="none")?"block":"none";
  viewButton.textContent=(viewButton.textContent=="preview")?"back to edit mode":"preview";
});

const form = document.querySelector("form");

form.addEventListener("submit",onSubmit);

function onSubmit(event){
  event.preventDefault();
  console.log("submitted!");
  console.log(markdown.value.split("\n").join("\\n"));
}
