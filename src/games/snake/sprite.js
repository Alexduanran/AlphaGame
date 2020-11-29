export class colorGrid {
  constructor(color) {
      const colorList = {
          red: "#B22222", purple: "#4B0082", green: "#9ACD32",
          blue: "#6495ED", yellow: "#DAA520", black: "#333333",
      };
      if (color in colorList) {
          this.color = colorList[color];
      } else {
          this.color = color;
      }
  }
  draw(ctx, x, y, w, h) {
      ctx.fillStyle = this.color;
      ctx.fillRect(x, y, w, h);
  }
}

export class Rect {
  constructor(x, y, w, h){
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
  }

  draw(context, sprite) {
      sprite.draw(context, this.x, this.y, this.w, this.h);
  }

  contains(point) {
      // check whether p is in [x,x+w) x [y,y+h)
      // inclusive in x and y; exclusive in x+w, y+h
      var x = point[0];
      var y = point[1];
      if (
        x >= this.x &&
        x < this.x + this.w  &&
        y >= this.y &&
        y < this.y + this.h
      ) {
          return true;
      } else {
          return false;
      }
  }

  collideRect(rect, overlap=true){
      if (!(overlap)) {
          // weak collision detection:
          // point collision; does not consider area overlap
          if (this.x == rect.x || this.y == rect.y){
              return true;
          } else {
              return false;
          }
      } else {
          // strong collision; detects area collision
          if (this.contains([rect.x, rect.y])
          || rect.contains([this.x, this.y])){
              return true;
          } else {
              return false;
          }
      }
  }
}

export var Sprite = function(fname) {

    // Static Variables
    var TO_RADIAN = Math.PI/180;

    // Instance Variables
    this.image = null;
    if (fname != undefined && fname != '' && fname != null) {
        this.image = new Image();
        this.image.src = fname;
        //console.log([this.image.width, this.image.height]);
    } else {
      console.log('cannot load file');
    }

    // Instance Methods

    // draw: start from top-left point
    this.draw = function(ctx, x, y, w, h) {
      // ctx.context.scale(ctx.dpr, ctx.dpr);
      if (w == undefined || h == undefined) {
        ctx.drawImage(this.image, x, y);
      } else {
        ctx.drawImage(this.image, x, y, w, h);
      }
    };

    // rotate image: from center of the image
    this.rotate = function(ctx, x, y, angle) {
      ctx.save();
      ctx.scale(ctx.dpr, ctx.dpr);
      ctx.translate(x, y);
      ctx.rotate(angle * this.TO_RADIAN);
      ctx.drawImage(this.image, -this.image.width/2, -this.image.height/2);
      ctx.restore();
    };
};

export default Sprite;