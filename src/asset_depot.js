"use strict";

const AssetDepot = (() => {

  const ASSET_DIR = "assets";

  function add_image(depot, src){
    depot.images[src] = document.createElement("img");
    depot.images[src].src = ASSET_DIR + "/" + src;
    return depot.images[src];
  }

  function add_audio(depot, src){
    depot.audio[src] = document.createElement("audio");
    depot.audio[src].src = ASSET_DIR + "/" + src;
    depot.audio[src].volume = 0.25;
    return depot.audio[src];
  }

  return {
    create: () => {
      var depot = {
        images: {},
        audio: {},
      };

      depot.add_image = src => add_image(depot, src);
      depot.add_audio = src => add_audio(depot, src);

      return depot;
    }
  }
})();
