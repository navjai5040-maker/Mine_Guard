// Synthesizes an oscillating industrial evacuation siren using browser Web Audio API
class AudioSirenService {
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public startSiren() {
    if (this.isPlaying) return;

    try {
      this.initContext();
      if (!this.audioCtx) return;

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // Master Gain
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.audioCtx.currentTime);
      this.gainNode.connect(this.audioCtx.destination);

      // Main Siren Oscillator (Sawtooth waveform for industrial penetration)
      this.oscillator = this.audioCtx.createOscillator();
      this.oscillator.type = 'sawtooth';
      this.oscillator.frequency.setValueAtTime(650, this.audioCtx.currentTime); // Base frequency 650Hz

      // LFO for the frequency modulation (wailing sweep between 450Hz and 850Hz)
      this.lfo = this.audioCtx.createOscillator();
      this.lfo.type = 'triangle';
      this.lfo.frequency.setValueAtTime(0.65, this.audioCtx.currentTime); // 0.65 Hz sweep cycle

      const lfoGain = this.audioCtx.createGain();
      lfoGain.gain.setValueAtTime(220, this.audioCtx.currentTime); // +/- 220Hz deviation

      this.lfo.connect(lfoGain);
      lfoGain.connect(this.oscillator.frequency);

      this.oscillator.connect(this.gainNode);

      this.lfo.start();
      this.oscillator.start();
      this.isPlaying = true;
    } catch {
      // Audio playback gracefully suppressed if user hasn't interacted with document
    }
  }

  public stopSiren() {
    if (!this.isPlaying) return;

    try {
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }
      if (this.lfo) {
        this.lfo.stop();
        this.lfo.disconnect();
        this.lfo = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
      this.isPlaying = false;
    } catch {
      this.isPlaying = false;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(
        this.isMuted ? 0 : 0.15,
        this.audioCtx.currentTime
      );
    }
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(
        this.isMuted ? 0 : 0.15,
        this.audioCtx.currentTime
      );
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const sirenPlayer = new AudioSirenService();
