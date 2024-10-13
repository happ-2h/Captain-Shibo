import NPC from "./NPC";

export default class NPC_Boy_Weird extends NPC {
  constructor(x, y ,map) {
    super(x, y, map);

    this.src.pos.x = 448;
    this.src.pos.y = 64;

    this.dialogues    = new Array(2);
    this.dialogues[0] = new Array(2);
    this.dialogues[1] = new Array(2);

    this.dialogues[0][0] = "you know what dogs are right??>the \"extinct\" creatures";
    this.dialogues[0][1] = "I can feel 2 here";

    this.dialogues[1][0] = "They caused the space war and fled";
    this.dialogues[1][1] = "leaving us to fend for ourselves";
  }
};