/// --- stateInGame --- ///
import { GameBasics, GameSettings } from "./index";
import { Falcon, Bullet, Bomb, Objects as GameObjects, Tiefighter } from "./objects";
import { OpeningState } from "./stateOpening";
import { PauseState } from "./statePause";
import {TransferState} from "./stateTransfer";

export class InGameState {
  public setting: GameSettings;
  public level: number;
  public object: GameObjects | null = null;
  public falcon: Falcon | null;
  public falcon_image: HTMLImageElement | null = null;
  public falconSpeed: number = 0;
  public upSec: number = 0;
  public bullets: Bullet[];
  public lastBulletTime: null | number;
  public tiefighters: Tiefighter[];
  public tiefighter_image: HTMLImageElement | null = null;
  public tiefighterSpeed: number = 0;
  public horizontalMoving: number = 1;
  public verticalMoving: number = 0;
  public tiefightersAreSinking: boolean = false;
  public tiefighterPresentSinkingValue: number = 0;
  public turnAround: number = 1;
  public bombs: Bomb[];
  public bombSpeed: number = 0;
  public bombFrequency: number = 0;






  constructor(setting: GameSettings, level: number) {
    this.setting = setting;
    this.level = level;
    this.object = null;
    this.falcon = null;
    this.bullets = []; //die Bullets müssen in einem Array (dynamisch) zwischengespeichert werden, um sichtbar zu bleiben und werden nur
    //dann mit splice gelöscht, wenn sie einen Tie-Fighter treffen oder den Rand des Canvas erreichen
    this.lastBulletTime = null;
    this.tiefighters = []; //die Tiefighter werden wie die Bullets in einem abstrakten Datentyp (array) gespeichert
    this.bombs = []; // die Tie-fighter Bomben werden wie die anderen Objekte auch in einem Array gespeichert

  }

  entry(play: GameBasics) {
    this.falcon_image = new Image();
    this.tiefighter_image = new Image();
    this.object = new GameObjects();
    this.upSec = this.setting.updateSeconds;
    this.falconSpeed = this.setting.falconSpeed;
    this.horizontalMoving = 1; // es wird geprüft ob die Tiefighter sich gerade horizontal oder vertikal bewegen
    this.verticalMoving = 0; // hierbei ist 1 = true & 0 = false
    this.tiefightersAreSinking = false; // ist true, wenn sich die Flotte vertikal bewegt
    this.tiefighterPresentSinkingValue = 0; // gibt an, wie viele Pixel sich die Flotte vertikal bewegen soll, s. index.ts --> Game Settings
    this.turnAround = 1;
    this.falcon = this.object.falcon(
      play.width / 2,
      play.playBoundaries.bottom,
      this.falcon_image
    );
    // Parameter, die mit Steigendem Level geändert werden (1. Tie-Fighter Geschwindigkeit, 2. Bomben-Abwurf Geschwindigkeit, 3. Bomben-Abwurf-Frequenz)
    let presentLevel = this.level < 11 ? this.level : 10; // wir können nicht über Level 10 gehen
    // 1. Tie-Fighter Geschwindigkeit
    this.tiefighterSpeed = this.setting.tiefighterSpeed + presentLevel * 7; //Level1: 35 + (1*7) = 42, Level2: 42 + (2*7) = 59; .....
    // 2. Bomben Fall-Geschwindigkeit
    this.bombSpeed = this.setting.bombSpeed + presentLevel * 10; // Die Geschwindigkeit steigt mit dem Level an
    // 3. Bomben-Abwurf Frequenz
    this.bombFrequency = this.setting.bombFrequency + presentLevel * 0.05; // Die Abwurf-Frequenz steigt ebenfalls mit dem Level an
    // Erstellen der Tie-Fighter-Flotte
    const lines = this.setting.tiefighterLines;
    const columns = this.setting.tiefighterColumns;
    const tiefightersInitial = [];
    let line, column;
    for (line = 0; line < lines; line++) {
      for (column = 0; column < columns; column++) {
        this.object = new GameObjects(); // es werden soviele Objekte vom Typ tiefighter erstellt, wie benötigt werden um lines und columns aufzufüllen
        let x, y;
        x = play.width / 2 + column * 60 - (columns - 1) * 25;
        y = play.playBoundaries.top + 30 + line * 60;
        tiefightersInitial.push(
          this.object.tiefighter(x, y, line, column, this.tiefighter_image)
        );
      }
    }
    this.tiefighters = tiefightersInitial;
  }

  update(play: GameBasics) {
    const falcon = this.falcon;
    const falconSpeed = this.falconSpeed;
    const upSec = this.setting.updateSeconds;
    const bullets = this.bullets;
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
    // wenn die Leertaste im Status inGame gedrückt wird feuert der Falcon
    if (play.pressedKeys[32]) {
      this.shoot(play);
    }
    // Der Falcon muss im aktiven Spielfeld bleiben
    if (falcon.x < play.playBoundaries.left) {  //Begrenzung links
      falcon.x = play.playBoundaries.left;
    }
    if (falcon.x > play.playBoundaries.right) { // Begrenzung rechts
      falcon.x = play.playBoundaries.right;
    }
    // Sich bewegende Geschosse
    for (let i = 0; i < bullets.length; i++) {
      let bullet = bullets[i];
      bullet.y -= upSec * this.setting.bulletSpeed;
      // sollte die Kugel über das Canvas hinaus fliegen, verschwindet sie
      if (bullet.y < 0) { // 0 ist der obere Rand des Canvas, die Kugeln können nur in diese Richtung fliegen, deshalb nur oben beachten
        bullets.splice(i--, 1); // mit splice, werden die Bullets, die das Canvas verlassen, aus dem Array gelöscht
      }
    }
    // Bewegungen der Tie-fighter
    let reachedSide = false;
    for (let i = 0; i < this.tiefighters.length; i++) {
      let tiefighter = this.tiefighters[i];
      let fresh_x =
        tiefighter.x +
        this.tiefighterSpeed * upSec * this.turnAround * this.horizontalMoving;
      let fresh_y =
        tiefighter.y + this.tiefighterSpeed * upSec * this.verticalMoving;
      // wenn die x-Koordinate die rechte oder linke Seite des aktive Spielfelds berührt, wird die vertikale Bewegung auf 1 / true 
      // gesetzt und die horizontale auf 0 / false, also Bewegen sich die Tiefighter nun vertikal und nicht mehr horizontal
      if (
        fresh_x > play.playBoundaries.right ||
        fresh_x < play.playBoundaries.left
      ) {
        this.turnAround *= -1;
        reachedSide = true;
        this.horizontalMoving = 0;
        this.verticalMoving = 1;
        this.tiefightersAreSinking = true;
      }
      if (reachedSide !== true) {
        tiefighter.x = fresh_x;
        tiefighter.y = fresh_y;
      }
    }
    // wenn "tiefightersAreSinking" = true gesetzt wird, wird dieser Code ausgeführt 
    if (this.tiefightersAreSinking == true) {
      this.tiefighterPresentSinkingValue += this.tiefighterSpeed * upSec; //Wert (Pixel), mit dem die Flotte aktuell sinkt
      if (
        this.tiefighterPresentSinkingValue >=
        this.setting.tiefighterSinkingValue // wenn die Flotte um den Wert von 30px gesunken ist, den wir in den settings 
        // vorgegeben haben, dann wird der folgenden Code ausgeführt 
      ) {
        this.tiefightersAreSinking = false; // wird auf false gesetzt, da die Flotte sich wieder horizontal bewegen und nicht weiter sinken soll
        this.verticalMoving = 0; // false
        this.horizontalMoving = 1; // true
        this.tiefighterPresentSinkingValue = 0; // wird resettet und auf 0 reinitialisiert
      }
    }
    // TIE-Fighter Bombenabwurf
    // Die Ties werden sortiert. Hier wird gefiltert, welcher Tie Fighter zur aktuellen Zeit der letzte einer Reihe ist, da nur dieser Bomben abwerfen können soll
    const frontLineTIEs = []; // Die untersten Tie Fighter einer jeden Reihe werden in einem Array gespeichert
    for (let i = 0; i < this.tiefighters.length; i++) {
      let tiefighter = this.tiefighters[i];
      // Updaten, welcher Tie-fighter gerade tatsächlich an der letzten Stelle einer Reihe ist, indem geprüft wird ob der 
      // Line-Paramter des betrachteten Tiefighters gerade der größte, also der unterste, einer Reihe ist, dieser soll
      // nämlich die Bomben abwerfen können und wird deshalb im array gespeichert
      // es kann auch sein das kein Tiefighter mehr vorhanden ist, wenn alle einer Reihe abgeschossen wurden
      if (
        !frontLineTIEs[tiefighter.column] ||
        frontLineTIEs[tiefighter.column].line < tiefighter.line
      ) {
        frontLineTIEs[tiefighter.column] = tiefighter;
      }
    }
    // Die Möglichkeit des Bombenabwurfs wird eingeräumt
    for (let i = 0; i < this.setting.tiefighterColumns; i++) {
      let tiefighter = frontLineTIEs[i];
      if (!tiefighter) continue;
      let chance = this.bombFrequency * upSec;
      this.object = new GameObjects();
      if (chance > Math.random()) {
        // Erstellt ein Bomben-Objekt und packt es in das Bomben-Array
        this.bombs.push(
          this.object.bomb(tiefighter.x, tiefighter.y + tiefighter.height / 2)
        );
      }
    }
    //Bomben sollen sich bewegen
    for (let i = 0; i < this.bombs.length; i++) {
      let bomb = this.bombs[i];
      bomb.y += upSec * this.bombSpeed;
      //Sollte eine Bombe aus dem Canvas fallen, verschwindet sie
      if (bomb.y > play.height) {
        this.bombs.splice(i--, 1);
      }
    }
    // Tie-Abschuss Collision-Detector - verschachtelte for-Schleife
    for (let i = 0; i < this.tiefighters.length; i++) {
      let tiefighter = this.tiefighters[i];
      let collision = false;
      for (let j = 0; j < bullets.length; j++) {
        let bullet = bullets[j];
        //Kollision wird überprüft
        if (
          // Kollisionn einer Kugel mit einem Tiefighter jeweils an der linken, rechten, oberen, unteren Seite
          bullet.x >= tiefighter.x - tiefighter.width / 2 &&
          bullet.x <= tiefighter.x + tiefighter.width / 2 &&
          bullet.y >= tiefighter.y - tiefighter.height / 2 &&
          bullet.y <= tiefighter.y + tiefighter.height / 2
        ) {
          // falls eine Kollision im Raum steht, wird Kollision auf "true", löst die untere Funktion aus und die Kugel wird mit 
          // "splice" aus dem Bullet-Array gelöscht
          bullets.splice(j--, 1);
          collision = true;
          play.score += this.setting.pointsPerTIE;
        }
      }
      //wenn eine Kollision existiert, wird der Tie-fighter gelöscht
      if (collision == true) {
        this.tiefighters.splice(i--, 1);
        // Der Sound wird ausgespielt wenn ein Tie-fighter getroffen wird 
        play.sounds.playSound("tiefighterDeath");
      }
    }
    //  Falcon wird von Bombe getroffen - Collision-Detector
    for (let i = 0; i < this.bombs.length; i++) {
      let bomb = this.bombs[i];
      if (
        // Kollisionn einer Bombe mit dem Falcon jeweils an der linken, rechten, oberen, unteren Seite
        bomb.x + 1 >= falcon.x - falcon.width / 2 &&
        bomb.x - 5 <= falcon.x + falcon.width / 2 &&
        bomb.y + 90 >= falcon.y + falcon.height / 2 &&
        bomb.y <= falcon.y + falcon.height / 2
      ) {
        //Steht eine Kollision im Raum, wird die Tie-Bombe aus dem Bomben-Array gelöscht und verschwindet
        this.bombs.splice(i--, 1);
        // Der Explosions-Sound wird im Falle eines Bomben-Treffers ausgespielt 
        play.sounds.playSound("explosion");
      }
    }
    //Falcon und Tie-Fighter Kollision
    for (let i = 0; i < this.tiefighters.length; i++) {
      let tiefighter = this.tiefighters[i];
      if (
        tiefighter.x + tiefighter.width / 2 > falcon.x - falcon.width / 2 &&
        tiefighter.x - tiefighter.width / 2 < falcon.x + falcon.width / 2 &&
        tiefighter.y + tiefighter.height / 2 > falcon.y + falcon.height / 2 &&
        tiefighter.y - tiefighter.height / 2 < falcon.y + falcon.height / 2
      ) {
        // im Falle einer direkten Kollision wird ein neues Objekt vom Typ "OpeningState" erstellt und das Spiel beginnt von vorne 
        play.goToState(new OpeningState());
        // Der Explosions-Sound wrid ausgespielt, wenn der Falcon mit einem der Tie-Fighter kollidiert
        play.sounds.playSound("explosion");
      }
    }
        // Level gemeistert
        if (this.tiefighters.length == 0) {
          // alle Tie-Fighter abgeschossen! --> neues Level beginnt
          play.level += 1;
          play.goToState(new TransferState(play.level)); //über den transferState wird das nächst höhere Level initialisiert
        }


  }
  shoot(play: GameBasics) {
    if (
      (this.lastBulletTime === null || // LastBulletTime "null" bedeutet, dass noch nicht geschossen wurde
        new Date().getTime() - this.lastBulletTime >// So wird sichergestellt, dass die maxBulletFrequency nicht überschritten wird und der User
        this.setting.bulletMaxFrequency) && //nicht am Stück feuern kann, in dem kein neues Bullet-Objekt instanziert werden kann. 
      this.falcon
    ) {
      this.object = new GameObjects();
      this.bullets.push(
        this.object.bullet(
          this.falcon.x,
          this.falcon.y - this.falcon.height / 2
        )
      );
      this.lastBulletTime = new Date().getTime();
      play.sounds.playSound("shot");
    }
  }

  draw(play: GameBasics) {
    play.ctx.clearRect(0, 0, play.width, play.height);
    if (!this.falcon_image || !this.falcon || !this.tiefighter_image) {
      return;
    }
    play.ctx.drawImage(
      this.falcon_image,
      this.falcon.x - this.falcon.width / 2,
      this.falcon.y - this.falcon.height / 2
    );
    //Geschosse werden erstellt & angezeigt
    play.ctx.fillStyle = "#ff0000";
    for (let i = 0; i < this.bullets.length; i++) {
      let bullet = this.bullets[i];
      play.ctx.fillRect(bullet.x, bullet.y - 6, 2, 6);
    }
    // Tie-Fighter werden erstellt & angezeigt 
    for (let i = 0; i < this.tiefighters.length; i++) {
      let tiefighter = this.tiefighters[i]; //4 Reihen horizontal, 8 Reihen vertikal = 32 Tie-Fighters
      play.ctx.drawImage(
        this.tiefighter_image,
        tiefighter.x - tiefighter.width / 2, //hier wird wieder der Mittelpunkt des jeweiligen Tiefighter-Objekts ausgerechnet 
        tiefighter.y - tiefighter.height / 2  //als Ausgangspunkt dient in der Regel immmer die linke obere Ecke
        //,weshalb man jeweils die Hälfte von Höhe und Breite von x und y Startpunkten des Tie-Fighters abzieht, um den Mittelpunkt zu erhalten
        //Dies macht man um immer die tatsächliche Mitte als Ausgangspunkt für Kalkulationen zu haben
      );
    }
    // Tie-Fighter-Bomben erstellen
    play.ctx.fillStyle = "#7fff00";
    for (let i = 0; i < this.bombs.length; i++) {
      let bomb = this.bombs[i];
      play.ctx.fillRect(bomb.x - 2, bomb.y, 4, 6); // die Bomben werden wie die Geschosse als farbiges Rechteck dargestellt 
    }
    // Laut & Leise Info anzeigen
    play.ctx.font = "16px Comic Sans MS";
    play.ctx.fillStyle = "#BDBDBD";
    play.ctx.textAlign = "left";
    play.ctx.fillText(
      "Drücke S um Sound AN/AUS zu schalten.  Sound:",
      play.playBoundaries.left,
      play.playBoundaries.bottom + 70
    );
    let soundStatus = play.sounds.muted ? "AUS" : "AN";
    play.ctx.fillStyle = play.sounds.muted ? "#FF0000" : "#0B6121";
    play.ctx.fillText(
      soundStatus,
      play.playBoundaries.left + 375,
      play.playBoundaries.bottom + 70
    );
    play.ctx.fillStyle = "#BDBDBD";
    play.ctx.textAlign = "right";
    play.ctx.fillText(
      "Drücke P um das Spiel zu pausieren.",
      play.playBoundaries.right,
      play.playBoundaries.bottom + 70
    );
    //Dem Spieler score und level grafisch anzeigen
    play.ctx.textAlign = "center";
    play.ctx.fillStyle = "#BDBDBD";
    play.ctx.font = "bold 24px Comic Sans MS";
    play.ctx.fillText(
      "Score",
      play.playBoundaries.right,
      play.playBoundaries.top - 75
    );
    play.ctx.font = "bold 30px Comic Sans MS";
    play.ctx.fillText(
      play.score.toString(),
      play.playBoundaries.right,
      play.playBoundaries.top - 25
    );
    play.ctx.font = "bold 24px Comic Sans MS";
    play.ctx.fillText(
      "Level",
      play.playBoundaries.left,
      play.playBoundaries.top - 75
    );
    play.ctx.font = "bold 30px Comic Sans MS";
    play.ctx.fillText(
      play.level.toString(),
      play.playBoundaries.left,
      play.playBoundaries.top - 25
    );
  }
  keyDown(play: GameBasics, keyboardCode: number) {
    if (keyboardCode == 83) {
      play.sounds.mute(); // Sound muten wenn S gedrückt wird / Integer 83 steht für S auf Tastatur
    }
    if (keyboardCode == 80) {
      play.pushState(new PauseState()); // In den Pause-Bildschirm moven wenn P gedrückt wird / Integer 80 steht für P auf Tastatur
    }
  }
}