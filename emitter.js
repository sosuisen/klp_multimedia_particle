import * as PIXI from 'pixi.js';
import * as particles from '@pixi/particle-emitter';

const app = new PIXI.Application({ width: 800, height: 600, backgroundColor: 0xffffff });

document.body.appendChild(app.view);
let mouseX = 0;
let mouseY = 0;
app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;
app.stage.on('pointerdown', event => {
  console.log(`[stage] screen(${event.screen.x}, ${event.screen.y}))`);
  emitter.emit = true;
  mouseX = event.screen.x;
  mouseY = event.screen.y;
  container.position.set(mouseX, mouseY);
});

// 全体のコンテナ
const container = new PIXI.Container();
container.position.set(400, 300);
app.stage.addChild(container);

// スプライト作成
const sprite = PIXI.Sprite.from('kyoco_trans256x256.png');
sprite.anchor.set(0.5, 0.5);
sprite.scale.set(0.5, 0.5);

// エミッタ用のコンテナ
const emitterContainer = new PIXI.Container();

// スプライトをエミッタ用コンテナの後から追加
//（逆にするとエフェクトはスプライトより手前になります）
container.addChild(emitterContainer);
// コメントアウトを解除して、スプライトを追加
// container.addChild(sprite);

// エミッタを作成
// パラメータはこちらでいろいろ試せます。
// https://pixijs.io/pixi-particles-editor/    
// デモは次のURLのExamples
// https://github.com/pixijs/particle-emitter
const emitter = new particles.Emitter(
  emitterContainer,
  // オプションの解説
  // https://github.com/pixijs/particle-emitter/blob/master/src/EmitterConfig.ts
  // パラメータを変えてみましょう。
  {
    // 各パーティクルの寿命（秒。minからmaxまでのランダム値）
    lifetime: {
      min: 0.5,
      max: 0.7
    },
    // パーティクルの生まれる機会の頻度（秒）
    frequency: 0.008,
    // 上記の機会のうち、実際に生まれる確率。1以下の値。
    spawnChance: 1,
    // 1回につき生まれるパーティクルの数
    particlesPerWave: 1,
    // エミッタがパーティクルを生み続ける時間（秒）。-1なら永続。
    emitterLifetime: 0.31,
    // 一度に存在できるパーティクル数の最大値
    maxParticles: 1000,
    // パーティクルが生まれる場所
    pos: {
      x: 0,
      y: 0
    },
    // 新しいパーティクルを古いものより奥側に追加するか？
    addAtBack: false,
    behaviors: [
      // time 0 から time 1までの範囲で時間を指定して、
      // その時間における値を指定すると、あとは自動補間される。

      // 透明度
      {
        type: 'alpha',
        config: {
          alpha: {
            list: [
              {
                value: 0.8,
                time: 0
              },
              {
                value: 0.1,
                time: 1
              }
            ],
          },
        }
      },
      // スケール
      {
        type: 'scale',
        config: {
          scale: {
            list: [
              {
                value: 1,
                time: 0
              },
              {
                value: 0.3,
                time: 1
              }
            ],
          },
        }
      },
      // 色
      {
        type: 'color',
        config: {
          color: {
            list: [
              {
                value: "ffff00",
                time: 0
              },
              {
                value: "00ffff",
                time: 1
              }
            ],
          },
        }
      },
      // 移動速度
      {
        type: 'moveSpeed',
        config: {
          speed: {
            list: [
              {
                value: 200,
                time: 0
              },
              {
                value: 100,
                time: 1
              }
            ],
            isStepped: false
          },
        }
      },
      // 移動方向の回転
      {
        type: 'rotationStatic',
        config: {
          min: 0,
          max: 360
        }
      },
      // spawnPointの場合、パーティクルは点から生まれる。
      // 他に、特定の形状の範囲内にパーティクルが生まれるspawnShapeがある。
      // https://github.com/pixijs/particle-emitter/blob/master/src/behaviors/ShapeSpawn.ts
      {
        type: 'spawnPoint',
        config: {},
      },
      // textureSingle：パーティクルは１枚のテクスチャ
      // 他に、textureRandom、textureOrdered、animatedRandom など
      {
        type: 'textureSingle',
        config: {
          texture: PIXI.Texture.from('yellowstar.png')
        }
      }
    ],
  }
);

app.ticker.add(() => {
  // elapsedMSは前回描画からの経過時間（ミリ秒）
  // emitter.update()にマイクロ秒単位にして渡します
  emitter.update(app.ticker.elapsedMS * 0.001);
});

// エミット開始
emitter.emit = true;
