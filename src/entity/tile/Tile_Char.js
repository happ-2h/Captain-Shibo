import Renderer from "../../gfx/Renderer";
import Tile from "./Tile";

export default class Tile_Char extends Tile {
  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {String} char
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
      this.src.x = 8 * (ch - 'a'.charCodeAt(0));
      this.src.y = 240;
    }
    // Number
    else if (ch >= 48 && ch <= 57) {
      this.src.x = 8 * (ch - '0'.charCodeAt(0));
      this.src.y = 248;
    }
    // Special character
    else {
      this.src.y = 248;

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