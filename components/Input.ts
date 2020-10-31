export default class Input {
  constructor() {
    window.document.addEventListener("keydown", this.onKeyDown);
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
}
