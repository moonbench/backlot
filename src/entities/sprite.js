"use strict";

class Sprite extends Entity {
  constructor(asset, x, y, width, height, angle){
    super(x, y, width, height, angle);
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
    ctx.drawImage(asset, -this.width/2, -this.height/2, this.width, this.height);
  }

  render_pattern(asset, ctx){    
    ctx.fillStyle = ctx.createPattern(asset, this.repeat);
    ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
  }
}
