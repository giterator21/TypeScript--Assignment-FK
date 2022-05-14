/// --- sounds --- ///

export class Sounds {
    public muted: boolean = false;
    public soundsSource: string[] = [];
    public allSounds: HTMLAudioElement[] = [];
  
    constructor() {}
  
    init() {
      this.soundsSource = [
        "sounds/shot.mp3",
        "sounds/tiefighterDeath.mp3",
        "sounds/explosion.mp3",
      ];
      this.allSounds = [];
      for (let i = 0; i < this.soundsSource.length; i++) {
        this.allSounds[i] = new Audio();
        this.allSounds[i].src = this.soundsSource[i];
        this.allSounds[i].setAttribute("preload", "auto");
      }
    }
  
    playSound(soundName: string) {
      if (this.muted) {
        return; // wenn wir returnen, z.B. im Falle eines mutes, kann die Funktion die switch cases und damit auch die Sounds nicht ausspielen
      }
  
      let soundNumber = 0;
  
      switch (soundName) {
        case "shot":
          soundNumber = 0;
          break;
        case "tiefighterDeath":
          soundNumber = 1;
          break;
        case "explosion":
          soundNumber = 2;
          break;
      }
      this.allSounds[soundNumber].play();
      this.allSounds[soundNumber].currentTime = 0;
    }
  
    mute() {
      if (this.muted == false) {
        this.muted = true;
      } else if (this.muted == true) {
        this.muted = false;
      }
    }
  }
  