"use strict";

class Vector {
  constructor(angle, magnitude){
    this.angle = angle;
    this.magnitude = magnitude;
  }

  x_after(x, dt){
    return x + (this.magnitude * dt * Math.cos(this.angle));
  }

  y_after(y, dt){
    return y + (this.magnitude * dt * Math.sin(this.angle));
  }

  add(angle, magnitude){
    return this.add_vector(new Vector(angle, magnitude));
  }

  add_vector(vector){    
    const x1 = this.x_after(0, 1), y1 = this.y_after(0, 1);
    const x2 = vector.x_after(x1, 1), y2 = vector.y_after(y1, 1);
    this.magnitude = Math.sqrt( Math.pow(y2, 2) + Math.pow(x2, 2));
    this.angle = Math.atan2( y2, x2 );
    return this;
  }
}
