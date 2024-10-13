import NPC from "./NPC";

export default class NPC_Girl_Purple extends NPC {
  constructor(x, y ,map) {
    super(x, y, map);

    this.src.pos.x = 448;
    this.src.pos.y = 32;

    this.dialogues    = new Array(1);
    this.dialogues[0] = new Array(2);

    this.dialogues[0][0] = "don't listen to that>green-haired guy";
    this.dialogues[0][1] = "he's...>odd...";
  }
};