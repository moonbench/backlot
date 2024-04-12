# Backlot JavaScript Game Engine
Small custom HTML5 + JavaScript game engine for building small browser-based games.

All classes built using "strict" JavaScript.

## Features

1. Multiple viewports
2. Entitiy system
3. Sprites & animations
4. Solid physics bodies
5. Designed to work with [Matter.Js](https://brm.io/matter-js/) as the physics engine
6. FPS meter

## Example Code

This is the code used for the [Parallax Demo](https://moonbench.xyz/workshop/backlot/parallax/first/demo.html):

```javascript
  const game = new Game("game_canvas");
  game.set_fps_meter("fps_meter");

  // Create a solid immobile wall entity type
  class Wall extends Entity {
    constructor(x, y, width, height, angle) {
      super(x, y, width, height, angle);
      this.add_physics_body({isStatic: true});
    }
  }

  // Create a player entitity that moves based on up/down/left/right inputs
  class Player extends Entity {
    constructor(x, y) {
      super(x, y, 32, 32);
      this.add_physics_body();
    }

    update(dt) {
      super.update(dt);
      let x_offset = 0;
      let y_offset = 0;

      if(this.up) y_offset -= dt*500;
      if(this.down) y_offset += dt*500;
      if(this.left) x_offset -= dt*500;
      if(this.right) x_offset += dt*500;

      Matter.Body.setPosition(this.physics_body, {x: this.x+x_offset, y: this.y+y_offset});
    }
  }

  // Setup the game world
  game.set_scene({
    world: new World(1920*3, 1080*3),
    setup: function() {
      // Add the player to the scene
      this.player = new Player(0, 0);
      this.add(this.player);

      // Add some walls to the scene
      for(var i = 0; i < 10; i++) {
        for(var j = 0; j < 10; j++) {
          for(var l = 0; l < 3; l++) {
            this.add(new Wall(-1024+(j*256), 0, 64, 512), 90+10*l);
          }
          this.add(new Wall(-1024+(j*256), 0, 64, 512), 25);
          this.add(new Wall(-1024+(j*256), 0, 64, 512), 200);
        }
      }
      this.add(new Wall(512, 0, 512+64, 512), 110);
      this.add(new Wall(512, 0, 512+64, 512), 90);
      this.add(new Wall(-512, 0, 512+64, 512), 110);
      this.add(new Wall(-512, 0, 512+64, 512), 90);

      // Instruct the viewport to follow the player (act as a camera)
      this.game.engine.viewport.track(this.player);
    },

    // Handle inputs
    handle_key(event, pressed){
      if(event.key == "w") this.player.up = pressed;
      if(event.key == "s") this.player.down = pressed;
      if(event.key == "a") this.player.left = pressed;
      if(event.key == "d") this.player.right = pressed;
    },
  });

  // Start the game loop
  game.run();
```

## Demo Games Using This Engine

1. [Parallax Demo](https://moonbench.xyz/workshop/backlot/parallax/first/demo.html)
2. [Top-Down RTS Prototype](https://moonbench.xyz/projects/rts-game-engine)
3. [Top-Down Shooter](https://moonbench.xyz/projects/axiom-javascript-shoot-em-up-game)
4. [Isometric RPG Protothype](https://moonbench.xyz/projects/isometric-javascript-game)
5. [Color Matching Flood-It](https://moonbench.xyz/workshop/backlot/floodit/demo.html)
6. [Plate Clicker](https://moonbench.xyz/workshop/backlot/plates/index.html)
7. [Fantasy World Map Maker](https://moonbench.xyz/workshop/backlot/empire/index.html)
