import NPC from "./NPC";

export default class NPC_Girl_Purple extends NPC {
  constructor(x, y ,map) {
    super(x, y, map);

    this.src.pos.x = 448;
    this.src.pos.y = 32;

    this.dialogues    = new Array(2);
    this.dialogues[0] = new Array(2);
    this.dialogues[1] = new Array(2);

    this.dialogues[0][0] = "The forest creatures drop coins;>quite peculiar";
    this.dialogues[0][1] = "There is also a randomly placed chest>odd...";

    this.dialogues[1][0] = "don't listen to that>green-haired guy";
    this.dialogues[1][1] = "he's...>odd...";
  }
};