const slides = document.getElementsByClassName("slide-popout-container");
for(i=0;i<slides.length;i++){
  const right = createSlideButton(true);
  const left = createSlideButton(false);
  right.classList.add("hidden");
  slides[i].insertBefore(left, parent.firstChild);
  slides[i].insertBefore(right, parent.null);
  let slide = slides[i].getElementsByClassName("slide-popout");
  if(slide!=null) {
    slide[0].classList.add("current");
  }
}

const slide_left_buttons = document.querySelectorAll(".slide-button[name='left']");
const slide_right_buttons = document.querySelectorAll(".slide-button[name='right']");

for(i=0;i<slide_right_buttons.length;i++) {
  slide_right_buttons[i].addEventListener("click",slideMove);
  slide_right_buttons[i].isForward = true;
}

for(i=0;i<slide_left_buttons.length;i++) {
  slide_left_buttons[i].addEventListener("click",slideMove);
  slide_left_buttons[i].isForward = false;
}

function createSlideButton(isForward){
  let result = document.createElement("div");
  result.classList.add("slide-button");
  result.innerHTML=(isForward?"<":">");
  result.setAttribute("name",isForward?"left":"right");
  return result;
}



function slideMove(evt) {
  let isForward = evt.srcElement.isForward;
  const parent = evt.srcElement.parentNode;

  const slides = parent.getElementsByClassName("slide-popout");
  const current_slide =  parent.querySelector(".current");
  const current_index = parseInt(current_slide.getAttribute('index'));

  let next_index = 0;
  let next_next = 0;
  let behind = 0;

  if(isForward){
    next_index = current_index+1;
    next_next = next_index+1;
    behind = current_index-1;
  }
  else {
    next_index = current_index-1;
    next_next = next_index-1;
    behind = current_index+1;
  }

  if(IndexInbound(next_index)==0) shiftCurrentClass(next_index);
  if(IndexInbound(next_next)==0) slides[next_next].classList.remove("vanish");
  if(IndexInbound(behind)==0) slides[behind].classList.add("vanish");
  checkWontGoFurther(parent,slides.length,current_index,next_index);

  function IndexInbound(target) {
    if(target < 0) return -1;
    if(target>slides.length-1) return 1;
    return 0;
  }

  function shiftCurrentClass(next) {
    current_slide.classList.remove("current");
    slides.item(next).classList.add("current");
  }

  function checkWontGoFurther(parent,length, current_index,next_index) {
    //hide directions to end
    if(next_index==0) {
      parent.querySelector(".slide-button[name='left']").classList.add("hidden");
    }
    if(next_index==length-1) {
      parent.querySelector(".slide-button[name='right']").classList.add("hidden");
    }

    //show directions available
    if(current_index==0) {
      parent.querySelector(".slide-button[name='left']").classList.remove("hidden");
    }
    else if(current_index==length-1) {
      parent.querySelector(".slide-button[name='right']").classList.remove("hidden");
    }
  }
}
