import Context from "./Context";
import { Component } from "./interfaces";
import SparkMarker from "./SparkMarker";

const NUM_BLACK_KEYS = 36;

function getBaseForOctave(octave) {
  return octave * 12;
}

let MIDI_NUM_MAP = [22 /* A#0 */];

for (let octave = 0; octave < 7; octave++) {
  MIDI_NUM_MAP = [
    ...MIDI_NUM_MAP,
    25 + getBaseForOctave(octave) /* C# */,
    27 + getBaseForOctave(octave) /* D# */,
    30 + getBaseForOctave(octave) /* F# */,
    32 + getBaseForOctave(octave) /* G# */,
    34 + getBaseForOctave(octave) /* A# */,
  ];
}

export default class BlackKeySparksOverlay implements Component {
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
