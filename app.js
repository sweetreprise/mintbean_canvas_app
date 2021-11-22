let drawing, setPsychedelic = false;
let canvas, ctx, prevX, prevY, numLines;

const container = document.getElementById("settings-bottom");
const checkbox = document.querySelector('input[type="checkbox"]');
const psyBtn = document.getElementById("psychedelic");
const twoLines = document.getElementById("line-two");
const fourLines = document.getElementById("line-four");
const eightLines = document.getElementById("line-eight");

function load(e) {
  canvas = document.querySelector(".canvas");
  ctx = canvas.getContext("2d");

  // handles mouse events
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mouseup", endDrawing);
  canvas.addEventListener("mousemove", draw);

  // handles touch events
  canvas.addEventListener("touchstart", e => {
      e.preventDefault();
      startDrawing(e);
    }, false
  );
  canvas.addEventListener("touchmove", e => {
      e.preventDefault();
      draw(e);
    }, false
  );
  canvas.addEventListener("touchend", e => {
      e.preventDefault();
      endDrawing(e);
    }, false
  );
}

function startDrawing(e) {
  drawing = true;
  draw(e);
}

function endDrawing() {
  drawing = false;
  ctx.beginPath();
}

function draw(e) {
  ctx.linecap = "round";
  ctx.lineJoin = "round";
  //handle shadow blur line from html range input
  let shadow = document.querySelector("#blur-line").value;
  ctx.shadowBlur = shadow;

  //handle line width from html range input
  let lineWidth = document.querySelector("#line-width").value;
  ctx.lineWidth = lineWidth;

  //sets stroke color
  if (setPsychedelic === true) {
    ctx.strokeStyle = setRandomColor();
    ctx.shadowColor = setRandomColor();
  } else {
    ctx.strokeStyle = setStrokeColor();
    ctx.shadowColor = setStrokeColor();
  }

  const x = e.offsetX || e.touches[0].pageX;
  const y = e.offsetY || e.touches[0].pageY;

  getNumLines();

  if (drawing && numLines === '2') {
    drawLine(prevX, prevY, x, y);
    drawLine(500 - prevX, 500 - prevY, 500 - x, 500 - y);
  
  } else if (drawing && numLines === '4') {
    drawLine(prevX, prevY, x, y);
    drawLine(500 - prevX, 500 - prevY, 500 - x, 500 - y);
    drawLine(500 - prevX, prevY, 500 - x, y);
    drawLine(prevX, 500 - prevY, x, 500 - y);

  } else if (drawing) {
    drawLine(prevX, prevY, x, y);
    drawLine(500 - prevX, 500 - prevY, 500 - x, 500 - y);
    drawLine(500 - prevX, prevY, 500 - x, y);
    drawLine(prevX, 500 - prevY, x, 500 - y);
    drawLine(prevY, prevX, y, x);
    drawLine(500 - prevY, 500 - prevX, 500 - y, 500 - x);
    drawLine(500 - prevY, prevX, 500 - y, x);
    drawLine(prevY, 500 - prevX, y, 500 - x);
  }

  prevX = x;
  prevY = y;
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

//get selected color from color input
function setStrokeColor() {
  const colorPicker = document.querySelector("#brush-color").value;
  return colorPicker;
}

//psychedelic version
function setRandomColor() {
  const r = Math.round(Math.random() * 200);
  const g = Math.round(Math.random() * 200);
  const b = Math.round(Math.random() * 200);
  return `rgb(${r}, ${g}, ${b})`;
}

// toggles psychedelic class list
function switchPsychMode() {
    setPsychedelic = setPsychedelic === false ? true : false;
    psyBtn.classList.toggle("on");
    return setPsychedelic;
}

function getNumLines() {
    if (twoLines.checked) {
        numLines = twoLines.value
    } else if (fourLines.checked) {
        numLines = fourLines.value
    } else {
        numLines = eightLines.value
    }
    return numLines;
}

// handles clicks on bottom bar
function handleSettingsClick(e) {
  const dataColor = e.target.dataset.color;
  const target = e.target.tagName;
  const id = e.target.id;

  // changes canvas background
  if (target === "SPAN" && dataColor === "#fff") {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 500, 500);
  } else if (target === "SPAN" && dataColor === "#000") {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 500, 500);
  }

  // handles reset button
  if (id === "reset") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  // handles psychedelic button click
  if (id === "psychedelic") {
    switchPsychMode();
  }
}

window.addEventListener("load", load);
container.addEventListener("click", handleSettingsClick);

// handle show and hide page components
const canvasSection = document.getElementById("canvas");
const mainPage = document.getElementById("main-page");
const canvasLinks = document.querySelectorAll(".canvas-link"); // there are 2 buttons that the user can click to go to canvas. We can change to anything else
const logo = document.querySelector(".logo");

function hidePageComponents(component) {
  component.classList.add("hidden");
}

function showPageComponents(component) {
  component.classList.remove("hidden");
}

for (link of canvasLinks) {
  link.addEventListener("click", () => {
    hidePageComponents(mainPage);
    showPageComponents(canvasSection);
  });
}

logo.addEventListener("click", () => {
  hidePageComponents(canvasSection);
  showPageComponents(mainPage);
});
