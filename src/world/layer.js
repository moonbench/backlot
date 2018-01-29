"use strict";

class Layer {
  constructor(depth, world){
    this.depth = depth;
    this.world = world;
    this.entities = [];
    this.pending_addition = [];
    this.debug_level = 3;
  }

  update(dt){
    if(this.quadtree) this.quadtree.reset();
    const pending = this.pending_addition;
    this.pending_addition = [];

    this.entities = this.entities.concat(pending).map((entity) => {
      entity.update(dt);
      if(this.quadtree && entity.physics) this.quadtree.add(entity);
      return entity;
    }).filter((entity) => {
      return entity.dead == false;
    });

    if(this.quadtree) this.quadtree.run_collision_checks();
  }

  render_axis(ctx){
    if(this.depth == 100) ctx.setLineDash([8, 4]);
    else ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.moveTo(-this.world.width/2, 0);
    ctx.lineTo(this.world.width/2, 0);
    ctx.moveTo(0, -this.world.height/2);
    ctx.lineTo(0, this.world.height/2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  render_border(ctx){
    ctx.strokeRect(-this.world.width/2, -this.world.height/2, this.world.width, this.world.height);
  }

  render(ctx){
    ctx.save();
    const offset = this.world.engine.viewport.world_to_viewport(0,0,this.depth);
    ctx.translate(offset[0], offset[1]);
    if(this.debug_level >= 1){
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      this.render_border(ctx);
      this.render_axis(ctx);
    }

    const world_limits = this.world.engine.viewport.visible_world_limits();
    this.entities.forEach((entity) => {
      if(entity.x + entity.max.x < world_limits[0][0] ||
         entity.y + entity.max.y < world_limits[0][1] ||
         entity.x + entity.min.x > world_limits[1][0] ||
         entity.y + entity.min.y > world_limits[1][1])
        return;

      entity.pre_render(this.world.engine.viewport, ctx);
      entity.render(ctx);
      entity.post_render(ctx);
    });
    if(this.quadtree) this.quadtree.render(ctx);
    ctx.restore();
  }

  add(entity){
    entity.layer = this;
    this.pending_addition.push(entity);
  }

  enable_physics(){
    this.physics = true;
    this.quadtree = new QuadTree(this);
    this.quadtree.layer = this;
  }
}
