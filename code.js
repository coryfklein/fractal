function CanvasState(canvas, type) {
  this.canvas = canvas;
  this.type = type;
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

  var p1 = {x:this.width/2, y:0};
  var p2 = {x:0, y:this.height};
  var p3 = {x:this.width, y:this.height};

  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;

  this.palette = this.generatePalette();

  this.draw();
}

CanvasState.prototype.generatePalette = function() {
  var keyColors = [ {r:  0, g:  8, b:101},
                    {r:255, g:255, b:255},
                    {r:246, g:162, b:  0},
                    {r:  0, g:  0, b:  0} ];

  var numColors = 500;
  var colorsPerKey = numColors / keyColors.length;
  var colors = [];

  var key = 0;
  for(key = 0; key < keyColors.length; key++) {
    var firstColor = keyColors[key];
    var secondColor = keyColors[(key + 1) % keyColors.length];
    var i;
    for(i = 0; i < colorsPerKey; i++) {
      var percent = i / colorsPerKey;
      var r = Math.floor((secondColor.r - firstColor.r) * percent + firstColor.r);
      var g = Math.floor((secondColor.g - firstColor.g) * percent + firstColor.g);
      var b = Math.floor((secondColor.b - firstColor.b) * percent + firstColor.b);
      colors.push({r: r, g: g, b: b});
    }
  }

  return colors;
}

CanvasState.prototype.draw = function() {
  if(this.type === 'fractal') {
    //this.drawSierpinski();
    this.drawMandelbrot();
  }
  else if(this.type === 'palette') {
    this.drawPalette();
  }
}

CanvasState.prototype.pickRandomVertex = function() {
  var r = Math.random();
  if(r < 0.33) {
    return this.p1;
  }
  else if(r < 0.66) {
    return this.p2;
  }
  else {
    return this.p3;
  }
}

CanvasState.prototype.calculateNextP = function(currentP, targetP) {
  var nextP = {x: (currentP.x + targetP.x)/2, y: (currentP.y + targetP.y)/2}
  return nextP;
}

CanvasState.prototype.drawSierpinski = function() {
  var i = 0;
  var p = {x: 1, y:1};
  for(i = 0; i < 100000; i++) {
  p = this.calculateNextP(p, this.pickRandomVertex());
  this.drawPixel(p);
  }
}

CanvasState.prototype.drawMandelbrot = function() {
  var x = 0;
  var y = 0;
  var w = this.width;
  var h = this.height;
  for(y = 0; y < h; y++) {
    for(x = 0; x < w; x++) {
      this.drawMandelbrotPixel(x, y);
    }
  }
}

CanvasState.prototype.mapPixelToComplex = function(p) {
  var minR = -2;
  var maxR = 1;
  var minI = -1;
  var maxI = 1;

  var percentX = p.x / this.width;
  var percentY = p.y / this.height;

  return {r: percentX * (maxR - minR) + minR, i: percentY * (maxI - minI) + minI};
}

CanvasState.prototype.drawMandelbrotPixel = function(x,y) {
  var p = {x: x, y: y};
  var c = this.mapPixelToComplex(p);
  var iteration = 0;
  var maxIteration = 1000;
  var colorRotationPercent = 0.01;
  var colorIteration = maxIteration * colorRotationPercent;

  var r = c.r;
  var i = c.i;

  while(r*r + i*i < 2*2 && iteration < maxIteration) {
    rnext = r*r - i*i + c.r;
    i = 2 * r * i + c.i;
    r = rnext;
    iteration++;
  }

  var colorPercent = (iteration % colorIteration) / colorIteration;
  //var colorPercent = iteration / maxIteration;
  var colorIndex = Math.min(Math.floor(colorPercent * this.palette.length), this.palette.length - 1);
  var color = this.palette[colorIndex];
  var d = this.d;
  d[0] = color.r;
  d[1] = color.g;
  d[2] = color.b;

  this.drawPixel(p);

  return iteration === maxIteration;
}

CanvasState.prototype.drawPalette = function() {
  var x;
  for(x = 0; x < this.width; x++) {
    var index = Math.floor(x / this.width * this.palette.length);
    this.drawLineOfColor({x: x, y: 0}, {x: x, y: this.height}, this.palette[index]);
  }
}

CanvasState.prototype.convertColor = function(c) {
  return 'rgb('+c.r+','+c.g+','+c.b+')';
}

CanvasState.prototype.drawPixel = function(p) {
  this.context.putImageData(this.id, p.x, p.y)
}

CanvasState.prototype.drawLineOfColor = function(p1, p2, color) {
  var context = this.context;

  context.fillStyle = this.convertColor(color);
  context.strokeStyle = this.convertColor(color);

  context.beginPath();
  context.moveTo(p1.x, p1.y);
  context.lineTo(p2.x, p2.y);
  context.lineWidth = 2;
  context.stroke();
  context.closePath();
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
  var s = new CanvasState(document.getElementById('canvas'), 'fractal');
  var s2 = new CanvasState(document.getElementById('palette'), 'palette');
}

$(document).ready(init);
