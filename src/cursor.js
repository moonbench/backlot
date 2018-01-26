"use strict";

const Cursor = (() => {
  function handle_mouse_move(cursor, event){
    cursor.move_to(
      event.clientX - cursor.canvas.getBoundingClientRect().left,
      event.clientY - cursor.canvas.getBoundingClientRect().top
    );
  }

  function move_cursor_to(cursor, x, y){
    cursor.x = x;
    cursor.y = y;
  }

  function render_cursor(cursor, ctx){
    if(cursor.debug_level<1) return;
    ctx.lineWidth = "1";
    ctx.strokeStyle = "#62d8dd";
    ctx.strokeRect( cursor.x-4, cursor.y-4, 8, 8);

    if(cursor.debug_level<2) return;
    ctx.strokeText( Math.round(cursor.x) + ", " + Math.round(cursor.y), cursor.x + 10, cursor.y );
  
    if(cursor.debug_level<3) return;
    if(cursor.viewport){
      const world_coords = cursor.viewport.viewport_to_world(cursor.x, cursor.y);
      ctx.strokeText(Math.round(world_coords[0]) + ", " + Math.round(world_coords[1]), cursor.x + 10, cursor.y + 16);
    }
  }


  return {
    create: (x, y, canvas) => {
      const cursor = {
        x,
        y,
        canvas,
        debug_level: 3,
      };

      cursor.handle_mouse_move = event => handle_mouse_move(cursor, event);
      cursor.move_to = (x, y) => move_cursor_to(cursor, x, y);

      cursor.render = ctx => render_cursor(cursor, ctx);

      return cursor;
    }
  }
})();
