import * as PIXI from 'pixi.js'

const app = new PIXI.Application({ antialias: true, width: 800, height: 600 });

document.body.appendChild(app.view);

// 表示をする画像の最大数を指定
let maxSprites = 100;

// 10000個くらいは余裕で60FPS？ 100000個は無理？
// maxSprites = 10000;
// maxSprites = 100000;

let particles = new PIXI.Container();
// （参考）最も処理効率を高くする場合、ParticleContainerを用いる。
// ただし、処理効率の代わりに、マスク、フィルタ、テクスチャの変更などの
// 高度な機能が使えない。
// https://pixijs.download/dev/docs/PIXI.ParticleContainer.html

/*
particles = new PIXI.ParticleContainer(maxSprites, {
  position: true, // positionを変更できるようにする場合はtrue
  // 変更できる要素を増やすほど処理は重くなります。
  //  vertices: true, // scaleを変更できるようにする場合はtrue
  //  rotation: true, // rotationを変更できるようにする場合はtrue
});
*/

app.stage.addChild(particles);

const tx = PIXI.Texture.from('kyoco_trans256x256.png');

/**
 * スプライトの初期化
 */
const initSprite = spr => {
  // 中心位置を指定
  spr.anchor.set(0.5);
  // 左右の開始位置をずらします
  // Math.random()は 0以上1未満の値を返します
  spr.x = Math.random() * app.screen.width;
  // 上下の開始位置をずらします（負の値なので画面外）
  spr.y = - Math.random() * app.screen.height;
  // サイズを変更
  spr.scale.set(Math.random() / 2);
  // 角度はラジアンで指定。左右に最大90度
  spr.rotation = Math.PI / (-2.0 + 4.0 * Math.random());

  // 以下は独自プロパティ。JavaScriptではオブジェクトに任意のプロパティを追加できます。
  // speedプロパティを追加して、速度を格納しておきます
  spr.speed = 1 + Math.random() * 3;
  // orgXプロパティを追加して、元のx座標をコピーしておきます
  spr.orgX = spr.x;

  return spr;
};

for (let i = 0; i < maxSprites; i++) {
  // 同じテクスチャを使いまわします
  const kyoco = PIXI.Sprite.from(tx);
  initSprite(kyoco);
  particles.addChild(kyoco);
}

/**
 * マウスの位置取得(発展課題で使ってください)
 */
let mouseX = 0;
let mouseY = 0;
app.stage.eventMode = 'static';
// app.stageのeventModeをstaticにしてstage上のイベントを取得する場合は
// hitArea = app.screenが必須。
app.stage.hitArea = app.screen;
app.stage.on('pointerdown', event => {
  console.log(`[stage] screen(${event.screen.x}, ${event.screen.y}))`);
  mouseX = event.screen.x;
  mouseY = event.screen.y;
});

// FPSを表示するテキスト
let fpsText = new PIXI.Text('', { fontSize: '24px', fill: '#FF0000' });
fpsText.x = 10;
fpsText.y = 10;
let fpsCount = 0;
app.stage.addChild(fpsText);

let time = 0.0;
app.ticker.add(delta => {
  fpsCount++;
  time += delta;

  particles.children.forEach(spr => {
    // まっすぐ落ちる
    spr.x = spr.orgX;
    // 元のx座標に対して、最大でスプライト幅の半分までsin関数で左右にゆらぐ
    // spr.x = spr.orgX + spr.width / 2.0 * Math.sin(time/50);

    // どれも同じ速度で落ちる
    spr.y += 3;
    // y座標をそれぞれのspeedの値だけ増やす場合
    // spr.y += spr.speed;

    // 下端に達したスプライトは上へ戻す
    // スプライトの座標原点は中心なので、サイズの半分を足しておく
    if (spr.y > app.screen.height + spr.width / 2.0) {
      initSprite(spr);
    }
  })
});

setInterval(function () {
  fpsText.text = 'FPS: ' + fpsCount;
  fpsCount = 0;
}, 1000);
