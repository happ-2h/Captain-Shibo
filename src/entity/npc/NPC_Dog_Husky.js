import NPC from "./NPC";

export default class NPC_Dog_Husky extends NPC {
  constructor(x, y ,map) {
    super(x, y, map);

    this.src.pos.x = 448;
    this.src.pos.y = 48;

    this.dialogues    = new Array(2);
    this.dialogues[0] = new Array(3);
    this.dialogues[1] = new Array(2);

    this.dialogues[0][0] = "the space wars are trickling>into our planet";
    this.dialogues[0][1] = "I am always ready to fight!";
    this.dialogues[0][2] = "Behind the new arcade is a >\"takeoff pad.\" stand on it and>press the action button";

    this.dialogues[1][0] = "no offense but...";
    this.dialogues[1][1] = "you have a familiar smell";
  }
};