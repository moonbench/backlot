"use strict";

class Viewport {
  constructor(width, height){
    this.width = width;
    this.height = height;
    this.top_offset = 0;
    this.left_offset = 0;
    this.center_world_x = 0;
    this.center_world_y = 0;
    this.scale = 1;
  }

  clear(ctx){
    ctx.clearRect(this.left_offset, this.top_offset, this.width, this.height);
  }
  update(dt){
    if(this.tracking) this.track();
  }
  render_border(ctx){
    ctx.strokeStyle = "#3f4653";
    ctx.lineWidth = 15;
    ctx.strokeRect( this.left_offset, this.top_offset, this.width, this.height );
    ctx.lineWidth = 1;
  }
  center_on(world_x, world_y){
    if(world_x < this.limits.scrolling.min_x)
      this.center_world_x = this.limits.scrolling.min_x;
    else if(world_x >= this.limits.scrolling.max_x)
      this.center_world_x = this.limits.scrolling.max_x;
    else
      this.center_world_x = world_x;
    
    if(world_y < this.limits.scrolling.min_y)
      this.center_world_y = this.limits.scrolling.min_y;
    else if(world_y >= this.limits.scrolling.max_y)
      this.center_world_y= this.limits.scrolling.max_y;
    else
      this.center_world_y = world_y;
  }
  track(entity){
    if(entity) this.tracking = entity;
    const limits = this.visible_world_limits();

    const offsets = [0,0];
    if(this.tracking.x > limits[1][0]-this.width/6) offsets[0] += 10;
    if(this.tracking.x < limits[0][0]+this.width/6) offsets[0] -= 10;
    if(this.tracking.y > limits[1][1]-this.height/6) offsets[1] += 10;
    if(this.tracking.y < limits[0][1]+this.height/6) offsets[1] -= 10;
    this.center_on(this.center_world_x+offsets[0], this.center_world_y+offsets[1]);
  }
  set_limits(min_x, min_y, max_x, max_y){
    this.limits = {
      scrolling: {
        min_x: min_x + this.width/2,
        min_y: min_y + this.height/2,
        max_x: max_x - this.width/2,
        max_y: max_y - this.height/2
      }
    };
  }
  world_to_viewport(x, y, depth=100){
    return [
      this.width/2 + this.left_offset + ((x - this.center_world_x)*(depth/100)),
      this.height/2 + this.top_offset + ((y - this.center_world_y)*(depth/100))
    ];
  }
  viewport_to_world(x, y, depth=100){
    return [
      ((this.center_world_x + x)*(depth/100))-this.width/2 - this.left_offset,
      ((this.center_world_y + y)*(depth/100))-this.height/2 - this.top_offset
    ];
  }
  visible_world_limits(){
    return [
      this.viewport_to_world(this.left_offset, this.top_offset),
      this.viewport_to_world(this.width+this.left_offset, this.height+this.top_offset)
    ];
  }
}
