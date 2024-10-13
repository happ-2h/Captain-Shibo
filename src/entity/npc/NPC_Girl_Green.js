import NPC from "./NPC";

export default class NPC_Girl_Green extends NPC {
  constructor(x, y ,map) {
    super(x, y, map);

    this.src.pos.x = 448;
    this.src.pos.y = 0;

    this.dialogues    = new Array(2);
    this.dialogues[0] = new Array(2);
    this.dialogues[1] = new Array(2);

    this.dialogues[0][0] = "I came to this town>for the new arcade!";
    this.dialogues[0][1] = "You can win actual money!!";
    this.dialogues[1][0] = "Sadly, the arcade is>under construction";
    this.dialogues[1][1] = "might be available after beta";
  }
};