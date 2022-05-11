// --- stateInTransfer--- //

import {GameBasics} from "./index";
import {InGameState} from "./stateInGame";

export class TransferState {
    public level: number;
    public fontSize: number;
    public fontColor: number;

    constructor(level: number) {
        this.level = level;
        this.fontSize = 150;
        this.fontColor = 255;
    }

    update(play: GameBasics) {
        this.fontSize -= 1; // die definierte "fontSize" wird kontinuierlich verringert, so entsteht die Animation
        this.fontColor -= 1.5; // die fefinierte "fontColor" wird kontinuierlich um den Wert 1 verringert, so entsteht ein Verlauf
        if (this.fontSize < 1) {
            // wenn die Bedingung erfüllt wird, also die Schriftanimation soweit durchgeführt wurde, 
            // dass der Schriftzug nichtmehr sichtbar ist, wird in von der TransferState in den InGameState gewechselt
            play.goToState(new InGameState(play.setting, this.level));
          }
    }

    draw(play: GameBasics) {
        play.ctx.clearRect(0, 0, play.width, play.height);
        play.ctx.font = this.fontSize + "px Starjhol";
        play.ctx.textAlign = "center";
        play.ctx.fillStyle =
            "rgba(255, " + this.fontColor + ", " + this.fontColor + ", 1)";
        play.ctx.fillText(
            "Mach dich bereit für Level " + this.level,
            play.width / 2,
            play.height / 2
        );
    }
}