"use strict";

class Entity {
  constructor(x = 0, y = 0, width = 0, height = 0, angle = 0){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.dead = false;
    this.debug_level = 0;
    this.anchor = null;
  }

  reset(){}

  update(){
    this.reset();
    this.normalize_if_dirty();
    this.follow_anchor();
    if(this.physics_body){
      this.align_with_physics_body();
    }
  }

  anchor_to(entity){
    this.anchor = entity;
    this.follow_anchor();
  }

  follow_anchor(){
    if(!this.anchor) return;
    this.x = this.anchor.x;
    this.y = this.anchor.y;
    this.angle = this.anchor.angle;
    this.width = this.anchor.width;
    this.height = this.anchor.height;
  }

  normalize_if_dirty(){
    if(!this.old_values || 
        (this.height != this.old_values.height ||
         this.width != this.old_values.width ||
         this.angle != this.old_values.angle)
      ) this.normalize();
  }

  normalize(){
    this.angle = Util.normalize_angle(this.angle);
    this.max_radius = Math.sqrt( Math.pow(this.width/2,2) + Math.pow(this.height/2,2));
    this.calculate_corners();
    this.calculate_limits();
    this.set_edges();
    this.old_values = {height: this.height, width: this.width, angle: this.angle};
  }

  calculate_corners(){
    this.corners = {};
    this.corners.top = [Math.sin(this.angle)*this.height/2, -Math.cos(this.angle)*this.height/2];
    this.corners.right = [Math.cos(this.angle)*this.width/2, Math.sin(this.angle)*this.width/2];
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

  render(ctx){
    if(this.debug_level > 0){
      ctx.rotate(0-this.angle);
      this.render_debug(ctx);
    }
    if(this.debug_level<1) return;
    this.render_box_outline(ctx);
  }

  render_box_outline(ctx){
    ctx.lineWidth = 1;
    ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
  }

  render_crosshair(ctx){
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(3, 0);
    ctx.moveTo(0, -3);
    ctx.lineTo(0, 3);
    ctx.stroke();
  }

  render_info_text(ctx){
    ctx.strokeText("[x:" + Math.round(this.x) + ", y:" + Math.round(this.y) + ", t:" + this.angle.toFixed(2) + "]", 3 + (this.width/2), -3 - (this.height/2) );
    ctx.strokeText("width:" + Math.round(this.width) + ", height:" + Math.round(this.height), 3 + (this.width/2), 10 - (this.height/2) );
  }

  render_corners(ctx){
    Object.keys(this.corners).forEach((corner) => {
      ctx.strokeRect(this.corners[corner][0]-3, this.corners[corner][1]-3, 6, 6);
    });
  }

  render_edges(ctx){
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    this.edges.forEach(function(edge){
      ctx.moveTo(edge[0][0], edge[0][1]);
      ctx.lineTo(edge[1][0], edge[1][1]);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  render_alignment_vector(ctx){
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.corners.right[0], this.corners.right[1]);
    ctx.stroke();
  }

  render_debug(ctx){
    ctx.strokeStyle = "#86f962";
    ctx.lineWidth = 1;
    this.render_crosshair(ctx);
    this.render_alignment_vector(ctx);

    if(this.debug_level < 2) return;
    this.render_edges(ctx);

    if(this.debug_level < 3) return;
    this.render_corners(ctx);

    if(this.debug_level < 4) return;
    this.render_info_text(ctx);
  }

  add_physics_body(options = undefined, x = this.x, y = this.y, width = this.width, height=this.height, angle = this.angle){
    this.physics_body = Matter.Bodies.rectangle(x, y, width, height, options);
    this.physics_body.entity = this;
    if(angle != 0) Matter.Body.rotate(this.physics_body, angle);
  }

  align_with_physics_body(){
    this.x = this.physics_body.position.x;
    this.y = this.physics_body.position.y;
    this.angle = this.physics_body.angle;
  }

  set_velocity(vector){
    Matter.Body.setVelocity(
      this.physics_body,
      {x: vector.x_after(0, 1), y: vector.y_after(0, 1)}
    );
  }

  apply_force(vector){
    Matter.Body.applyForce(
      this.physics_body,
      this.physics_body.position,
      {x: vector.x_after(0, 1), y: vector.y_after(0, 1)}
    );
  }
}
