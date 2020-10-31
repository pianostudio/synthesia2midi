import Context from "./Context";
import { Component } from "./interfaces";
import tinycolor from "tinycolor2";
import { Player } from "soundfont-player";

const DEBUG_PITCH = true;

export enum KeyKind {
  White = "White",
  Black = "Black",
}

export enum DetectedKeyKind {
  LeftHand = "Left Hand",
  RightHand = "Right Hand",
  None = "None",
}

export default class KeyMarker implements Component {
  context: Context;
  keyColor: tinycolor.Instance;
  prevKeyColor: tinycolor.Instance;
  detectedKeyKind: DetectedKeyKind;
  prevDetectedKeyKind: DetectedKeyKind;
  cancellablePlay: Player;

  constructor(
    context: Context,
    public kind: KeyKind,
    public color: string,
    public radius: number,
    public x: number,
    public y: number,
    public pitch: number
  ) {
    this.context = context;
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

    this.detectedKeyKind = this.getDetectedKeyKind();

    if (this.prevDetectedKeyKind !== this.detectedKeyKind) {
      this.prevDetectedKeyKind = this.detectedKeyKind;
      this.playDetectedKey();
    }
  }

  playDetectedKey() {
    const { piano } = this.context;

    if (!piano) {
      return;
    }

    if (this.detectedKeyKind === DetectedKeyKind.None) {
      if (this.cancellablePlay) {
        this.cancellablePlay.stop();
      }
    } else {
      this.cancellablePlay = piano.play(`${this.pitch}`);
    }
  }

  getDetectedKeyKind(): DetectedKeyKind {
    const LEFT_HAND_COLOR_1 = tinycolor({ h: 211, s: 51, l: 62 });
    const LEFT_HAND_COLOR_2 = tinycolor({ h: 213, s: 50, l: 42 });
    const RIGHT_HAND_COLOR_1 = tinycolor({ h: 87, s: 63, l: 49 });
    const RIGHT_HAND_COLOR_2 = tinycolor({ h: 85, s: 56, l: 39 });
    const RIGHT_HAND_COLOR_3 = tinycolor({ h: 88, s: 74, l: 32 });

    if (this.kind === KeyKind.Black && this.pitch === 56) {
      // console.log(
      //   `[${this.pitch}] Key Color <-> Left Hand Colors:`,
      //   this.keyColor.toHslString(),
      //   LEFT_HAND_COLOR_1.toHslString(),
      //   LEFT_HAND_COLOR_2.toHslString()
      // );
      // ----------
      // console.log(
      //   `[${this.pitch}] Key Color <-> Right Hand Colors:`,
      //   this.keyColor.toHslString(),
      //   RIGHT_HAND_COLOR_1.toHslString(),
      //   RIGHT_HAND_COLOR_2.toHslString()
      // );
    }

    if (
      this.isSimilarHsl(this.keyColor, LEFT_HAND_COLOR_1) ||
      this.isSimilarHsl(this.keyColor, LEFT_HAND_COLOR_2)
    ) {
      return DetectedKeyKind.LeftHand;
    } else if (
      this.isSimilarHsl(this.keyColor, RIGHT_HAND_COLOR_1) ||
      this.isSimilarHsl(this.keyColor, RIGHT_HAND_COLOR_2) ||
      this.isSimilarHsl(this.keyColor, RIGHT_HAND_COLOR_3)
    ) {
      return DetectedKeyKind.RightHand;
    } else {
      return DetectedKeyKind.None;
    }
  }

  draw() {
    const { overlayCanvasCtx: ctx } = this.context;
    const { x, y, radius, color, keyColor } = this;

    switch (this.detectedKeyKind) {
      case DetectedKeyKind.LeftHand:
      case DetectedKeyKind.RightHand:
        ctx.fillStyle = (keyColor.isLight()
          ? keyColor.darken(25)
          : keyColor.lighten(25)
        ).toHslString();
        ctx.beginPath();
        ctx.arc(x, y, radius * 2.5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.font = "bold 10px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        break;
    }

    switch (this.detectedKeyKind) {
      case DetectedKeyKind.None:
        ctx.fillStyle = (keyColor.isLight()
          ? keyColor.darken(25)
          : keyColor.lighten(25)
        ).toHslString();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        break;

      case DetectedKeyKind.LeftHand:
        ctx.fillText("L", x, y);
        break;

      case DetectedKeyKind.RightHand:
        ctx.fillText("R", x, y);
        break;
    }

    if (DEBUG_PITCH) {
      ctx.font = "bold 10px sans-serif";
      ctx.fillStyle = (keyColor.isLight()
        ? keyColor.darken(25)
        : keyColor.lighten(45)
      ).toHslString();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        this.pitch.toString(),
        x,
        y + (this.kind === KeyKind.Black ? 45 : 15)
      );
    }
  }
}
