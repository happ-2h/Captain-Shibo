import Renderer from "../../gfx/Renderer";
import Tile     from "./Tile";

export default class Tile_Char extends Tile {
  /**
   * @param {Number} x    - x-position of the char sprite
   * @param {Number} y    - y-position of the char sprite
   * @param {String} char - ASCII representation of the char sprite
   */
  constructor(x=0, y=0, char='') {
    super(x, y, 9999, false, null);

    this.dst.w = 8;
    this.dst.h = 8;
    this.src.w = 8;
    this.src.h = 8;

    const ch = char?.toLowerCase()?.charCodeAt(0);

    // Letter
    if (ch >= 97 && ch <= 122) {
      this.src.x = (ch - 'a'.charCodeAt(0))<<3;
      this.src.y = 496;
    }
    // Number
    else if (ch >= 48 && ch <= 57) {
      this.src.x = (ch - '0'.charCodeAt(0))<<3;
      this.src.y = 504;
    }
    // Special character
    else {
      this.src.y = 504;

      switch(char) {
        case '.':  this.src.x =  80; break;
        case ',':  this.src.x =  88; break;
        case ';':  this.src.x =  96; break;
        case ':':  this.src.x = 104; break;
        case '\'': this.src.x = 112; break;
        case '!':  this.src.x = 120; break;
        case '\"': this.src.x = 136; break;
        case '?':  this.src.x = 144; break;
        case '(':  this.src.x = 152; break;
        case ')':  this.src.x = 160; break;
        case '+':  this.src.x = 168; break;
        case '-':  this.src.x = 176; break;
        case '$':  this.src.x = 184; break;
      }
    }
  }

  draw() {
    Renderer.image(
      "spritesheet",
      this.src.x, this.src.y,
      this.src.w, this.src.h,
      this.dst.x, this.dst.y,
      this.dst.w, this.dst.h
    );
  }
};