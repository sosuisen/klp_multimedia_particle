import * as PIXI from 'pixi.js';
import * as particles from '@pixi/particle-emitter';

const app = new PIXI.Application({ width: 800, height: 600, backgroundColor: 0x000000 });

document.body.appendChild(app.view);

const fires = [];
const emitters = [];

app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;
app.stage.on('pointerdown', event => {
  const mouseX = event.screen.x;
  const mouseY = event.screen.y;

  const fire = PIXI.Sprite.from('fire.png');
  fire.pivot.set(1, 1);
  fire.scale.set(2.0);
  fire.x = mouseX;
  fire.y = mouseY;
  fire.orgX = fire.x;
  fire.explosionHeight = 100 + 200 * Math.random();
  fires.push(fire);
  app.stage.addChild(fire);
});

const emitterContainer = new PIXI.Container();
app.stage.addChild(emitterContainer);

const emitterOptions = {
  // 各パーティクルの寿命（秒。minからmaxまでのランダム値）
  lifetime: {
    min: 1.5,
    max: 3.0
  },
  // パーティクルの生まれる機会の頻度（秒）
  frequency: 0.3,
  // 上記の機会のうち、実際に生まれる確率。1以下の値。
  spawnChance: 1,
  // 1回につき生まれるパーティクルの数
  particlesPerWave: 50,
  // エミッタがパーティクルを生み続ける時間（秒）。-1なら永続。
  emitterLifetime: 0.61,
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
    // 透明度
    {
      type: 'alpha',
      config: {
        alpha: {
          list: [
            {
              value: 1.0,
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
              value: 3,
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
              value: "0000ff",
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
              value: 300,
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
    {
      type: 'spawnPoint',
      config: {},
    },
    {
      type: 'textureSingle',
      config: {
        texture: PIXI.Texture.from('fire.png')
      }
    }
  ],
}

app.ticker.add(() => {
  emitters.forEach(emitter => emitter.update(app.ticker.elapsedMS * 0.001));
  fires.forEach(fire => {
    fire.y -= 7;
    fire.x = fire.orgX + 3 * Math.sin(fire.y * 0.1);
    if (fire.y < fire.explosionHeight) {
      emitterOptions.pos.x = fire.x;
      emitterOptions.pos.y = fire.y;
      const emitter = new particles.Emitter(
        emitterContainer,
        emitterOptions,
      );
      emitter.emit = true;
      emitters.push(emitter);

      fire.parent.removeChild(fire);
      fires.splice(fires.indexOf(fire), 1);
      fire.destroy();
    }
  });
});
