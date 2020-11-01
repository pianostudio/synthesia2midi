import Context from "./Context";
import { Component } from "./interfaces";
import tinycolor from "tinycolor2";
import { Player } from "soundfont-player";

const DEBUG_PITCH = false;

const MAX_LUMINANCES_STORED = 2;

export default class SparkMarker implements Component {
  context: Context;
  keyColor: tinycolor.Instance;
  prevKeyColor: tinycolor.Instance;
  luminances: number[];
  cancellablePlay: Player;
  public gapDetected: boolean;
  prevLuminances: any;

  constructor(
    context: Context,
    public color: string,
    public radius: number,
    public x: number,
    public y: number,
    public pitch: number,
    public index: number
  ) {
    this.context = context;
    this.luminances = [];
    this.prevLuminances = [];
  }

  setup() {}

  diff(a, b) {
    return Math.abs(a - b);
  }

  isSimilarHsl(a: tinycolor.Instance, b: tinycolor.Instance) {
    const hueThresholdPercent = 5;
    const saturationThresholdPercent = 10;
    const luminanceThresholdPercent = 5;
    if (!a || !b) {
      return false;
    }

    const aHsl = a.toHsl();
    const bHsl = b.toHsl();

    return (
      this.diff(aHsl.h, bHsl.h) <= (255 * hueThresholdPercent) / 100.0 &&
      this.diff(aHsl.s, bHsl.s) <= (1 * saturationThresholdPercent) / 100.0 &&
      this.diff(aHsl.l, bHsl.l) <= (1 * luminanceThresholdPercent) / 100.0
    );
  }

  update() {
    const { video } = this.context;
    const { x, y } = this;

    this.keyColor = video.getPixelAt(x, y);

    const luminance = +this.keyColor.getLuminance().toPrecision(1);

    if (!this.luminances.includes(luminance)) {
      this.luminances.push(luminance);
    }

    if (this.luminances.length > MAX_LUMINANCES_STORED) {
      this.luminances.shift();
    }

    if (this.luminances[0] - this.luminances[1] >= 0.25) {
      this.gapDetected = true;
    } else {
      this.gapDetected = false;
    }

    if (
      this.luminances[0] !== this.prevLuminances[0] ||
      this.luminances[1] !== this.prevLuminances[1]
    ) {
      this.prevLuminances = [...this.luminances];

      // if (this.pitch === 55) {
      //   console.log("#55 Gapped?", this.gapDetected);
      // }
    }
  }

  draw() {
    const { overlayCanvasCtx: ctx } = this.context;
    const { x, y, radius, color, keyColor } = this;

    ctx.fillStyle = this.gapDetected
      ? tinycolor("cyan").toHslString()
      : (keyColor.isLight()
          ? keyColor.darken(25)
          : keyColor.lighten(25)
        ).toHslString();
    ctx.beginPath();
    ctx.arc(x, y, this.gapDetected ? radius * 1.25 : radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}
