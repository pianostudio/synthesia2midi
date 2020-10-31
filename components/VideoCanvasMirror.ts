import Context from "./Context";
import { Component } from "./interfaces";

export default class VideoCanvasMirror implements Component {
  context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  setup() {}

  update() {}

  draw() {
    const { video, videoCanvasCtx } = this.context;

    videoCanvasCtx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  }
}
