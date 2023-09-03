import * as PIXI from "pixi.js";

const app = new PIXI.Application({ background: "#1099bb", resizeTo: window });

document.body.appendChild(app.view);

PIXI.Assets.load([
  "https://pixijs.com/assets/eggHead.png",
  "https://pixijs.com/assets/flowerTop.png",
  "https://pixijs.com/assets/helmlok.png",
  "https://pixijs.com/assets/skully.png",
]).then(onAssetsLoaded);

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;

const REEL_COUNT = 3;

let count = 0;

// onAssetsLoaded handler builds the example.
function onAssetsLoaded() {
  // Create different slot symbols.
  const slotTextures = [
    PIXI.Texture.from("https://pixijs.com/assets/eggHead.png"),
    PIXI.Texture.from("https://pixijs.com/assets/flowerTop.png"),
    PIXI.Texture.from("https://pixijs.com/assets/helmlok.png"),
    PIXI.Texture.from("https://pixijs.com/assets/skully.png"),
  ];

  // Build the reels
  const reels = [];
  const reelContainer = new PIXI.Container();

  // 5つのリールを作成するためのループ
  for (let i = 0; i < REEL_COUNT; i++) {
    const rc = new PIXI.Container();

    rc.x = i * REEL_WIDTH;
    reelContainer.addChild(rc);

    // リールオブジェクトを作成します。
    // リールには、コンテナ、シンボル、位置、前の位置、ブラーフィルターが含まれます。
    const reel = {
      container: rc,
      symbols: [],
      position: 0,
      previousPosition: 0,
      blur: new PIXI.filters.BlurFilter(),
    };

    // ブラーフィルターを設定します。
    reel.blur.blurX = 0;
    reel.blur.blurY = 0;
    rc.filters = [reel.blur];

    // Build the symbols
    // 4つのシンボルを作成するためのループです
    for (let j = 0; j < 4; j++) {
      // シンボルを作成します。ランダムなテクスチャを使用します
      //   const symbol = new PIXI.Sprite(slotTextures[0]);
      const symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
      // Scale the symbol to fit symbol area.

      // シンボルの位置を設定します。
      symbol.y = j * SYMBOL_SIZE;
      // シンボルのスケールを設定します。
      symbol.scale.x = symbol.scale.y = Math.min(
        SYMBOL_SIZE / symbol.width,
        SYMBOL_SIZE / symbol.height
      );
      // シンボルの位置を調整します。
      symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
      reel.symbols.push(symbol);
      rc.addChild(symbol);
    }
    // リールをリストに追加します。
    reels.push(reel);
  }
  app.stage.addChild(reelContainer);

  // Build top & bottom covers and position reelContainer
  // 上部と下部のカバーのマージンを計算します。
  const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;

  // リールコンテナの位置を設定します。
  reelContainer.y = margin;
  reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * REEL_COUNT);

  // 上部のカバーを作成します。
  // グラフィックスオブジェクトを作成し、塗りつぶし色を設定し、矩形を描画します。
  const top = new PIXI.Graphics();
  top.beginFill(0, 1);
  top.drawRect(0, 0, app.screen.width, margin);

  // 下部のカバーを作成します。
  // グラフィックスオブジェクトを作成し、塗りつぶし色を設定し、矩形を描画します。
  const bottom = new PIXI.Graphics();
  bottom.beginFill(0, 1);
  bottom.drawRect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin);

  // Add play text
  // テキストスタイルを定義します。
  // フォント、サイズ、スタイル、色、影、ワードラップなどが含まれます。
  const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 36,
    fontStyle: "italic",
    fontWeight: "bold",
    fill: ["#ffffff", "#00ff99"], // gradient
    stroke: "#4a1850",
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
  });

  // テキストオブジェクトを作成します。テキストとスタイルを指定します。
  const playText = new PIXI.Text("Spin the wheels!", style);

  // テキストオブジェクトの位置を設定します。
  playText.x = Math.round((bottom.width - playText.width) / 2);
  playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);
  // テキストオブジェクトを下部カバーに追加します。
  bottom.addChild(playText);

  // ヘッダーテキストオブジェクトを作成します。テキストとスタイルを指定します。
  const headerText = new PIXI.Text("PIXI MONSTER SLOTS!", style);

  // ヘッダーテキストオブジェクトの位置を設定します。
  headerText.x = Math.round((top.width - headerText.width) / 2);
  headerText.y = Math.round((margin - headerText.height) / 2);
  // ヘッダーテキストオブジェクトを上部カバーに追加します。
  top.addChild(headerText);

  // カバーオブジェクトをステージに追加します。
  app.stage.addChild(top);
  app.stage.addChild(bottom);

  // 下部カバーに対してインタラクティブな機能を設定します。
  // カーソルをポインターに設定し、クリック時に startPlay() 関数を呼び出します。
  bottom.eventMode = "static";
  bottom.cursor = "pointer";
  bottom.addListener("pointerdown", () => {
    startPlay();
  });

  // スロットマシンが回転中かどうかを示す変数 running を初期化します。
  let running = false;

  // スロットマシンを回転させるための関数を定義します。
  function startPlay() {
    // スロットマシンが既に回転中の場合は、関数を終了します。
    // そうでない場合は、running 変数を true に設定します。
    if (running) return;
    running = true;

    // リールの数だけループを実行します。
    for (let i = 0; i < reels.length; i++) {
      // 各リールのターゲット位置とアニメーション時間を計算します。
      const r = reels[i];
      const extra = Math.floor(3);
      //   const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + 2 * 5 + extra;
      //   const target = r.position + 10 + i * 5 + extra;
      const time = 2500 + 3 * 600 + extra * 600;
      //   const time = 2500 + i * 600 + extra * 600;

      // 関数を使用して、リールをアニメーションさせます。
      // アニメーションが完了した場合は、reelsComplete() 関数を呼び出します。
      tweenTo(
        r,
        "position",
        target,
        time,
        backout(0.5),
        null,
        i === reels.length - 1 ? reelsComplete : null
      );
    }
  }

  // リールが完全に停止したときに呼び出される関数を定義します。
  function reelsComplete() {
    // running 変数を false に設定して、スロットマシンが停止したことを示します。
    running = false;
  }

  // アニメーションを更新するための関数を定義します。
  app.ticker.add((delta) => {
    // リールの数だけループを実行します。
    for (let i = 0; i < reels.length; i++) {
      // リールオブジェクトを取得します。
      const r = reels[i];

      // リールのブラーフィルターの位置を更新します。
      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;

      // シンボルの数だけループを実行します。
      for (let j = 0; j < r.symbols.length; j++) {
        // シンボルオブジェクトを取得し、前回の位置を保存します。
        const s = r.symbols[j];
        const prevy = s.y;

        // シンボルの位置を更新します。
        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
        // シンボルがリールの上端を超えた場合、ランダムなテクスチャーに交換します。
        if (s.y < 0 && prevy > SYMBOL_SIZE) {
          // Detect going over and swap a texture.
          // This should in proper product be determined from some logical reel.
          s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
          //   s.texture = slotTextures[2];
          s.scale.x = s.scale.y = Math.min(
            SYMBOL_SIZE / s.texture.width,
            SYMBOL_SIZE / s.texture.height
          );
          s.x = Math.round((SYMBOL_SIZE - s.width) / 2);

          // 最後の画像が表示された場合に、console.logを実行します。
          if (j === r.symbols.length - 1) {
            console.log("Last symbol displayed!");
            count++;
            if (count === 16) {
              console.log("You win!");
              s.texture = slotTextures[1];
              s.scale.x = s.scale.y = Math.min(
                SYMBOL_SIZE / s.texture.width,
                SYMBOL_SIZE / s.texture.height
              );
              s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
            }
            if (count === 17) {
              console.log("You win!");
              s.texture = slotTextures[1];
              s.scale.x = s.scale.y = Math.min(
                SYMBOL_SIZE / s.texture.width,
                SYMBOL_SIZE / s.texture.height
              );
              s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
            }
            if (count === 18) {
              console.log("You win!");
              s.texture = slotTextures[1];
              s.scale.x = s.scale.y = Math.min(
                SYMBOL_SIZE / s.texture.width,
                SYMBOL_SIZE / s.texture.height
              );
              s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
            }
          }
        }
      }
    }
  });
}

// Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
// トゥイーンオブジェクトを格納する配列 tweening を初期化します。
const tweening = [];

// トゥイーンアニメーションを実行するための関数を定義します。
function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
  // トゥイーンオブジェクトを作成します。
  // オブジェクト、プロパティ、ターゲット値、イージング関数、アニメーション時間、変更時のコールバック、完了時のコールバック、開始時間を指定します。
  const tween = {
    object,
    property,
    propertyBeginValue: object[property],
    target,
    easing,
    time,
    change: onchange,
    complete: oncomplete,
    start: Date.now(),
  };
  // トゥイーンオブジェクトを tweening 配列に追加します。
  tweening.push(tween);

  // トゥイーンオブジェクトを返します。
  return tween;
}
// Listen for animate update.
app.ticker.add((delta) => {
  const now = Date.now();
  const remove = [];

  // トゥイーンオブジェクトの数だけループを実行します。
  for (let i = 0; i < tweening.length; i++) {
    const t = tweening[i];
    // トゥイーンアニメーションの進行状況を計算します。
    const phase = Math.min(1, (now - t.start) / t.time);

    // トゥイーンアニメーションの現在の値を計算し、オブジェクトのプロパティに設定します。
    t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
    // 変更時のコールバックが指定されている場合は、コールバックを呼び出します。
    if (t.change) t.change(t);
    // トゥイーンアニメーションが完了した場合は、完了時のコールバックを呼び出し、
    // トゥイーンオブジェクトを remove 配列に追加します。
    if (phase === 1) {
      t.object[t.property] = t.target;
      if (t.complete) t.complete(t);
      remove.push(t);
    }
  }
  // remove 配列に格納されたトゥイーンオブジェクトを tweening 配列から削除します。
  for (let i = 0; i < remove.length; i++) {
    tweening.splice(tweening.indexOf(remove[i]), 1);
  }
});

// トゥイーンアニメーションで使用される補間関数
// 2つの値 a1 と a2 の間を、0から1の範囲で線形補間します。
function lerp(a1, a2, t) {
  return a1 * (1 - t) + a2 * t;
}

// Backout function from tweenjs.
// https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
// イージング関数
// amount は、イージングの強さを調整するためのパラメーターです。
// 関数は、0から1の範囲でのイージング値を返します。
function backout(amount) {
  return (t) => --t * t * ((amount + 1) * t + amount) + 1;
}
