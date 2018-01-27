"use strict";

class World {
  constructor(width, height){
    this.width = width;
    this.height = height;
    this.layers = [];
    this.physics_layers = [];
    this.allow_negative = false;
    this.debug_level = 1;
    this.add_entity = this.add_entity.bind(this);
  }

  update(dt){
    this.layers.forEach(layer => {
      layer.update(dt);
    });
  }
  render(ctx){
    this.layers.forEach(layer => {
      layer.render(ctx);
    });
  }
  find_or_create_world_layer(depth){
    let layer = this.layers.find(function(layer){ return layer.depth == depth });
    if(!layer){
      layer = new Layer(depth, this);
      this.layers.push(layer);
      this.sort_layers();
    }
    return layer;
  }
  sort_layers(){
    this.layers.sort(function(layer1, layer2){
      return layer1.depth-layer2.depth;
    })
  }
  add_player_entity(entity, depth){
    const layer = this.find_or_create_world_layer(depth);
    if(!layer.physics){
      layer.enable_physics();
      this.physics_layers.push(layer);
    }
    layer.add_player_entity(entity);
  }
  add_entity(entity, depth){
    this.find_or_create_world_layer(depth).add_entity(entity);
  }
}
