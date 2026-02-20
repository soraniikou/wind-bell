let particles = [];
let msgAlpha = 255; // 文字の透明度

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(10, 15, 30);
}

function draw() {
  // 残像演出
  background(10, 15, 30, 25); 

  // メッセージの表示（ゆっくり押してほしいため、優しく表示）
  if (msgAlpha > 0) {
    fill(200, 220, 255, msgAlpha);
    textAlign(CENTER, CENTER);
    textFont('sans-serif');
    textSize(24);
    // 「ゆっくり押してください」の英語表現
    text("Press gently", width / 2, height / 2);
    
    // 操作を始めたら徐々に消していく
    if (mouseIsPressed || touches.length > 0) {
      msgAlpha -= 5;
    }
  }

  // 星屑の更新と描画
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

function mouseMoved() {
  if (random() > 0.8) {
    playSlowWindBell(mouseX);
    for (let i = 0; i < 3; i++) {
      particles.push(new StarDust(mouseX, mouseY));
    }
  }
}

// タッチデバイス対応
function touchMoved() {
  if (random() > 0.8) {
    playSlowWindBell(touches[0].x);
    for (let i = 0; i < 3; i++) {
      particles.push(new StarDust(touches[0].x, touches[0].y));
    }
  }
  return false; // スクロール防止
}

function playSlowWindBell(x) {
  let osc = new p5.Oscillator('sine');
  let env = new p5.Envelope();
  
  // 余韻を長く(release 2.0)設定
  env.setADSR(0.1, 0.5, 0.1, 2.0);
  env.setRange(0.2, 0);

  let freq = map(x, 0, width, 1500, 4000) + random(-100, 100);
  osc.freq(freq);
  osc.amp(env);
  osc.start();
  env.play();

  setTimeout(() => osc.stop(), 3000);
}

class StarDust {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.acc = createVector(0, 0.02);
    this.lifespan = 255;
    this.color = random() > 0.5 ? color(200, 230, 255) : color(255, 250, 200);
    this.size = random(1, 4);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 2;
  }

  display() {
    noStroke();
    let a = map(this.lifespan, 0, 255, 0, 150);
    fill(red(this.color), green(this.color), blue(this.color), a);
    let sz = this.size * (sin(frameCount * 0.1) + 1.5);
    circle(this.pos.x, this.pos.y, sz);
  }

  isDead() { return this.lifespan < 0; }
}