// --- statePause --- //

import {GameBasics} from "./index";
import { OpeningState } from "./stateOpening";

export class PauseState {
    constructor() {}
    draw(play: GameBasics) {
      play.ctx.clearRect(0, 0, play.width, play.height);
      play.ctx.font = "90px Starjhol";
      play.ctx.fillStyle = "#ffffff";
      play.ctx.textAlign = "center";
      play.ctx.fillText("PAUSE", play.width / 2, play.height / 2 - 200);
      play.ctx.fillStyle = "#D7DF01";
      play.ctx.font = "35px Helvetica";
      play.ctx.fillText(
        "P: zurück zum Spiel",
        play.width / 2,
        play.height / 2 - 100
      );
      play.ctx.fillText(
        "ESC: Spiel verlassen",
        play.width / 2,
        play.height / 2 - 25
      );
      play.ctx.font = "35px Helvetica";
      play.ctx.fillStyle = "#ffffff";
      play.ctx.fillText("Steuerung", play.width / 2, play.height / 2 + 90);
      play.ctx.fillStyle = "#D7DF01";
      play.ctx.font = "30px Helvetica";
      play.ctx.fillText(
        "Steuerkreuz Links : Nach links bewegen",
        play.width / 2,
        play.height / 2 + 150
      );
      play.ctx.fillText(
        "Steuerkreuz Rechts : Nach rechts bewegen",
        play.width / 2,
        play.height / 2 + 200
      );
      play.ctx.fillText(
        "Leertaste : Schießen",
        play.width / 2,
        play.height / 2 + 250
      );
    }
    keyDown(play: GameBasics, keyboardCode: number) {
      if (keyboardCode === 80) {
        // Zurück ins Game: P
        play.popState();
      }
      if (keyboardCode === 27) {
        // Spiel verlassen: ESC
        play.pushState(new OpeningState());
      }
    }
  }
  