"use strict";

class Sprite extends Entity {
  constructor(x, y, width, height, angle, mass, asset, repeat){
    super(x, y, width, height, angle, mass);
    this.asset = asset;
    this.repeat = repeat;
  }

  render(ctx, dt){
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
    super.render(ctx, dt);
  }
}
