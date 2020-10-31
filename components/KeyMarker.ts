import Context from "./Context";
import { Component } from "./interfaces";

export enum KeyKind {
  White,
  Black,
}

export default class KeyMarker implements Component {
  context: any;

  constructor(
    context: Context,
    public kind: KeyKind,
    public color: string,
    public radius: number,
    public x: number,
    public y: number
  ) {
    this.context = context;
  }

  setup() {}

  update() {}

  draw() {
    const { overlayCanvasCtx: ctx } = this.context;
    const { x, y, radius, color } = this;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
