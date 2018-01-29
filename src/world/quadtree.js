"use strict";

const Node = (function(){
  const MAX_ENTITIES_PER_NODE = 1;
  const MIN_AREA_PER_NODE = 5000;
  const TOP_LEFT = 0, TOP_RIGHT = 1, BOTTOM_LEFT = 2, BOTTOM_RIGHT = 3;

  /*
   * Modify the node's contents
   */
  function indexes_of_children_overlapping(entity, node){
    const children_touching = [];
    const node_mid_x = node.x + node.width/2,
        node_mid_y = node.y + node.height/2;
    const entity_max_x = entity.x + entity.max.x,
        entity_max_y = entity.y + entity.max.y;
    const entity_min_x = entity.x + entity.min.x,
        entity_min_y = entity.y + entity.min.y;

    if(entity_min_x <= node_mid_x && entity_max_x > node.x){
      if( entity_min_y <= node_mid_y && entity_max_y > node.y) children_touching.push( TOP_LEFT );
      if( entity_max_y > node_mid_y && entity_min_y <= node.y+node.height) children_touching.push( BOTTOM_LEFT );
    }
    if(entity_max_x > node_mid_x && entity_min_x <= node.x + node.width){
      if( entity_min_y <= node_mid_y && entity_max_y > node.y) children_touching.push( TOP_RIGHT );
      if( entity_max_y > node_mid_y && entity_min_y <= node.y+node.height) children_touching.push( BOTTOM_RIGHT );
    }
    return children_touching;
  }
  function add_entity_to_overlapping_children(entity, node){
    indexes_of_children_overlapping(entity, node).forEach(function(child_node_index){
      add_entity_to_node(entity, node.children[child_node_index]);
    });
  }

  function split_node(node){
    const half_width = node.width/2;
    const half_height = node.height/2;

    node.children[TOP_LEFT] = Node.create(node.x, node.y, half_width, half_height);
    node.children[TOP_RIGHT] = Node.create(node.x + half_width, node.y, half_width, half_height);
    node.children[BOTTOM_LEFT] = Node.create(node.x, node.y + half_height, half_width, half_height);
    node.children[BOTTOM_RIGHT] = Node.create(node.x + half_width, node.y + half_height, half_width, half_height);

    node.items.forEach(function(entity){ add_entity_to_node(entity, node) });
    node.items = [];
  }

  function add_entity_to_node(entity, node){
    if(node.children.length > 0){
      return add_entity_to_overlapping_children(entity, node);
    }

    if((node.items.length >= MAX_ENTITIES_PER_NODE) && ((node.width/2) * (node.height) > MIN_AREA_PER_NODE)){
      split_node(node);
      return add_entity_to_node(entity, node);
    }

    node.items.push(entity);
  }


  /*
   * Accessors
   */
  function run_collision_checks(node){
    if(node.children.length > 0){
      node.children.forEach(run_collision_checks);
    } else {
      for(var i = 0; i < node.items.length; i++){
        for(var j = i+1; j < node.items.length; j++){
          node.items[i].check_collision_against(node.items[j]);
        }
      }
    }
  }

  /*
   * Rendering
   */
  function draw_debug_text(node, ctx, dt){
    if(node.debug_level<4) return;
    ctx.strokeText("C: " + node.children.length, node.width/2, node.height/2);
    ctx.strokeText("I: " + node.items.length, node.width/2, node.height/2+10);
  }
  function draw_quad_node(engine, node, ctx, dt){
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.strokeRect(0, 0, node.width, node.height);

    if(node.debug_level<2) return;
    ctx.fillStyle = "rgba(100, 100, 200, 0.08)";
    ctx.fillRect(0, 0, node.width, node.height);
  }
  function draw_debug_links(node, ctx, dt){
    if(node.debug_level<3) return;
    ctx.beginPath();
    node.items.forEach(function(item){
      ctx.moveTo(node.width/2, node.height/2);
      ctx.lineTo(item.x - node.x,item.y - node.y);
    });
    ctx.stroke();
  }
  function render(layer, node, ctx, dt){
    if(node.debug_level < 1 ) return;

    const world_limits = layer.world.engine.viewport.visible_world_limits();
    if(node.x + node.width < world_limits[0][0] ||
       node.y + node.height < world_limits[0][1] ||
       node.x > world_limits[1][0] ||
       node.y > world_limits[1][1])
      return;

    ctx.save();
    ctx.translate(node.x, node.y);

    // level 1 & 2
    draw_quad_node(layer.world.engine, node, ctx, dt);
    // level 3
    draw_debug_links(node, ctx, dt);
    // level 4
    draw_debug_text(node, ctx, dt);

    ctx.restore();
    node.children.forEach(function(child){ render(layer.world.engine, child, ctx, dt) });
  }


  return {
    create: function(x, y, width, height){
      const node = {
        x,
        y,
        width,
        height,
        items: [],
        children: [],
      }
      node.debug_level = 0;

      node.run_collision_checks = function(){ run_collision_checks(node) }
      node.add = function(entity){ add_entity_to_node(entity, node) }
      node.update = function(dt){ update(node, dt) }
      node.render = function(layer, ctx, dt){ render(layer, node, ctx, dt) }

      return node;
    }
  }
})();

class QuadTree {
  constructor(layer){
    this.layer = layer;
  }
  reset(){
    this.root = Node.create(-this.layer.world.width, -this.layer.world.height, this.layer.world.width*2, this.layer.world.height*2);
  }
  add(entity){
    this.root.add(entity);
  }
  run_collision_checks(){
    this.root.run_collision_checks();
  }
  render(ctx){
    if(this.root) this.root.render(this.layer, ctx);
  }
}
