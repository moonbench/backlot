"use strict";

const Layer = (() => {

  function update(layer, dt){
    if(layer.quadtree) layer.quadtree.reset();
    const pending = layer.pending_addition;
    layer.pending_addition = [];

    layer.entities = layer.entities.concat(pending).map(function(entity){
      entity.update(dt);
      if(layer.quadtree && entity.collidable) layer.quadtree.add(entity);
      return entity;
    }).filter(function(entity){
      return entity.dead == false;
    });

    if(layer.quadtree) layer.quadtree.run_collision_checks();
  }


  function render(layer, ctx, dt){
    const world_limits = layer.world.engine.viewport.visible_world_limits();
    layer.entities.forEach(function(entity){
      if(entity.max.x < world_limits[0][0] ||
         entity.max.y < world_limits[0][1] ||
         entity.min.x > world_limits[1][0] ||
         entity.min.y > world_limits[1][1])
        return;

      entity.pre_render(layer.world.engine.viewport, ctx, dt);
      entity.render(ctx, dt);
      entity.post_render(ctx, dt);
    });
    if(layer.quadtree) layer.quadtree.render(layer, ctx, dt);
  }


  function add_player_entity_to_layer(entity, layer){
    add_entity_to_layer(entity, layer);
    layer.player_entities.push(entity);
  }
  function add_entity_to_layer(entity, layer){
    entity.layer = layer;
    layer.pending_addition.push(entity);
  }

  function enable_physics(layer){
    layer.physics = true;
    layer.quadtree = QuadTree.create(layer);
    layer.quadtree.layer = layer;
  }
  return {
    create: (depth = 100, world) => {
      var layer = {
        depth,
        world,
        entities: [],
        player_entities: [],
        pending_addition: [],
      };

      layer.add_player_entity = entity => add_player_entity_to_layer(entity, layer);
      layer.add_entity = entity => add_entity_to_layer(entity, layer);

      layer.update = dt => update(layer, dt);
      layer.render = (ctx, dt) =>render(layer, ctx, dt);

      layer.enable_physics = () => enable_physics(layer);

      return layer;
    }
  }
})();
