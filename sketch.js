function playSlowWindBell(x) {
  let osc = new p5.Oscillator('sine');
  let env = new p5.Envelope();
  
  // ADSRの設定を調整
  // attack: 0.2 (少しゆっくり立ち上がる)
  // decay: 1.0
  // sustain: 0.1
  // release: 8.0 (ここを大きくすることで、消えゆく余韻を長くします)
  env.setADSR(0.2, 1.0, 0.1, 8.0);
  
  // 最大音量を抑えることで、耳に優しく、余韻が綺麗に聞こえます
  env.setRange(0.1, 0);

  let freq = map(x, 0, width, 1500, 3500) + random(-50, 50);
  osc.freq(freq);
  osc.amp(env);
  osc.start();
  
  // 音を鳴らす
  env.play();

  // releaseの時間（8000ms）＋余裕を持って停止させる
  // これを忘れると、裏で音が鳴り続けてブラウザが重くなります
  setTimeout(() => {
    osc.stop();
  }, 10000); 
}
