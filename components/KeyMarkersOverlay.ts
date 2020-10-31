import Context from "./Context";
import { Component } from "./interfaces";
import KeyMarker, { KeyKind } from "./KeyMarker";

const NUM_WHITE_KEYS = 52;

export default class KeyMarkersOverlay implements Component {
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
    for (let i = 0; i < NUM_WHITE_KEYS; i++) {
      const isPitchC = (i - 2) % 7 === 0;

      const x = this.offsetX + i * this.deltaX;

      this.keys.push(
        new KeyMarker(
          this.context,
          KeyKind.White,
          isPitchC ? "darkorange" : "orange",
          isPitchC ? this.radius * 1.25 : this.radius,
          x,
          this.y,
          i + 21
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
