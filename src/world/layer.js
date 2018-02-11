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
    const pending = this.pending_addition;
    if(this.physics_engine) Matter.Engine.update(this.physics_engine, dt*1000);
    this.pending_addition = [];

    this.entities = this.entities.concat(pending).map((entity) => {
      entity.update(dt);
      return entity;
    }).filter((entity) => {
      if(entity.dead && this.physics_engine && entity.physics_body){
        Matter.World.remove(this.physics_engine.world, entity.physics_body);
      }
      return entity.dead == false;
    });
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
    const viewport = this.world.engine.viewport;
    ctx.save();
    const offset = viewport.world_to_viewport(0,0,this.depth);
    ctx.translate(offset[0], offset[1]);
    const scale = this.depth/100;
    ctx.scale(scale, scale);
    
    if(this.debug_level >= 1){
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      this.render_border(ctx);
      this.render_axis(ctx);
    }

    this.entities.forEach((entity) => {
      const entity_offset = viewport.world_to_viewport(entity.x, entity.y, this.depth);
      if(entity_offset[0] + entity.max.x*scale < viewport.left_offset ||
         entity_offset[1] + entity.max.y*scale < viewport.top_offset ||
         entity_offset[0] + entity.min.x*scale > viewport.width+viewport.left_offset ||
         entity_offset[1] + entity.min.y*scale > viewport.height+viewport.top_offset)
        return;

      ctx.save();
      ctx.translate(entity.x, entity.y);
      ctx.rotate(entity.angle);
      entity.render(ctx);
      ctx.restore();
    });
    ctx.restore();
  }

  add(entity){
    entity.layer = this;
    this.pending_addition.push(entity);
    if(this.physics_engine && entity.physics_body) Matter.World.add(this.physics_engine.world, entity.physics_body);
  }

  enable_physics(){
    this.physics = true;
    this.physics_engine = Matter.Engine.create();
    this.physics_engine.world.gravity.scale = 0;
  }
}
