import Context from "./Context";
import { Component } from "./interfaces";
import SparkMarker from "./SparkMarker";

const NUM_WHITE_KEYS = 52;

function getBaseForOctave(octave) {
  return octave * 12;
}

let MIDI_NUM_MAP = [21 /* A0 */, 23 /* B0 */, 24 /* C0 */];

for (let octave = 0; octave < 7; octave++) {
  MIDI_NUM_MAP = [
    ...MIDI_NUM_MAP,
    26 + getBaseForOctave(octave) /* D */,
    28 + getBaseForOctave(octave) /* E */,
    29 + getBaseForOctave(octave) /* F */,
    31 + getBaseForOctave(octave) /* G */,
    33 + getBaseForOctave(octave) /* A */,
    35 + getBaseForOctave(octave) /* B */,
    36 + getBaseForOctave(octave) /* C */,
  ];
}

export default class WhiteKeySparksOverlay implements Component {
  context: any;
  sparks: SparkMarker[];

  constructor(
    context: Context,
    public radius: number,
    public offsetX: number,
    public deltaX: number,
    public y: number
  ) {
    this.context = context;
    this.sparks = [];
  }

  setup() {
    for (let i = 0; i < NUM_WHITE_KEYS; i++) {
      const isPitchC = (i - 2) % 7 === 0;

      const x = this.offsetX + i * this.deltaX;

      this.sparks.push(
        new SparkMarker(
          this.context,
          "orange",
          this.radius,
          x,
          this.y,
          MIDI_NUM_MAP[i],
          i
        )
      );
    }
  }

  update() {
    for (const key of this.sparks) {
      key.update();
    }
  }

  draw() {
    for (const key of this.sparks) {
      key.draw();
    }
  }
}
