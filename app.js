let drawing = false;
let canvas, ctx, prevX, prevY;

const container = document.getElementById("settings-bottom");
const checkbox = document.querySelector('input[type="checkbox"]');

function load(e) {
  canvas = document.querySelector(".canvas");
  ctx = canvas.getContext("2d");

  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mouseup", endDrawing);
  canvas.addEventListener("mousemove", draw);
  // handle touch events
  canvas.addEventListener("touchstart", function (e) {
    console.log(e)
    e.preventDefault();
    startDrawing(e);
    }, false
  );
  canvas.addEventListener("touchmove", function (e) {
    e.preventDefault();
    draw(e);
    }, false
  );
  canvas.addEventListener("touchend", function (e) {
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
  console.log(e)
  //handle lineWidth from html range input
  let lineWidth = document.querySelector("#line-width").value;
  ctx.lineWidth = lineWidth;

  //handling psycheledic or one color pick
  if (checkbox.checked) {
    ctx.strokeStyle = setRandomColor();
  } else {
    ctx.strokeStyle = setStrokeColor();
  }

  const x = e.offsetX || e.touches[0].pageX;
  const y = e.offsetY || e.touches[0].pageY; 

  if (drawing) {
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
}

window.addEventListener("load", load);
container.addEventListener("click", handleSettingsClick);

// ideas to implement:
// - stroke size
// - diff buttons based on themes??
// - make responsive to mobile devices (touchmove)

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
