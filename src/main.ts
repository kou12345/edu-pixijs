import * as PIXI from "pixi.js";

const createApp = () => {
  const app = new PIXI.Application<HTMLCanvasElement>({
    width: 800,
    height: 600,
    backgroundColor: 0x23afda,
  });
  document.body.appendChild(app.view);
  return app;
};

const app = createApp();
