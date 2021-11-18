let gameCanvas, gc, prevX, prevY;

addEventListener("load", load);

function load(e) {
  document.getElementById("reset").addEventListener("click", load);

  gameCanvas = document.querySelector(".canvas");
  gc = gameCanvas.getContext("2d");

  gameCanvas.addEventListener("mousemove", draw);

  gc.fillStyle = "white";
  gc.fillRect(0, 0, 600, 600);
}

function draw(e) {
  var x = e.offsetX;
  var y = e.offsetY;
  //set stroke color
  let color = setStrokeColor();
  gc.strokeStyle = color;
  gc.lineWidth = 4;
  if (e.buttons == 1) {
    drawLine(prevX, prevY, x, y);
    drawLine(600 - prevX, 600 - prevY, 600 - x, 600 - y);
    drawLine(600 - prevX, prevY, 600 - x, y);
    drawLine(prevX, 600 - prevY, x, 600 - y);
    drawLine(prevY, prevX, y, x);
    drawLine(600 - prevY, 600 - prevX, 600 - y, 600 - x);
    drawLine(600 - prevY, prevX, 600 - y, x);
    drawLine(prevY, 600 - prevX, y, 600 - x);
  }
  prevX = x;
  prevY = y;
}

function drawLine(x1, y1, x2, y2) {
  gc.beginPath();
  gc.moveTo(x1, y1);
  gc.lineTo(x2, y2);
  gc.stroke();
}

//get selected color
function setStrokeColor(){
    let color = document.getElementById("color").value
    return color;
}