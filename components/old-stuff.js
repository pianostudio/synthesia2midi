class Processor {
  constructor() {
    this.config = {
      keysOverlay: {
        whites: {
          count: 52,
          radius: 3,
          offsetX: 6,
          deltaX: 24.9,
          y: 685,
        },
        blacks: {
          count: 36,
          radius: 3,
          offsetX: 20,
          deltaX: 29,
          y: 615,
        },
      },
    };

    document.addEventListener("keydown", this.onKeyDown);

    this.video = document.getElementById("video-player");

    this.videoCanvas = document.getElementById("video-canvas");
    this.videoCanvas.width = this.video.videoWidth;
    this.videoCanvas.height = this.video.videoHeight;
    this.videoCanvasCtx = this.videoCanvas.getContext("2d");

    this.overlayCanvas = document.getElementById("overlay-canvas");
    this.overlayCanvas.width = this.video.videoWidth;
    this.overlayCanvas.height = this.video.videoHeight;
    this.overlayCanvasCtx = this.overlayCanvas.getContext("2d");

    this.video.addEventListener(
      "canplay",
      () => {
        this.width = this.video.videoWidth;
        this.height = this.video.videoHeight;
        this.onProcessorLoop();
      },
      false
    );

    this.video.currentTime = 9;
  }

  onKeyDown(e) {
    if (e.altKey) {
      e.preventDefault();
    }

    // if (e.key === "ArrowLeft") {
    //   if (e.altKey) {
    //     this.config.keysOverlay.offsetX -= 1;
    //   } else {
    //     this.config.keysOverlay.deltaX -= 0.1;
    //   }
    // } else if (e.key === "ArrowRight") {
    //   if (e.altKey) {
    //     this.config.keysOverlay.offsetX += 1;
    //   } else {
    //     this.config.keysOverlay.deltaX += 0.1;
    //   }
    // } else if (e.key === "ArrowDown") {
    //   this.config.keysOverlay.y += 1;
    // } else if (e.key === "ArrowUp") {
    //   this.config.keysOverlay.y -= 1;
    // }
  }

  onProcessorLoop() {
    onUpdate();
    onDraw();
    requestAnimationFrame(this.onProcessorLoop);
  }

  onUpdate() {}

  onDraw() {}

  timerCallback() {
    // if (this.video.paused || this.video.ended) {
    //   return;
    // }
    this.computeFrame();
    let self = this;
    setTimeout(function () {
      self.timerCallback();
    }, 0);
  }

  computeFrame() {
    this.videoCanvasCtx.clearRect(
      0,
      0,
      this.videoCanvasCtx.width,
      this.videoCanvasCtx.height
    );

    this.overlayCanvasCtx.clearRect(
      0,
      0,
      this.overlayCanvas.width,
      this.overlayCanvas.height
    );

    this.videoCanvasCtx.drawImage(this.video, 0, 0, this.width, this.height);
    // let frame = this.videoCanvasCtx.getImageData(0, 0, this.width, this.height);
    // let l = frame.data.length;

    // for (let i = 0; i < l; i++) {
    //   let r = frame.data[i + 0];
    //   let g = frame.data[i + 1];
    //   let b = frame.data[i + 2];
    //   if (g > 100 && r > 100 && b < 43) frame.data[i + 3] = 0;
    // }
    // this.overlayCanvasCtx.putImageData(frame, 0, 0);
    this.overlayCanvasCtx.font = "30px sans-serif";
    this.overlayCanvasCtx.fillStyle = "white";
    this.overlayCanvasCtx.fillText("Hello world!", 10, 50);
    this.drawKeysOverlay();
    return;
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
        ctx.beginPath();
        ctx.arc(keyX, keyY, radius, 0, 2 * Math.PI);
        ctx.fill();
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
        ctx.beginPath();
        ctx.arc(keyX, keyY, config.radius, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
}
