import NPC from "./NPC";

export default class NPC_Boy_ShopOwner extends NPC {
  constructor(x, y ,map) {
    super(x, y, map);

    this.src.pos.x = 448;
    this.src.pos.y = 16;

    this.dialogues    = new Array(1);
    this.dialogues[0] = new Array(2);

    this.dialogues[0][0] = "I apologize for the mess,>but the shop isn't ready yet";
    this.dialogues[0][1] = "It will be ready some time>during beta!";
  }
};