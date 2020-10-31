import Context from "./Context";
import { Component } from "./interfaces";
import tinycolor from "tinycolor2";
import { Player } from "soundfont-player";

export enum KeyKind {
  White,
  Black,
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
    if (!a || !b) {
      return false;
    }

    const aHsl = a.toHsl();
    const bHsl = b.toHsl();

    return (
      this.diff(aHsl.h, bHsl.h) <= 8 &&
      this.diff(aHsl.s, bHsl.s) <= 8 &&
      this.diff(aHsl.l, bHsl.l) <= 15
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
      console.log("Playing:", this.pitch);
      if (this.cancellablePlay) {
        this.cancellablePlay.stop();
      }
      this.cancellablePlay = piano.play(`${this.pitch}`);
    }
  }

  getDetectedKeyKind(): DetectedKeyKind {
    const LEFT_HAND_COLOR_1 = tinycolor({ h: 211, s: 51, l: 62 });
    const RIGHT_HAND_COLOR_1 = tinycolor({ h: 87, s: 63, l: 49 });
    const RIGHT_HAND_COLOR_2 = tinycolor({ h: 85, s: 56, l: 39 });

    if (this.isSimilarHsl(this.keyColor, LEFT_HAND_COLOR_1)) {
      return DetectedKeyKind.LeftHand;
    } else if (
      this.isSimilarHsl(this.keyColor, RIGHT_HAND_COLOR_1) ||
      this.isSimilarHsl(this.keyColor, RIGHT_HAND_COLOR_2)
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
  }
}
