"use strict";

class Sprite extends Entity {
  constructor(asset, x, y, width, height, angle, mass){
    super(x, y, width, height, angle, mass);
    this.asset = asset;
    this.repeat = false;
  }

  render(ctx){
    if(this.asset)
      if(this.repeat){
        ctx.fillStyle = ctx.createPattern(this.asset, this.repeat);
        ctx.fillRect(-this.height/2, -this.width/2, this.height, this.width);
      } else {
        ctx.drawImage(this.asset, -this.height/2, -this.width/2, this.height, this.width);
      }
    else {
      ctx.fillStyle = "#222222";
      ctx.fillRect(-this.height/2, -this.width/2, this.height, this.width);
    }
    super.render(ctx);
  }
}
