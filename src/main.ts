import * as PIXI from "pixi.js";

const createApp = () => {
  const app = new PIXI.Application<HTMLCanvasElement>({
    background: "#1099bb",
    resizeTo: window,
  });

  document.body.appendChild(app.view);

  PIXI.Assets.load([
    "https://pixijs.com/assets/eggHead.png",
    "https://pixijs.com/assets/flowerTop.png",
    "https://pixijs.com/assets/helmlok.png",
    "https://pixijs.com/assets/skully.png",
  ]).then(onAssetsLoaded);

  const REEL_WIDTH: number = 160;
  const SYMBOL_SIZE: number = 150;

  function onAssetsLoaded() {
    // 異なるslotシンボルを作成
    const slotTextures = [
      PIXI.Texture.from("https://pixijs.com/assets/eggHead.png"),
      PIXI.Texture.from("https://pixijs.com/assets/flowerTop.png"),
      PIXI.Texture.from("https://pixijs.com/assets/helmlok.png"),
      PIXI.Texture.from("https://pixijs.com/assets/skully.png"),
    ];

    // リールを作る
    const reels = [];
    const reelContainer = new PIXI.Container();

    // リールの数ループする
    for (let i = 0; i < 5; i++) {
      const rc = new PIXI.Container();

      rc.x = i * REEL_WIDTH;
    }
  }

  return app;
};

const app = createApp();
