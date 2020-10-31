import Context from "./Context";
import { Component } from "./interfaces";
import tinycolor from "tinycolor2";

export default class HoverColorDebug implements Component {
  context: Context;
  keyColor: tinycolor.Instance;
  videoContainer: HTMLElement;
  mouseX: number;
  mouseY: number;
  pitch: number;

  constructor(context: Context) {
    this.context = context;
  }

  setup() {
    this.videoContainer = document.querySelector("#video-container-inner");
    this.videoContainer.addEventListener(
      "mousemove",
      this.onMouseMove.bind(this)
    );
  }

  onMouseMove(e: MouseEvent) {
    const { pageX, pageY } = e;
    const { videoContainer } = this;
    const x = pageX - videoContainer.offsetLeft;
    const y = pageY - videoContainer.offsetTop;

    this.mouseX = x;
    this.mouseY = y;
    // console.log(`(${x}, ${y})`);
  }

  isSimilarHsl(a: tinycolor.Instance, b: tinycolor.Instance) {
    if (!a || !b) {
      return false;
    }

    const aHsl = a.toHsl();
    const bHsl = b.toHsl();

    return (
      aHsl.h === bHsl.h && aHsl.s === bHsl.s && Math.abs(aHsl.l - bHsl.l) <= 10
    );
  }

  update() {
    const { video, videoCanvasCtx, overlayCanvasCtx: ctx } = this.context;
    const { mouseX, mouseY } = this;

    if (!mouseX || !mouseY) {
      return;
    }

    const [r, g, b] = videoCanvasCtx.getImageData(mouseX, mouseY, 1, 1).data;
    this.keyColor = tinycolor({ r, g, b });
  }

  draw() {
    const { video, overlayCanvasCtx: ctx } = this.context;
    const { mouseX, mouseY } = this;

    ctx.fillStyle = this.keyColor?.toHexString();
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 25, 0, 2 * Math.PI);
    ctx.fill();
  }
}
