"use strict";

const ASSET_DIR = "assets";
class AssetDepot {

  constructor(){
    this.images = {};
    this.audio = {};
  }

  add_image(src){
    this.images[src] = document.createElement("img");
    this.images[src].src = ASSET_DIR + "/" + src;
    return this.images[src];
  }

  add_audio(src){
    this.audio[src] = document.createElement("audio");
    this.audio[src].src = ASSET_DIR + "/" + src;
    this.audio[src].volume = 0.25;
    return this.audio[src];
  }
}
