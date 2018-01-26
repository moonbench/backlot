"use strict";

const Viewport = (() => {
  function clear(viewport, ctx){    
    ctx.clearRect(0, 0, viewport.width, viewport.height); 
  }
  function render_border(viewport, ctx, dt){
    ctx.strokeStyle = "#3f4653";
    ctx.lineWidth = 15;
    ctx.strokeRect( viewport.left_offset, viewport.top_offset, viewport.width, viewport.height );
    ctx.lineWidth = 1;
  }
  function center_on(viewport, world_x, world_y){
    viewport.center_world_x = world_x;
    viewport.center_world_y = world_y;
  }

  return {
    create: (width, height) => {
      const viewport = {
        width,
        height,
        top_offset: 0,
        left_offset: 0,
        center_world_x: 0,
        center_world_y: 0,
        scale: 1,
      };

      viewport.clear = ctx => clear(viewport, ctx);
      viewport.draw_border = ctx => render_border(viewport, ctx);

      viewport.world_to_viewport = (x, y, depth=100) => [
        viewport.width/2 + ((x-viewport.center_world_x)*(depth/100)),
        viewport.height/2 + ((y-viewport.center_world_y)*(depth/100))
      ];

      viewport.viewport_to_world = (x, y, depth=100) => [
        ((viewport.center_world_x + x)*(depth/100))-viewport.width/2,
        ((viewport.center_world_y + y)*(depth/100))-viewport.height/2
      ];

      viewport.visible_world_limits = () => [
        viewport.viewport_to_world(0,0),
        viewport.viewport_to_world(viewport.width, viewport.height)
      ];

      viewport.center_on = (x, y) => center_on(viewport, x, y);

      return viewport;
    }
  }  
})();
