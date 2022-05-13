// --- stateOpening --- //

import { GameBasics } from "./index";
import { TransferState } from "./stateTransfer";

export class OpeningState {
  constructor() { }
  draw(play: GameBasics) {
    // Falcon erstellen
    play.ctx.clearRect(0, 0, play.width, play.height); // Alle Inhalte auf dem Canvas werden mit "clearRect" gelöscht 
    play.ctx.font = "100px Starjhol";
    play.ctx.textAlign = "center";
    const gradient = play.ctx.createLinearGradient( //Ein linearer Verlauf wird erzeugt, so kann man der Schrift einen coolen Effekt geben
      play.width / 2 - 180, // x Koordinate Startpunkt
      play.height / 2, // y Koordinate Startpunkt
      play.width / 2 + 180, //x Koordinate Endpunkt
      play.height / 2 // y Koordinate Endpunkt 
    );
    gradient.addColorStop(0, "yellow"); // hier wird der Farbverlauf definiert
    gradient.addColorStop(0.5, "red");
    gradient.addColorStop(1.0, "yellow");
    play.ctx.fillStyle = gradient;
    play.ctx.fillText("T i E - Hunter", play.width / 2, play.height / 2 - 150);

    // "Leertaste drücken um zu starten" soll angezeigt werden
    play.ctx.font = "50px Helvetica";
    play.ctx.fillStyle = "#D7DF01";
    play.ctx.fillText(
      "Drücke 'Leertaste' zum Starten.",
      play.width / 2,
      play.height / 2 + 50
    );
    // Die Spiel-Steuerung soll angezeigt werden
    play.ctx.fillStyle = "#D7DF01";
    play.ctx.font = "35px Helvetica";
    play.ctx.fillText("Spiel-Steuerung", play.width / 2, play.height / 2 + 190);
    play.ctx.font = "25px Helvetica";
    play.ctx.fillText(
      "Steuerkreuz Links : Nach Links bewegen",
      play.width / 2,
      play.height / 2 + 260
    );
    play.ctx.fillText(
      "Steuerkreuz Rechts : Nach Rechts bewegen",
      play.width / 2,
      play.height / 2 + 300
    );
    play.ctx.fillText(
      "Leertaste : Feuern",
      play.width / 2,
      play.height / 2 + 340
    );
  }
  keyDown(play: GameBasics, keyboardCode: number) {
    if (keyboardCode === 32) {
      //User drückt Leertaste
      play.level = 1;
      play.score = 0;
      play.shields = 2;
      play.goToState(new TransferState(play.level)); // muss erst level von Transfer State bekommen
    }
  }
}