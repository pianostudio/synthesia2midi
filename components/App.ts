import Input from "./Input";
import Context from "./Context";
import VideoCanvasMirror from "./VideoCanvasMirror";
import WhiteKeysOverlay from "./WhiteKeysOverlay";
import BlackKeysOverlay from "./BlackKeysOverlay";
import HoverColorDebug from "./HoverColorDebug";
import WhiteKeySparksOverlay from "./WhiteKeySparksOverlay";
import BlackKeySparksOverlay from "./BlackKeySparksOverlay";

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
    const { context } = this;

    context.components = {};
    context.components.videoCanvasMirror = new VideoCanvasMirror(context);
    // context.components.push(new HoverColorDebug(context));
    context.components.whiteKeysOverlay = new WhiteKeysOverlay(
      context,
      3,
      10,
      24.725,
      685
    );
    context.components.whiteKeySparksOverlay = new WhiteKeySparksOverlay(
      context,
      2,
      10,
      24.725,
      553
    );
    context.components.blackKeysOverlay = new BlackKeysOverlay(
      context,
      3,
      26,
      28.58,
      615
    );
    context.components.blackKeySparksOverlay = new BlackKeySparksOverlay(
      context,
      2,
      26,
      28.58,
      553
    );
  }

  setup() {
    this.context.video.element.playbackRate = 1;
    this.context.video.element.currentTime = 3 * 60 + 30.835;

    for (const [name, component] of Object.entries(this.context.components)) {
      component.setup();
    }
  }

  onAppLoop() {
    this.context.video.update();

    for (const [name, component] of Object.entries(this.context.components)) {
      component.update();
    }

    this.clearScreen();
    for (const [name, component] of Object.entries(this.context.components)) {
      component.draw();
    }
    requestAnimationFrame(this.onAppLoop.bind(this));
  }

  clearScreen() {
    const { videoCanvasCtx, overlayCanvasCtx, video } = this.context;

    videoCanvasCtx.clearRect(0, 0, video.width, video.height);
    overlayCanvasCtx.clearRect(0, 0, video.width, video.height);
  }
}

if (typeof window !== "undefined") {
  function onDocumentReadyStateChange() {
    if ((window as any).app) {
      return;
    }

    (window as any).app = new App();
    new App().run();
  }

  if (document.readyState !== "complete") {
    document.addEventListener("readystatechange", onDocumentReadyStateChange);
  } else {
    onDocumentReadyStateChange();
  }
}
