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
    ctx.clearRect(0, 0, this.width, this.height);
  }
  render_border(ctx){
    ctx.strokeStyle = "#3f4653";
    ctx.lineWidth = 15;
    ctx.strokeRect( this.left_offset, this.top_offset, this.width, this.height );
    ctx.lineWidth = 1;
  }
  center_on(world_x, world_y){
    this.center_world_x = world_x;
    this.center_world_y = world_y;
  }
  world_to_viewport(x, y, depth=100){
    return [
      this.width/2 + ((x-this.center_world_x)*(depth/100)),
      this.height/2 + ((y-this.center_world_y)*(depth/100))
    ];
  }
  viewport_to_world(x, y, depth=100){
    return [
      ((this.center_world_x + x)*(depth/100))-this.width/2,
      ((this.center_world_y + y)*(depth/100))-this.height/2
    ];
  }
  visible_world_limits(){
    return [
      this.viewport_to_world(0,0),
      this.viewport_to_world(this.width, this.height)
    ];
  }
}
