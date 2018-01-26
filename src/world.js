"use strict";

const World = (() => {

  function update(world, dt){
    world.layers.forEach(function(layer){
      layer.update(dt);
    });
  }

  function render_axis(world, ctx, dt){
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(-world.width/2, 0);
    ctx.lineTo(world.width/2, 0);
    ctx.moveTo(0, -world.height/2);
    ctx.lineTo(0, world.height/2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function render_border(world, ctx, dt){
    ctx.strokeRect(-world.width/2, -world.height/2, world.width, world.height);
  }

  function render(world, ctx, dt){

    if(world.debug_level >= 1){

      ctx.save();
      const offset = world.engine.viewport.world_to_viewport(0,0);
      ctx.translate(offset[0], offset[1]);
      ctx.strokeStyle = "#CCCCCC";
      render_border(world, ctx, dt);
      render_axis(world, ctx, dt);
      ctx.restore();
    }

    world.layers.forEach(function(layer){
      layer.render(ctx, dt);
    });
  }

  function add_player_entity(world, entity, depth){
    const layer = find_or_create_world_layer(world, depth);
    if(!layer.physics){
      layer.enable_physics();
      world.physics_layers.push(layer);
    }
    layer.add_player_entity(entity);
  }

  function add_entity(world, entity, depth){
    find_or_create_world_layer(world, depth).add_entity(entity);
  }

  function find_or_create_world_layer(world, depth){
    let layer = world.layers.find(function(layer){ return layer.depth == depth });
    if(!layer){
      layer = Layer.create(depth, world);
      world.layers.push(layer);
      sort_layers(world);
    }
    return layer;
  }

  function sort_layers(world){
    world.layers.sort(function(layer1, layer2){
      return layer1.depth-layer2.depth;
    })
  }

  return {
    create: (width, height) => {
      const world = {
        width,
        height,
        layers: [],
        physics_layers: [],
        allow_negative: false,
        debug_level: 1,
      };

      world.update = dt => update(world, dt);
      world.render = (ctx, dt) => render(world, ctx, dt);

      world.add_player_entity = (entity, layer=100) =>  add_player_entity(world, entity, layer);
      world.add_entity = (entity, layer=100) => add_entity(world, entity, layer);

      return world;
    }
  }
})();
