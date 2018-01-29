"use strict";

class World {
  constructor(width, height){
    this.width = width;
    this.height = height;
    this.layers = [];
    this.allow_negative = false;
    this.debug_level = 1;
    this.add = this.add.bind(this);
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
  add(entity, depth=100){
    const layer = this.find_or_create_world_layer(depth);
    if(entity.physics && !layer.physics)
      layer.enable_physics();
    layer.add(entity);
  }
}
