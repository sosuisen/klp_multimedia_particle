import * as PIXI from 'pixi.js'
import { EventBoundary, Graphics } from 'pixi.js';

const app = new PIXI.Application({ antialias: true, width: 800, height: 600 });

document.body.appendChild(app.view);

// 表示をする画像の最大数を指定
let maxSprites = 200;
// const maxSprites = 1000;

const particles = new PIXI.Container();
// （参考）最も処理効率を高くする場合、ParticleContainerを用いる。
// ただし、処理効率の代わりに、マスク、フィルタ、テクスチャの変更などの
// 高度な機能が使えない。
// https://pixijs.download/dev/docs/PIXI.ParticleContainer.html
/*
const particles = new PIXI.ParticleContainer(maxSprites, {
  vertices: true, // scaleを変更する場合はtrue
  position: true, // positionを変更する場合はtrue
  rotation: true, // rotationを変更する場合はtrue
});
*/

app.stage.addChild(particles);

// テクスチャのサイズは縦横ともに2のべき乗とするのが最も処理効率がよい。
// kyoco_trans256x256.pngは縦横256px
const tx = PIXI.Texture.from('kyoco_trans256x256.png');

/**
 * スプライトの初期化
 */
const initSprite = spr => {
  // 中心位置を指定
  spr.anchor.set(0.5);
  // 左右の開始位置をずらす
  spr.x = Math.random() * app.screen.width;
  // 上下の開始位置をずらす（負の値なので画面外）
  spr.y = - Math.random() * app.screen.height;
  // サイズを変更
  // Math.random()は 0以上1未満の値を返す
  spr.scale.set(Math.random()/2);
  // 角度はラジアンで指定。左右に最大90度
  spr.rotation = Math.PI / (-2.0 + 4.0 * Math.random());

  // 以下は独自プロパティ
  // speedプロパティを追加して、速度を格納しておく
  spr.speed = 1 + Math.random() * 3;
  // orgXプロパティを追加して、元のx座標をコピーしておく
  spr.orgX = spr.x;

  return spr;
};

for (let i = 0; i < maxSprites/2; i++){
  // 同じテクスチャを使いまわす
  const kyoco = PIXI.Sprite.from(tx);
  initSprite(kyoco);
  particles.addChild(kyoco);
}

/**
 * マウスの位置取得
 */
let mouseX = 0;
let mouseY = 0;
app.stage.interactive = true;
app.stage.hitArea = app.screen; // app.stageをinteractiveにするときは必須。
app.stage.on('pointermove', event => {
    console.log(`[stage] screen(${event.screen.x}, ${event.screen.y}))`);
    mouseX = event.screen.x;
    mouseY = event.screen.y;
});

let time = 0.0;
app.ticker.add(delta => {
  time += delta;

  particles.children.forEach(spr => {
    // まっすぐ落ちる
    spr.x = spr.orgX;
    // 元のx座標に対して、最大でスプライト幅の半分までsin関数で左右にゆらぐ
    spr.x = spr.orgX + spr.width / 2.0 * Math.sin(time/50);

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
