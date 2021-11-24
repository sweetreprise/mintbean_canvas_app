let drawing, setPsychedelic = false;
let canvas, ctx, prevX, prevY, numLines;
let restore_array = [];
let index = -1;

const container = document.getElementById("settings-bottom");
const psyBtn = document.getElementById("psychedelic");
const canvasSection = document.getElementById("canvas-section");
const landingPage = document.getElementById("landing-page");
const canvasLink = document.querySelectorAll(".canvas-link");
const logo = document.querySelector(".logo");
const lines = document.querySelectorAll("input[type='radio']");
const saveBtn = document.getElementById("save");

// * --------- GETS CANVAS VALUES / SETTINGS --------- * //
// gets dimensions of the canvas
function getCanvasDimensions() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
 
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }
}
 
 //get selected color from color input
function setStrokeColor() {
    const colorPicker = document.querySelector("#brush-color").value;
    return colorPicker;
}
 
 //psychedelic version (draw in random colour on canvas)
function setRandomColor() {
    const r = Math.round(Math.random() * 200);
    const g = Math.round(Math.random() * 200);
    const b = Math.round(Math.random() * 200);
    return `rgb(${r}, ${g}, ${b})`;
}
 
 // toggles psychedelic class
 function switchPsychMode() {
    setPsychedelic = setPsychedelic === false ? true : false;
    psyBtn.classList.toggle("on");
    return setPsychedelic;
}

// gets the number of lines being drawn on the canvas from radio input
function getLines() {
    lines.forEach(function(line) {
        if(line.checked) {
            numLines = line.value
        }
    });
    return numLines
}

// undos last drawn lines
function undo_last() {
    if (index <= 0) {
        reset();
    } else {
        index -=1;
        restore_array.pop();
        ctx.putImageData(restore_array[index], 0, 0);
    }
}

function saveImage() {
    let data = canvas.toDataURL("imag/png");
    let a = document.createElement("a");
    a.href = data;
    a.download = "canvas.png";
    a.click();
}

// resets canvas to white background
function reset() {
    ctx.fillStyle = "white"
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// * --------- HANDLES SHOWING / HIDING PAGE COMPONENTS --------- * //
// hides page components
function hidePageComponents(component) {
    component.classList.add("hidden");
}
  
// shows page components
function showPageComponents(component) {
    component.classList.remove("hidden");
}
  
// loops through canvas links, adds eventListener
for (link of canvasLink) {
    link.addEventListener("click", () => {
        hidePageComponents(landingPage);
        showPageComponents(canvasSection);
    });
}

// event listener for landing page / logo
logo.addEventListener("click", () => {
    hidePageComponents(canvasSection);
    showPageComponents(landingPage);
    reset();
});


// * --------- DRAWING FUNCTIONALITY --------- * //
 // start canvas drawing
function startDrawing(e) {
    drawing = true;
}

// ends canvas drawing
function endDrawing(e) {
    ctx.stroke();
    ctx.closePath();
    drawing = false;

    restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    index += 1;
}

// draws lines on canvas
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}


// sets line styles, calls drawLine function
function draw(e) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    //sets shadow blur line from html range input
    ctx.shadowBlur = document.querySelector("#blur-line").value;
    //sets line width from html range input
    ctx.lineWidth = document.querySelector("#line-width").value;

    //sets stroke color
    if (setPsychedelic) {
        ctx.strokeStyle = setRandomColor();
        ctx.shadowColor = setRandomColor();
    } else {
        ctx.strokeStyle = setStrokeColor();
        ctx.shadowColor = setStrokeColor();
    }

    const rect = canvas.getBoundingClientRect()
    //sets x, y on canvas
    const x = e.offsetX || (e.touches[0].clientX - rect.left)
    const y = e.offsetY || (e.touches[0].clientY - rect.top)

    getLines();
    getCanvasDimensions();

    const width = canvas.width;
    const height = canvas.height;

    //drawing depending on number of lines
    if (drawing && numLines === '2') {
        drawLine(prevX, prevY, x, y);
        drawLine(width - prevX, height - prevY, width - x, height - y);
    
    } else if (drawing && numLines === '4') {
        drawLine(prevX, prevY, x, y);
        drawLine(width - prevX, height - prevY, width - x, height - y);
        drawLine(width - prevX, prevY, width - x, y);
        drawLine(prevX, height - prevY, x, height - y);

    } else if (drawing) {
        drawLine(prevX, prevY, x, y);
        drawLine(width - prevX, height - prevY, width - x, height - y);
        drawLine(width - prevX, prevY, width - x, y);
        drawLine(prevX, height - prevY, x, height - y);
        drawLine(prevY, prevX, y, x);
        drawLine(height - prevY, width - prevX, height - y, width - x);
        drawLine(height - prevY, prevX, height - y, x);
        drawLine(prevY, width - prevX, y, width - x);
    }
    
    prevX = x
    prevY = y
}

// function called once window is loaded
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
        startDrawing();
    }, {passive : false});

    canvas.addEventListener("touchmove", e => {
        e.preventDefault();
        draw(e);
    }, {passive : false});

    canvas.addEventListener("touchend", e => {
        e.preventDefault();
        endDrawing();
    }, {passive : false});
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

  // handles undo button
  if (id === "undo") {
    undo_last();
  }

  // handles psychedelic button click
  if (id === "psychedelic") {
    switchPsychMode();
  }

  if (id === "save") {
      saveImage();
  }
}

window.addEventListener("load", load);
container.addEventListener("click", handleSettingsClick);