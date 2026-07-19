const SoundEffects = (() => {
  let audioCtx = null;
  let muted = false;

  const initAudio = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  const playSound = (freqs, duration, type = 'sine', slide = false, endFreq = null) => {
    if (muted) return;
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (Array.isArray(freqs)) {
      // Melody or arpeggio
      let startTime = now;
      const noteDuration = duration / freqs.length;
      freqs.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.15, startTime);
        // fade out slightly before the next note
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration - 0.02);
        startTime += noteDuration;
      });
      osc.start(now);
      osc.stop(now + duration);
    } else {
      // Single frequency
      osc.frequency.setValueAtTime(freqs, now);
      if (slide && endFreq !== null) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
      }
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.start(now);
      osc.stop(now + duration);
    }
  };

  return {
    toggleMute() {
      muted = !muted;
      localStorage.setItem('quiz_game_muted', muted);
      return muted;
    },
    isMuted() {
      if (localStorage.getItem('quiz_game_muted') !== null) {
        muted = localStorage.getItem('quiz_game_muted') === 'true';
      }
      return muted;
    },
    playClick() {
      playSound(600, 0.08, 'sine');
    },
    playCorrect() {
      // Happy ascending arpeggio C5 -> E5 -> G5 -> C6
      playSound([523.25, 659.25, 783.99, 1046.50], 0.4, 'triangle');
    },
    playWrong() {
      // Discordant buzz sliding downwards
      playSound(180, 0.35, 'sawtooth', true, 80);
    },
    playTimerTick() {
      // Subtle dry tick
      if (muted) return;
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    },
    playLifeline() {
      // Energetic sci-fi laser ascending sweep
      playSound(300, 0.4, 'triangle', true, 1200);
    },
    playVictory() {
      // Victory fanfare
      const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
      playSound(notes, 0.8, 'sine');
    },
    playGameOver() {
      // Sad descending chime
      playSound([392.00, 349.23, 311.13, 261.63], 0.8, 'sine');
    }
  };
})();