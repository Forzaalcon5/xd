import { Audio } from 'expo-av';

// Map of sound names to require() paths
// We use a map but will wrap access in try/catch in case files don't exist
const SOUND_FILES: Record<string, any> = {
  // Uncomment when files are added:
  // click: require('../assets/sounds/click.mp3'),
  // success: require('../assets/sounds/success.mp3'),
  // breathe_in: require('../assets/sounds/breathe_in.mp3'),
  // breathe_out: require('../assets/sounds/breathe_out.mp3'),
  pop: require('../assets/sounds/pop.mp3'),
  // Ambient
  rain: require('../assets/sounds/rain.mp3'),
  ocean: require('../assets/sounds/ocean.mp3'),
  fire: require('../assets/sounds/fire.mp3'),
  birds: require('../assets/sounds/birds.mp3'),
};

type SoundName = keyof typeof SOUND_FILES;

class SoundManager {
  private sounds: Record<string, Audio.Sound> = {};

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (e) {
      console.warn('Failed to init audio', e);
    }
  }

  private currentAmbient: Audio.Sound | null = null;
  private currentAmbientName: string | null = null;

  async play(name: string) {
    try {
      const source = SOUND_FILES[name];
      if (!source) return; 

      const { sound } = await Audio.Sound.createAsync(source);
      const key = `${name}_${Date.now()}`;
      this.sounds[key] = sound;
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          delete this.sounds[key];
        }
      });

      await sound.playAsync();
    } catch (error) {
      // Graceful failure if asset is missing or errored
    }
  }

  async playAmbient(name: string) {
    try {
      if (this.currentAmbientName === name) return; // Already playing

      // Stop previous
      if (this.currentAmbient) {
        await this.currentAmbient.stopAsync();
        await this.currentAmbient.unloadAsync();
        this.currentAmbient = null;
        this.currentAmbientName = null;
      }

      if (!name || name === 'off') return;

      const source = SOUND_FILES[name];
      if (!source) return;

      const { sound } = await Audio.Sound.createAsync(source, { isLooping: true });
      this.currentAmbient = sound;
      this.currentAmbientName = name;
      await sound.playAsync();
    } catch (error) {
      console.warn('Ambient play failed', error);
    }
  }

  async stopAmbient() {
    if (this.currentAmbient) {
      await this.currentAmbient.stopAsync();
      await this.currentAmbient.unloadAsync();
      this.currentAmbient = null;
      this.currentAmbientName = null;
    }
  }

  async unloadAll() {
    for (const key in this.sounds) {
      try {
        await this.sounds[key].unloadAsync();
      } catch (e) {}
    }
    await this.stopAmbient();
    this.sounds = {};
  }
}

export const SoundService = new SoundManager();
