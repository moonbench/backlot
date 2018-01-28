"use strict";

class Solid extends Sprite {
  constructor(x, y, width, height, angle, mass){
    super(null, x, y, width, height, angle);
    this.mass = mass;
  }
}
