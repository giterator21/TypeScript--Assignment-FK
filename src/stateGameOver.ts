// --- stateGameOver --- //

import {GameBasics} from "./index";
import {OpeningState} from "./stateOpening";

export class GameOverState { 
  constructor() {}
  draw(play: GameBasics) {
    play.ctx.clearRect(0, 0, play.width, play.height);
    play.ctx.font = "100px Starjhol";
    play.ctx.textAlign = "center";
    play.ctx.fillStyle = "#ffffff";
    play.ctx.fillText("Game 0ver!", play.width / 2, play.height / 2 - 120);

    play.ctx.font = "36px Helvetica";
    play.ctx.fillStyle = "#D7DF01";
    play.ctx.fillText(
      "Du hast das Level " +
        play.level +
        " und " +
        play.score +
        " Punkte erreicht.",
      play.width / 2,
      play.height / 2 - 40
    );

    play.ctx.font = "36px Helvetica";
    play.ctx.fillStyle = "#D7DF01";
    play.ctx.fillText(
      "Drücke 'Leertaste' um fortzufahren.",
      play.width / 2,
      play.height / 2 + 40
    );
  }
  keyDown(play: GameBasics, keyboardCode: number) {
    if (keyboardCode === 32) {
      play.goToState(new OpeningState());
    }
  }
}