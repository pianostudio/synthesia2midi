import Context from "./Context";
import { Component } from "./interfaces";
import KeyMarker, { KeyKind } from "./KeyMarker";

const NUM_BLACK_KEYS = 36;

export default class BlackKeysOverlay implements Component {
  context: any;
  keys: KeyMarker[];

  constructor(
    context: Context,
    public radius: number,
    public offsetX: number,
    public deltaX: number,
    public y: number
  ) {
    this.context = context;
    this.keys = [];
  }

  setup() {
    for (let i = 0; i < NUM_BLACK_KEYS; i++) {
      let extraOffset = 0;

      if (i > 0) {
        extraOffset -= 30;
      }

      const seqIdx = ((i - 1) % 5) + 1;
      const multiplier = Math.floor((i - 1) / 5) + 1;

      extraOffset += 30 * multiplier;

      if (seqIdx >= 3) {
        extraOffset += 15;
      }
      if (seqIdx >= 1) {
        extraOffset += 15;
      }

      const x = extraOffset + this.offsetX + i * this.deltaX;

      this.keys.push(
        new KeyMarker(
          this.context,
          KeyKind.White,
          "orange",
          this.radius,
          x,
          this.y
        )
      );
    }
  }

  update() {
    for (const key of this.keys) {
      key.update();
    }
  }

  draw() {
    for (const key of this.keys) {
      key.draw();
    }
  }
}
