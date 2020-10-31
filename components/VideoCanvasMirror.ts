import Context from "./Context";
import { Component } from "./interfaces";

export default class VideoCanvasMirror implements Component {
  context: Context;
  mediaTimeDisplayEl: HTMLSpanElement;
  seekBar: HTMLInputElement;
  frame: ImageData;

  constructor(context: Context) {
    this.context = context;
  }

  setup() {
    this.seekBar = document.querySelector("#seek-bar") as HTMLInputElement;
    this.seekBar.addEventListener("input", this.onSeekBarChange.bind(this));

    this.context.video.element.currentTime =
      (this.context.video.element.duration * parseFloat(this.seekBar.value)) /
      100;

    const playPauseButton = document.querySelector(
      "#play-pause-button"
    ) as HTMLButtonElement;

    this.mediaTimeDisplayEl = document.querySelector(
      "#media-time-display"
    ) as HTMLSpanElement;

    playPauseButton.addEventListener("click", this.onPlayPauseClick.bind(this));

    this.context.video.element.addEventListener(
      "timeupdate",
      this.onVideoTimeUpdate.bind(this)
    );
  }

  onSeekBarChange(e) {
    this.context.video.element.currentTime =
      (this.context.video.element.duration * e.target.value) / 100;
  }

  onPlayPauseClick(e) {
    if (this.context.video.element.paused) {
      this.context.video.element.play();
    } else {
      this.context.video.element.pause();
    }
  }

  onVideoTimeUpdate(e) {
    let minutes = Math.floor(this.context.video.element.currentTime / 60);
    let seconds = Math.floor(
      this.context.video.element.currentTime - minutes * 60
    );
    let fracSeconds = Math.floor(
      (this.context.video.element.currentTime - minutes * 60 - seconds) * 1000
    );
    let minuteDisplay;
    let secondsDisplay;
    let fracSecondsDisplay;

    if (minutes < 10) {
      minuteDisplay = "0" + minutes;
    } else {
      minuteDisplay = minutes;
    }

    if (seconds < 10) {
      secondsDisplay = "0" + seconds;
    } else {
      secondsDisplay = seconds;
    }

    if (fracSeconds < 10) {
      fracSecondsDisplay = "00" + fracSeconds;
    } else if (fracSeconds < 100) {
      fracSecondsDisplay = "0" + fracSeconds;
    } else {
      fracSecondsDisplay = fracSeconds;
    }

    let mediaTime = `${minuteDisplay}:${secondsDisplay}.${fracSecondsDisplay}`;

    this.mediaTimeDisplayEl.innerText = mediaTime;
    this.seekBar.value = `${
      (this.context.video.element.currentTime /
        this.context.video.element.duration) *
      100
    }`;
  }

  update() {
    const { videoCanvasCtx, video } = this.context;

    this.frame = videoCanvasCtx.getImageData(0, 0, video.width, video.height);
  }

  draw() {
    const { video, videoCanvasCtx } = this.context;

    videoCanvasCtx.drawImage(video.element, 0, 0, video.width, video.height);
  }
}
