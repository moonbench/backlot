"use strict";

class Engine {
  constructor(canvas){
    this.slow = 1;
    this.now = null;
    this.remainder = 0;
    this.last = Util.current_time_in_ms();

    this.set_canvas(canvas);
    this.bind_mouse();
    this.set_fps(30);
    this.set_cursor(new Cursor(canvas.width/2, canvas.height/2, this.canvas));
    this.set_scale(1);
  }

  run(){
    requestAnimationFrame(() => this.draw_frame());
  }

  bind_mouse(){
    document.addEventListener("keydown", (event) => {
      if(this.handle_key) this.handle_key(event, true);
    });
    document.addEventListener("keyup", (event) => {
      if(this.handle_key) this.handle_key(event, false);
    });
    this.canvas.addEventListener("mousemove", (event) => {
      if(this.cursor) this.cursor.handle_mouse_move(event);
      if(this.handle_mouse_move) this.handle_mouse_move(event)
    });
    this.canvas.addEventListener("mousedown", (event) => {
      if(this.handle_mouse_button) this.handle_mouse_button(event, true, this.cursor)
    });
    this.canvas.addEventListener("mouseup", (event) => {
      if(this.handle_mouse_button) this.handle_mouse_button(event, false, this.cursor)
    });
  }

  set_canvas(canvas){
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.viewport = new Viewport(this.canvas.width, this.canvas.height);
  }

  set_fps(fps){
    this.fps = fps;
    this.step = 1/this.fps;
    this.slowstep = this.slow * this.step;
  }

  set_world(world){
    this.world = world;
    world.engine = this;
    this.viewport.set_limits(-world.width/2, -world.height/2, world.width/2, world.height/2);
  }

  set_cursor(cursor){
    this.cursor = cursor;
    cursor.viewport = this.viewport;
  }

  set_scale(scale){
    this.scale = scale;
    this.viewport.scale = scale;
  }

  update(dt){
    if(this.world) this.world.update(dt);
    if(this.update_function) this.update_function(dt);
    if(this.viewport) this.viewport.update(dt);
  }

  render(){
    if(this.viewport) this.viewport.clear(this.ctx);

    this.ctx.save();
    this.ctx.scale(this.scale, this.scale);
    if(this.world) this.world.render(this.ctx);
    this.ctx.restore();

    if(this.cursor) this.cursor.render(this.ctx);

    if(this.viewport) this.viewport.render_border(this.ctx);
  }

  draw_frame(){
    this.now = Util.current_time_in_ms();

    this.remainder += Math.min(1, (this.now - this.last)/1000);
    if(this.remainder >= this.slowstep){
      if(this.fps_meter) this.fps_meter.tickStart();
      while(this.remainder >= this.slowstep){
        this.remainder -= this.slowstep;
        this.update(this.step);
      }
      this.render();
      if(this.fps_meter) this.fps_meter.tick();
    }
    this.last = this.now;
    requestAnimationFrame(() => this.draw_frame());
  }
}
