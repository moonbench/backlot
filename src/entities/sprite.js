"use strict";

class Sprite extends Entity {
  constructor(asset, x, y, width, height, angle, mass){
    super(x, y, width, height, angle, mass);
    this.asset = asset;
    this.repeat = false;
  }

  render(ctx){
    this.render_asset(this.asset, ctx)
    super.render(ctx);
  }

  render_asset(asset, ctx){
    if(!asset) return;
    if(this.repeat)
      this.render_pattern(asset, ctx);
    else
      this.render_image(asset, ctx);
  }

  render_image(asset, ctx){
    ctx.drawImage(asset, -this.height/2, -this.width/2, this.height, this.width);
  }

  render_pattern(asset, ctx){    
    ctx.fillStyle = ctx.createPattern(asset, this.repeat);
    ctx.fillRect(-this.height/2, -this.width/2, this.height, this.width);
  }
}
