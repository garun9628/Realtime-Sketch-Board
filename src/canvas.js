let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".eraser");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "black";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;
let trackerArr = [];
let track = 0;

let mouseDown = false;
// API
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;
  beginPath({ x: e.clientX, y: e.clientY });
});
canvas.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    drawStroke({
      x: e.clientX,
      y: e.clientY,
      color: eraserToolFlag ? eraserColor : penColor,
      width: eraserToolFlag ? eraserWidth : penWidth,
    });
  }
});
canvas.addEventListener("mouseup", (e) => {
  mouseDown = false;

  let url = canvas.toDataURL();
  trackerArr.push(url);
  track = trackerArr.length - 1;
});

function beginPath(strokeObj) {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj) {
  tool.strokeStyle = strokeObj.color;
  tool.lineWidth = strokeObj.width;
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
}

pencilColor.forEach((colorElem) => {
  colorElem.addEventListener("click", (e) => {
    let color = colorElem.classList[0];
    penColor = color;
    tool.strokeStyle = penColor;
  });
});

pencilWidthElem.addEventListener("change", (e) => {
  penWidth = pencilWidthElem.value;
  tool.lineWidth = penWidth;
});
eraserWidthElem.addEventListener("change", (e) => {
  eraserWidth = eraserWidthElem.value;
  tool.lineWidth = eraserWidth;
});
eraser.addEventListener("click", (e) => {
  if (eraserToolFlag) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserWidth;
  } else {
    tool.strokeStyle = penColor;
    tool.lineWidth = penWidth;
  }
});

download.addEventListener("click", (e) => {
  let url = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = url;
  a.download = "board.png";
  a.click();
});

undo.addEventListener("click", (e) => {
  if (track > 0) track--;
  let trackObj = {
    track,
    trackerArr,
  };
  undoRedoCanvas(trackObj);
});
redo.addEventListener("click", (e) => {
  if (track < trackerArr.length - 1) track++;
  let trackObj = {
    track,
    trackerArr,
  };
  undoRedoCanvas(trackObj);
});

function undoRedoCanvas(trackObj) {
  track = trackObj.track;
  trackerArr = trackObj.trackerArr;
  let url = trackerArr[track];
  let img = new Image();
  img.src = url;
  img.onload = (e) => {
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}
