import Tile from "./Tile";

export default class Tile_Door extends Tile {
  #to; // Building maps
  #locked;

  constructor(x=0, y=0, type=0, solid=true, map=null, to=null, locked=false) {
    super(x, y, type, solid, map);

    this.#to = [ ...to ];
    this.#locked = locked;
  }

  get to() { return [ ...this.#to ]; }
  get locked() { return this.#locked; }
};