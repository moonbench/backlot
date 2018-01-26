"use strict";

const Game = (() => {
  function set_scene(game, scene){
    game.scene = scene;
    game.engine.set_world(scene.world);
    game.add_player_entity = game.engine.world.add_player_entity;
    game.add_entity = game.engine.world.add_entity;
    if(scene.setup) scene.setup();
    if(scene.update) game.engine.update_function = scene.update;
  }

  function set_fps_meter(game, meter_id){
    game.engine.fps_meter = Meter.create(game.engine, meter_id);
  }

  return {
    create: canvas_id => {
      const game = {
        engine: Engine.create(document.getElementById(canvas_id)),
        asset_depot: AssetDepot.create(),
      };

      game.set_scene = scene => set_scene(game, scene);
      game.add_fps_meter = meter_id => set_fps_meter(game, meter_id);
      game.add_image = game.asset_depot.add_image;
      game.add_audio = game.asset_depot.add_audio;
      game.images = game.asset_depot.images;
      game.audio = game.asset_depot.audio;

      game.run = game.engine.run;

      return game;
    }
  }
})();
