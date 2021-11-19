let drawing = false;
let canvas, ctx, prevX, prevY;

const resetBtn = document.getElementById("reset");
const container = document.getElementById("settings-bottom");

function load(e) {
    canvas = document.querySelector('.canvas');
    ctx = canvas.getContext('2d');

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mousemove', draw);
}

function startDrawing(e){
    drawing = true;
    draw(e);
}

function endDrawing(){
    drawing = false;
    ctx.beginPath();
}

function draw(e){
    ctx.lineWidth = 3;
    ctx.linecap = "round";
    ctx.strokeStyle = setRandomColor();

    const x = e.offsetX;
    const y = e.offsetY;
    
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
function setStrokeColor(){
    const color = document.getElementById("brush-color").value
    return color;
}

//psychedelic version
function setRandomColor(){
    const r = Math.round(Math.random() * 200);
    const g = Math.round(Math.random() * 200);
    const b = Math.round(Math.random() * 200);
    return `rgb(${r}, ${g}, ${b})`
}

function handleSettingsClick(e){
    const dataColor = e.target.dataset.color;
    const target = e.target.tagName;
    const id = e.target.id

    // changes canvas background
    if(target === "SPAN" && dataColor === "#fff") {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 500, 500);
    } 
    else if(target === "SPAN" && dataColor === "#000") {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 500, 500);
    }

    // handles reset button
    if(id === "reset") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

window.addEventListener('load', load);
container.addEventListener("click", handleSettingsClick);

// ideas to implement:
// - stroke size
// - diff buttons based on themes??
// - make responsive to mobile devices (touchmove)