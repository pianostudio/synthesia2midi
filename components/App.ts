import Input from "./Input";
import Context from "./Context";
import VideoCanvasMirror from "./VideoCanvasMirror";
import WhiteKeysOverlay from "./WhiteKeysOverlay";
import BlackKeysOverlay from "./BlackKeysOverlay";

export default class App {
  public context: Context;

  video: HTMLVideoElement;
  videoCanvas: HTMLCanvasElement;
  videoCanvasCtx: any;
  overlayCanvas: HTMLCanvasElement;
  overlayCanvasCtx: any;
  width: any;
  height: any;
  config: any;

  constructor() {
    this.context = new Context();
  }

  run() {
    this.onAddComponents();
    this.setup();
    requestAnimationFrame(this.onAppLoop.bind(this));
  }

  onAddComponents() {
    this.context.components = [];
    this.context.components.push(new VideoCanvasMirror(this.context));
    this.context.components.push(
      new WhiteKeysOverlay(this.context, 3, 10, 24.725, 685)
    );
    this.context.components.push(
      new BlackKeysOverlay(this.context, 3, 26, 28.58, 615)
    );
  }

  setup() {
    this.context.video.currentTime = 9;

    for (const component of this.context.components) {
      component.setup();
    }
  }

  onAppLoop() {
    for (const component of this.context.components) {
      component.update();
    }

    this.clearScreen();
    for (const component of this.context.components) {
      component.draw();
    }
    requestAnimationFrame(this.onAppLoop.bind(this));
  }

  clearScreen() {
    const { videoCanvasCtx, overlayCanvasCtx, video } = this.context;

    videoCanvasCtx.clearRect(0, 0, video.videoWidth, video.videoHeight);
    overlayCanvasCtx.clearRect(0, 0, video.videoWidth, video.videoHeight);
  }

  drawKeysOverlay() {
    const ctx = this.overlayCanvasCtx;

    {
      const config = this.config.keysOverlay.whites;

      for (let i = 0; i < config.count; i++) {
        const isPitchC = (i - 2) % 7 === 0;
        const radius = isPitchC ? config.radius * 1.25 : config.radius;

        ctx.fillStyle = isPitchC ? "darkorange" : "orange";
        const keyX = config.offsetX + i * config.deltaX;
        const keyY = config.y;
      }
    }

    {
      const config = this.config.keysOverlay.blacks;

      for (let i = 0; i < config.count; i++) {
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

        ctx.fillStyle = "orange";
        const keyX = extraOffset + config.offsetX + i * config.deltaX;
        const keyY = config.y;
      }
    }
  }
}

if (typeof window !== "undefined") {
  function onDocumentReadyStateChange() {
    new App().run();
  }

  if (document.readyState !== "complete") {
    console.log("A");
    document.addEventListener("readystatechange", onDocumentReadyStateChange);
  } else {
    console.log("B");
    onDocumentReadyStateChange();
  }
}
