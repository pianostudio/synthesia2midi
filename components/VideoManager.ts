import tinycolor from "tinycolor2";
import Context from "./Context";
import { Component } from "./interfaces";

export default class VideoManager implements Component {
  context: Context;
  element: HTMLVideoElement;

  constructor(context: Context) {
    this.context = context;
    this.element = document.getElementById("video-player") as HTMLVideoElement;
  }

  setup() {}

  update() {
    const { videoCanvasCtx, video } = this.context;
  }

  get height() {
    return 720;
    return this.element.videoHeight;
  }

  get width() {
    return 1280;
    return this.element.videoWidth;
  }

  getPixelAt(x: number, y: number) {
    const { videoCanvasCtx } = this.context;
    const [r, g, b] = videoCanvasCtx.getImageData(x, y, 1, 1).data;
    return tinycolor({ r, g, b });
  }

  clamp(min: number, max: number, value: number) {
    if (min <= max) {
      // Sanity check

      if (value > max) {
        // Also implied: mid is not NaN
        return max;
      }

      if (value < min) {
        // Also implied: mid is not NaN
        return min;
      }

      // At this point mid is either between min and max or it's NaN.
      // Both cases are okay, we just return what we have.
      return value;
    } else {
      // Oops! max is less than min.
      // Or worse: min or max (or both) is NaN
      return NaN;
    }
  }

  draw() {}
}
