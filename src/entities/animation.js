"use strict";

class Animation extends Sprite {
  constructor(assets, x, y, width, height, angle, mass){
    super(null, x, y, width, height, angle, mass);
    this.assets = assets;
    this.repeat = false;
    this.speed = 1;
    this.index = 0;
    this.timer = 0;
    this.reverse = false;
    this.play = true;
  }

  update(dt){
    super.update(dt);
    this.increment_animation(dt);
  }

  increment_animation(dt){
    if(!this.play) return;

    const direction = this.reverse === true ? -1 : 1;
    this.timer = (this.assets.length + (this.timer + this.speed*dt*direction)) % this.assets.length;
    const new_index = Math.floor(this.timer);
    if(new_index == this.index) return;

    if(this.random){
      this.index = Math.floor(Math.random()*this.assets.length);
      this.timer = this.index;
    }
    else
      this.index = new_index;
  }

  render(ctx){
    this.render_animation_frame(ctx);
    super.render(ctx);
  }

  render_animation_frame(ctx){
    this.render_asset(this.assets[this.index], ctx);
  }
}
