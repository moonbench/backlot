"use strict";

class Game {
  constructor(canvas_id){
    this.engine = new Engine(document.getElementById(canvas_id));
    this.asset_depot = new AssetDepot();
    this.add_image = this.asset_depot.add_image;
    this.add_audio = this.asset_depot.add_audio;
    this.images = this.asset_depot.images;
    this.audio = this.asset_depot.audio;
  }

  set_scene(scene){
    this.scene = scene;

    this.engine.set_world(scene.world);
    scene.add_player_entity = this.engine.world.add_player_entity;
    scene.add_entity = this.engine.world.add_entity;

    if(scene.setup) scene.setup(scene, game);
    if(scene.update) this.engine.update_function = (dt) => scene.update(scene, dt, this);
    if(scene.handle_mouse_button) this.engine.handle_mouse_button = (event, pressed) => scene.handle_mouse_button(scene, event, pressed);
  }

  set_fps_meter(meter_id){
    this.engine.fps_meter = new Meter(this.engine, meter_id);
  }

  run(){
    this.engine.run();
  }
}
