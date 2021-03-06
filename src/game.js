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
    scene.game = this;

    this.engine.set_world(scene.world);
    scene.add = this.engine.world.add.bind(this.engine.world);

    if(scene.setup){
      scene.setup.bind(scene)();
    }
    if(scene.update){
      this.engine.update_function = scene.update.bind(scene);
    }
    if(scene.render){
      this.engine.render_function = scene.render.bind(scene);
    }
    if(scene.handle_mouse_button){
      this.engine.handle_mouse_button = scene.handle_mouse_button.bind(scene);
    }
    if(scene.handle_key){
      this.engine.handle_key = scene.handle_key.bind(scene);
    }
  }

  set_fps_meter(meter_id){
    this.engine.fps_meter = new Meter(this.engine, meter_id);
  }

  run(){
    this.engine.run();
  }
}
