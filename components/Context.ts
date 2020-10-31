import Input from "./Input";
import { Component } from "./interfaces";
import KeysOverlay from "./WhiteKeysOverlay";

export interface Config {}

export default class Context {
  public input: Input;
  public components: Component[];
  public videoCanvasCtx: CanvasRenderingContext2D;
  public overlayCanvasCtx: CanvasRenderingContext2D;
  public video: HTMLVideoElement;

  constructor(public config?: Config) {
    this.input = new Input();
    this.components = [];
    this.video = this.getVideoElement();
    this.videoCanvasCtx = this.getVideoCanvasCtx();
    this.overlayCanvasCtx = this.getOverlayCanvasCtx();
  }

  getVideoElement() {
    const video = document.getElementById("video-player") as HTMLVideoElement;
    return video;
  }

  getVideoCanvasCtx() {
    const videoCanvas = document.getElementById(
      "video-canvas"
    ) as HTMLCanvasElement;
    videoCanvas.style.width = `${this.video.videoWidth}px`;
    videoCanvas.width = this.video.videoWidth;
    videoCanvas.style.height = `${this.video.videoHeight}px`;
    videoCanvas.height = this.video.videoHeight;

    const videoCanvasCtx = videoCanvas.getContext("2d");
    return videoCanvasCtx;
  }

  getOverlayCanvasCtx() {
    const overlayCanvas = document.getElementById(
      "overlay-canvas"
    ) as HTMLCanvasElement;
    overlayCanvas.style.width = `${this.video.videoWidth}px`;
    overlayCanvas.width = this.video.videoWidth;
    overlayCanvas.style.height = `${this.video.videoHeight}px`;
    overlayCanvas.height = this.video.videoHeight;

    const overlayCanvasCtx = overlayCanvas.getContext("2d");
    return overlayCanvasCtx;
  }
}
