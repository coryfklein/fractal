function CanvasState(canvas) {
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;

  var context = canvas.getContext('2d');
  this.context = context;

  var id = context.createImageData(1,1);
  this.id = id;

  var d = id.data;
  this.d = d;

  d[0] = 80;
  d[1] = 80;
  d[2] = 180;
  d[3] = 255;

  var p1 = {x:0, y:0};
  var p2 = {x:0, y:this.height};
  var p3 = {x:this.width, y:this.height};

  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;

  this.draw();
}

CanvasState.prototype.draw = function() {
  var context = this.context;
  context.fillStyle = '#000000';
  context.fillRect(0, 0, this.width, this.height);

  var i = 0;
  for(i = 0; i < 100; i = i+1) {
    this.drawPixel(i+20,i);
  }

  var p1 = this.p1;
  var p2 = this.p2;
  var p3 = this.p3;
  this.drawLine(p1, p3);
}

CanvasState.prototype.drawPixel = function(x, y) {
  this.context.putImageData(this.id, x, y)
}

CanvasState.prototype.drawLine = function(p1, p2) {
  var context = this.context;

  context.fillStyle = '#66d';
  context.strokeStyle = '#66d';

  context.beginPath();
  context.moveTo(p1.x, p1.y);
  context.lineTo(p2.x, p2.y);
  context.lineWidth = 1;
  context.stroke();
  context.closePath();
}

function init() {
  var s = new CanvasState(document.getElementById('canvas'));
}

$(document).ready(init);
