let optionsContainer = document.querySelector(".options-container");
let toolsContainer = document.querySelector(".tools-container");
let pencilToolContainer = document.querySelector(".pencil-tool-container");
let eraserToolContainer = document.querySelector(".eraser-tool-container");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");
let pencilToolFlag = false;
let eraserToolFlag = false;
let optionsFlag = true;

optionsContainer.addEventListener("click", (e) => {
  optionsFlag = !optionsFlag;
  if (optionsFlag) openTools();
  else closeTools();
});

function openTools() {
  let iconElement = optionsContainer.children[0];
  iconElement.textContent = "menu";
  // 2nd way of doing the same
  // optionsContainer.removeChild(iconElement);
  // optionsContainer.innerHTML = `<span class="material-symbols-outlined"> menu </span>`;
  toolsContainer.style.display = "flex";
}
function closeTools() {
  let iconElement = optionsContainer.children[0];
  iconElement.textContent = "close";
  toolsContainer.style.display = "none";
  pencilToolContainer.style.display = "none";
  eraserToolContainer.style.display = "none";
}

pencil.addEventListener("click", (e) => {
  pencilToolFlag = !pencilToolFlag;
  if (pencilToolFlag) {
    pencilToolContainer.style.display = "block";
  } else {
    pencilToolContainer.style.display = "none";
  }
});
eraser.addEventListener("click", (e) => {
  eraserToolFlag = !eraserToolFlag;
  if (eraserToolFlag) {
    eraserToolContainer.style.display = "flex";
  } else {
    eraserToolContainer.style.display = "none";
  }
});

upload.addEventListener("click", (e) => {
  // open file explorer
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", (e) => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);
    let stickyTemplateHTML = `
    <div class="header">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note">
        <img src="${url}" />
    </div>
    `;
    createSticky(stickyTemplateHTML);
  });
});

sticky.addEventListener("click", (e) => {
  let stickyTemplateHTML = `
    <div class="header">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note">
        <textarea spellcheck="false"></textarea>
    </div>
    `;
  createSticky(stickyTemplateHTML);
});

function createSticky(stickyTemplateHTML) {
  let stickyContainer = document.createElement("div");
  stickyContainer.setAttribute("class", "sticky-container");
  stickyContainer.innerHTML = stickyTemplateHTML;

  document.body.appendChild(stickyContainer);
  let minimize = stickyContainer.querySelector(".minimize");
  let remove = stickyContainer.querySelector(".remove");

  noteActions(minimize, remove, stickyContainer);

  stickyContainer.onmousedown = function (event) {
    dragNDrop(stickyContainer, event);
  };
  stickyContainer.ondragstart = function (event) {
    return false;
  };
}

function noteActions(minimize, remove, stickyContainer) {
  remove.addEventListener("click", (e) => {
    stickyContainer.remove();
  });
  minimize.addEventListener("click", (e) => {
    let note = stickyContainer.querySelector(".note");
    let display = getComputedStyle(note).getPropertyValue("display");
    if (display === "none") {
      note.style.display = "block";
    } else {
      note.style.display = "none";
    }
  });
}

function dragNDrop(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;

  moveAt(event.pageX, event.pageY);

  // moves the element at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the element on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the element, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}
