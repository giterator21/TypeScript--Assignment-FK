/// --- stateInGame --- ///
import {GameBasics, GameSettings} from "./index";
import {Falcon, Objects as GameObjects} from "./objects";

export class InGameState {
    public setting: GameSettings;
    public level: number;
    public object: GameObjects | null = null;
    public falcon: Falcon | null;
    public falcon_image: HTMLImageElement | null = null;


    constructor(setting: GameSettings, level: number) {
        this.setting = setting;
        this.level = level;
        this.object = null;
        this.falcon = null;
    }

    entry(play: GameBasics) {
        this.falcon_image = new Image();
        this.object = new GameObjects();
        this.falcon = this.object.falcon(
            play.width / 2,
            play.playBoundaries.bottom,
            this.falcon_image
          );
    }

    update(play: GameBasics) {
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

    keyDown(play: GameBasics) {

    }
}