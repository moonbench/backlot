"use strict";

class Util {
  static cartesian_to_iso(x, y){
    return [
      (y-x)/2,
      (x+y)/2
    ];
  }

  static iso_to_cartesian(x, y){
    return [
      (2 * y - x),
      (2 * y + x)
    ];
  }

  static normalize_angle(angle){
    angle = angle % (Math.PI * 2);
    return angle >= 0 ? angle : angle += Math.PI*2;
  }

  static current_time_in_ms(){
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  }
}
