"use strict";

class Entity {
  constructor(x = 0, y = 0, width = 0, height = 0, angle = 0, mass = 1){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.mass = mass;
    this.dead = false;

    this.normalize();
  }

  reset(){}

  update(){
    this.reset();
  }

  normalize(){
    this.mass = this.mass < 0.00001 ? 0.00001 : this.mass;
    this.angle = Util.normalize_angle(this.angle);
    this.max_radius = Math.sqrt( Math.pow(this.width/2,2) + Math.pow(this.height/2,2));
    this.calculate_corners();
    this.calculate_limits();
    this.set_edges();
  }

  calculate_corners(){
    this.corners = {};
    this.corners.top = [Math.sin(this.angle)*this.width/2, -Math.cos(this.angle)*this.width/2];
    this.corners.right = [Math.cos(this.angle)*this.height/2, Math.sin(this.angle)*this.height/2];
    this.corners.bottom = [-this.corners.top[0], -this.corners.top[1]];
    this.corners.left = [-this.corners.right[0], -this.corners.right[1]];
    this.corners.top_right = [this.corners.top[0]+this.corners.right[0], this.corners.top[1]+this.corners.right[1]];
    this.corners.bottom_right = [this.corners.bottom[0]+this.corners.right[0], this.corners.bottom[1]+this.corners.right[1]];
    this.corners.top_left = [-this.corners.bottom_right[0], -this.corners.bottom_right[1]];
    this.corners.bottom_left = [-this.corners.top_right[0], -this.corners.top_right[1]];
  }

  calculate_limits(){    
    this.max = {};
    this.max.x = Math.max(Math.abs(this.corners.top_right[0]), Math.abs(this.corners.top_left[0]));
    this.max.y = Math.max(Math.abs(this.corners.top_right[1]), Math.abs(this.corners.bottom_right[1]));
    this.min = {};
    this.min.x = -this.max.x;
    this.min.y = -this.max.y;
  }

  set_edges(){
    this.edges = [];
    this.edges.push([this.corners.top_left, this.corners.top_right]);
    this.edges.push([this.corners.top_right, this.corners.bottom_right]);
    this.edges.push([this.corners.bottom_right, this.corners.bottom_left]);
    this.edges.push([this.corners.bottom_left, this.corners.top_left]);
    return this;
  }

  pre_render(viewport, ctx, dt){
    ctx.save();
    const canvas_coords = viewport.world_to_viewport(this.x, this.y, this.layer.depth);
    ctx.translate(canvas_coords[0], canvas_coords[1]);
    ctx.rotate(this.angle);
  }

  post_render(ctx, dt){
    if(this.debug_level > 0){
      ctx.rotate(0-this.angle);
      this.render_debug(ctx, dt);
    }
    ctx.restore();
  }

  render(ctx, dt){
    if(this.debug_level<1) return;
    this.render_box_outline(ctx, dt);
  }

  render_box_outline(ctx, dt){
    ctx.lineWidth = 1;
    ctx.strokeRect(-this.height/2, -this.width/2, this.height, this.width);
  }

  render_crosshair(ctx, dt){
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(3, 0);
    ctx.moveTo(0, -3);
    ctx.lineTo(0, 3);
    ctx.stroke();
  }

  render_info_text(ctx, dt){
    ctx.strokeText("[x:" + Math.round(this.x) + ", y:" + Math.round(this.y) + ", t:" + this.angle.toFixed(2) + "]", 3 + (this.width/2), -3 - (this.height/2) );
    ctx.strokeText("width:" + Math.round(this.width) + ", height:" + Math.round(this.height), 3 + (this.width/2), 10 - (this.height/2) );
  }

  render_corners(ctx, dt){
    Object.keys(this.corners).forEach(function(corner){
      ctx.strokeRect(this.corners[corner][0]-3, this.corners[corner][1]-3, 6, 6);
    });
  }

  render_edges(ctx, dt){
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    this.edges.forEach(function(edge){
      ctx.moveTo(edge[0][0], edge[0][1]);
      ctx.lineTo(edge[1][0], edge[1][1]);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  render_alignment_vector(ctx, dt){
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.corners.right[0], this.corners.right[1]);
    ctx.stroke();
  }

  render_debug(ctx, dt){
    ctx.strokeStyle = "#308311";
    ctx.lineWidth = 1;
    this.render_crosshair(ctx, dt);
    this.render_alignment_vector(ctx, dt);

    if(entity.debug_level < 2) return;
    this.render_edges(ctx, dt);

    if(entity.debug_level < 3) return;
    this.render_corners(ctx, dt);

    if(entity.debug_level < 4) return;
    this.render_info_text(ctx, dt);
  }

  create_location_key(){
    return this.x.toFixed(3) + "." + this.y.toFixed(3) +
      "." + this.angle.toFixed(3) +
      "." + this.width + "." + this.height;
  }
}
