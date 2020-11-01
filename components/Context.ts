import Input from "./Input";
import { Component } from "./interfaces";
import Soundfont from "soundfont-player";
import VideoManager from "./VideoManager";
import MidiWriter from "./MidiWriter";

export interface Config {}

export interface ComponentObject {
  [x: string]: Component;
}

export default class Context {
  public input: Input;
  public components: ComponentObject;
  public videoCanvasCtx: CanvasRenderingContext2D;
  public overlayCanvasCtx: CanvasRenderingContext2D;
  public video: VideoManager;
  public piano: Soundfont.Player;
  public midiWriter: MidiWriter;

  constructor(public config?: Config) {
    (window as any).context = this;
    this.input = new Input();
    this.components = {};
    this.video = new VideoManager(this);
    this.videoCanvasCtx = this.getVideoCanvasCtx();
    this.overlayCanvasCtx = this.getOverlayCanvasCtx();
    this.midiWriter = new MidiWriter();
    Soundfont.instrument(new AudioContext(), "acoustic_grand_piano").then(
      (piano) => {
        this.piano = piano;
        // const buffers = Object.values((piano as any).buffers);
        // piano.on("started", (when, nodeId, node) => {
        //   const pitch = buffers.indexOf(node.source.buffer);

        //   if (!pitch) {
        //     return;
        //   }

        //   this.midiWriter.beginNote(pitch, when);
        // });
        // piano.on("stop", (time, name) => {
        //   this.midiWriter.endNote(name, time);
        // });
        // piano.on("ended", (now, nodeId, node) => {
        //   const pitch = buffers.indexOf(node.source.buffer);

        //   if (!pitch) {
        //     return;
        //   }

        //   this.midiWriter.endNote(pitch, now);
        // });
      }
    );
  }

  getVideoCanvasCtx() {
    const videoCanvas = document.getElementById(
      "video-canvas"
    ) as HTMLCanvasElement;
    videoCanvas.style.width = `${this.video.width}px`;
    videoCanvas.width = this.video.width;
    videoCanvas.style.height = `${this.video.height}px`;
    videoCanvas.height = this.video.height;

    const videoCanvasCtx = videoCanvas.getContext("2d");
    return videoCanvasCtx;
  }

  getOverlayCanvasCtx() {
    const overlayCanvas = document.getElementById(
      "overlay-canvas"
    ) as HTMLCanvasElement;
    overlayCanvas.style.width = `${this.video.width}px`;
    overlayCanvas.width = this.video.width;
    overlayCanvas.style.height = `${this.video.height}px`;
    overlayCanvas.height = this.video.height;

    const overlayCanvasCtx = overlayCanvas.getContext("2d");
    return overlayCanvasCtx;
  }
}
