/// --- stateInGame --- ///
import {GameBasics, GameSettings} from "./index";
import {Falcon, Objects as GameObjects} from "./objects";

export class InGameState {
    public setting: GameSettings;
    public level: number;
    public object: GameObjects | null = null;
    public falcon: Falcon | null;
    public falcon_image: HTMLImageElement | null = null;
    public falconSpeed: number = 0;
    public upSec: number = 0;



    constructor(setting: GameSettings, level: number) {
        this.setting = setting;
        this.level = level;
        this.object = null;
        this.falcon = null;
    }

    entry(play: GameBasics) {
        this.falcon_image = new Image();
        this.object = new GameObjects();
        this.upSec = this.setting.updateSeconds;
        this.falconSpeed = this.setting.falconSpeed;
        this.falcon = this.object.falcon(
            play.width / 2,
            play.playBoundaries.bottom,
            this.falcon_image
          );
    }

    update(play: GameBasics) {
      const falcon = this.falcon;
      const falconSpeed = this.falconSpeed;
      const upSec = this.setting.updateSeconds;
      if (!falcon) {
        return;
      }
      //Tastatur-Eingaben

    if (play.pressedKeys[37]) {
      falcon.x -= falconSpeed * upSec;
    }
    if (play.pressedKeys[39]) {
      falcon.x += falconSpeed * upSec;
    }
    }

    draw(play: GameBasics) {
            play.ctx.clearRect(0, 0, play.width, play.height);
            if (!this.falcon_image || !this.falcon) {
              return;
            }
            play.ctx.drawImage(
              this.falcon_image,
              this.falcon.x - this.falcon.width / 2,
              this.falcon.y - this.falcon.height / 2
            );
    }

    keyDown(play: GameBasics, keyboardCode: number) {

    }
}