"use strict";

class Cursor {
  constructor(x, y, canvas){
    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.debug_level = 1;
  }

  render(ctx){
    if(this.debug_level<1) return;
    ctx.lineWidth = "1";
    ctx.strokeStyle = "#62d8dd";
    ctx.strokeRect( this.x-4, this.y-4, 8, 8);

    if(this.debug_level<2) return;
    ctx.strokeText( Math.round(this.x) + ", " + Math.round(this.y), this.x + 10, this.y );
  
    if(this.debug_level<3) return;
    if(this.viewport){
      const world_coords = this.viewport.viewport_to_world(this.x, this.y);
      ctx.strokeText(Math.round(world_coords[0]) + ", " + Math.round(world_coords[1]), this.x + 10, this.y + 16);
    }
  }

  handle_mouse_move(event){
    this.move_to(
      event.clientX - this.canvas.getBoundingClientRect().left,
      event.clientY - this.canvas.getBoundingClientRect().top
    );
  }

  move_to(x, y){
    this.x = x;
    this.y = y;
  }
}
