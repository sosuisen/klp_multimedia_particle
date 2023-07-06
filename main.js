import * as PIXI from 'pixi.js'

const app = new PIXI.Application({ antialias: true, width: 800, height: 600 });

document.body.appendChild(app.view);


const particles = new PIXI.Container();
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
  spr.x = mouseX;
  // 上下の開始位置をずらす（負の値なので画面外）
  spr.y = mouseY;
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

/**
 * マウスの位置取得
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

    const kyoco = PIXI.Sprite.from(tx);
    initSprite(kyoco);
    particles.addChild(kyoco);  
});

let time = 0.0;
app.ticker.add(delta => {
  time += delta;

  particles.children.forEach(spr => {
    // 元のx座標に対して、最大でスプライト幅の半分までsin関数で左右にゆらぐ
    spr.x = spr.orgX + spr.width / 2.0 * Math.sin(time/50);

    // y座標をそれぞれのspeedの値だけ増やす場合
    spr.y += spr.speed;
  })
});
