import { Midi, Track } from "@tonejs/midi";

export default class MidiWriter {
  heldNotes: object;
  midi: Midi;
  track: Track;

  constructor() {
    this.midi = new Midi();
    this.track = this.midi.addTrack();
    this.heldNotes = [];
  }

  beginNote(pitch, time) {
    this.heldNotes[pitch] = {
      start: new Date().getTime(),
    };
  }

  endNote(pitch, time) {
    const end = new Date().getTime();
    const heldNote = this.heldNotes[pitch];

    if (!heldNote) {
      return;
    }

    const rawDuration = end - heldNote.start;

    this.heldNotes[pitch] = {
      ...heldNote,
      end,
      rawDuration,
    };

    const duration = +(rawDuration / 1000).toFixed(2);

    const note = {
      midi: pitch + 12,
      velocity: 60,
      time: Math.max(0, time - duration),
      duration,
    };
    this.track.addNote(note);

    console.log("Wrote MIDI note:", note);
  }

  save() {
    const blob = new Blob([this.midi.toArray()], { type: "audio/midi" });

    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.setAttribute("download", "song.mid");
    a.click();
  }
}
