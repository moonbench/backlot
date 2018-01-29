"use strict";

class Physics extends Entity {
  constructor(x, y, width, height, angle){
    super(x, y, width, height, angle);
    this.shape = "rectangle";
  }

  location_key(){
    return this.x.toFixed(3) + "." + this.y.toFixed(3) +
      "." + this.angle.toFixed(3) +
      "." + this.width + "." + this.height;
  }

  check_collision(other_entity, no_checkback=false){
    const key = other_entity.location_key();
    this.checks[key] = {other_entity, collision: false};

    if(!this.within_radius(other_entity)) return false;
    this.something_within_radius = true;

    if(this.shape == "rectangle"){
      if(!this.within_aabb(other_entity)) return false;
      this.something_within_aabb = true;
    }

    this.checks[key].collision = true;
    this.collisions.push(this.checks[key]);
    if(!no_checkback) other_entity.check_collision(this, true);
    return true;
  }

  within_radius(entity2){
    const distance = this.shape == "rectangle" ? this.max_radius + entity2.max_radius : this.width/2 + entity2.width/2;
    return Math.sqrt(Math.pow(entity2.y - this.y, 2) + Math.pow(entity2.x - this.x, 2)) <= distance;
  }

  within_aabb(entity2){
    return this.x + this.max.x > entity2.x + entity2.min.x &&
           this.y + this.max.y > entity2.y + entity2.min.y &&
           this.x + this.min.x < entity2.x + entity2.max.x &&
           this.y + this.min.y < entity2.y + entity2.max.y;
  }

  render_rect(ctx){
    ctx.fillRect(-this.max.x, -this.max.y, this.max.x*2, this.max.y*2);
    ctx.strokeRect(-this.max.x, -this.max.y, this.max.x*2, this.max.y*2);
  }

  render_circle(ctx){
    const radius = this.shape == "rectangle" ? this.max_radius : this.width/2;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  render(ctx){
    if(this.debug_level < 1) return;
    ctx.fillStyle = "rgba(99, 0, 0, 0.2)";
    ctx.strokeStyle = "#AA0000";
    ctx.lineWidth = 1;
    if(this.shape == "rectangle")
      this.render_rect(ctx);
    if(this.shape == "circle")
      this.render_circle(ctx);
  }

  reset(){
    super.reset();
    this.something_within_radius = false;
    this.something_within_aabb = false;
    this.checks = {};
    this.collisions = [];
  }
}
