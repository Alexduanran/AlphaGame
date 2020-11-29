export var HTML = function(canvas) {

  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');
  this.dpr = window.devicePixelRatio || 1;
  this.dpr *= 2;

  this.getContext = function() {
    this.context.scale(this.dpr, this.dpr);
    return this.context;
  }

  this.setSize = function(width, height) {
    this.canvas.style.width = width+'px';
    this.canvas.style.height = height+'px';
    this.canvas.width  = width*this.dpr;
    this.canvas.height = height*this.dpr;
  };

  this.setPosition = function(left, top) {
    this.canvas.style.left = left+'px';
    this.canvas.style.top = top+'px';
    this.canvas.left = this.canvas.offsetLeft;
    this.canvas.top = this.canvas.offsetTop;
  };

  // this.setSize(width, height);
  // this.setPosition(left, top);
};
