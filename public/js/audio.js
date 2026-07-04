// Audio Manager - creates audio dynamically without external files
class AudioManager {
  static playSound(scene, type) {
    // Create simple beep/tone sounds programmatically
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    
    let frequency, duration, attack, decay;
    
    switch(type) {
      case 'jump':
        frequency = 400;
        duration = 0.1;
        attack = 0.01;
        decay = 0.09;
        break;
      case 'hit':
        frequency = 200;
        duration = 0.15;
        attack = 0.02;
        decay = 0.13;
        break;
      case 'collect':
        frequency = 800;
        duration = 0.2;
        attack = 0.05;
        decay = 0.15;
        break;
      case 'powerup':
        frequency = 1200;
        duration = 0.3;
        attack = 0.05;
        decay = 0.25;
        break;
      case 'levelup':
        frequency = 1000;
        duration = 0.5;
        attack = 0.05;
        decay = 0.45;
        break;
      default:
        frequency = 600;
        duration = 0.1;
        attack = 0.01;
        decay = 0.09;
    }

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0, now + duration);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  static playBackgroundMusic(scene) {
    // Background music loop (can be replaced with actual audio file)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // In production, load actual music file
  }
}
