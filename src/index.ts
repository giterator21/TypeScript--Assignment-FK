import { InGameState } from "./stateInGame";
import { OpeningState } from "./stateOpening";
import { TransferState } from "./stateTransfer";

// Hier wird auf das Canvas "gameCanvas" aus der CSS-Datei über "getElementById" in TypeScript zugegriffen
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
canvas.width = 900;
canvas.height = 750;
const ctx = canvas.getContext("2d");

if (!ctx) {
    throw new Error("cannot initialize canvas 2d");
}


//Funktion für Automatische Größen-Anpassung des Canvas
function resize() {
    // Das Canvas muss unabhängig von der Auflösung die volle Bildschirmhöhe abdecken
    const height = window.innerHeight - 20; //inner height muss um 20px verringert werden, weil hier die Scroll-Bar (20px) inkludiert ist

    // Berechnen der Breite mit der richtigen Skalierung, um das Spielfeld in jeder Auflösung richtig darstellen zu könnnen
    const ratio = canvas.width / canvas.height;
    const width = height * ratio;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
}
window.addEventListener("load", resize, false); //Immer wenn das Fenster neu geladen wird, wird die resize-Funktion aufgerufen
//Hierzu brauchen wir einen EventListener, der prüft ob das Fenster verändert wird und dann die Funktion called

// Game Basics Funktion - In dieser Funktion werden die Grundlagen des Spiels definiert

interface Boundaries {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface GameSettings {
    updateSeconds: number;
    falconSpeed: number;
    bulletSpeed: number; 
    bulletMaxFrequency: number;
}

type State =
    | TransferState
    | InGameState
    | OpeningState;

export class GameBasics {
    public canvas: HTMLCanvasElement;
    public width: number;
    public height: number;
    public playBoundaries: Boundaries;
    public setting: GameSettings;
    public stateContainer: State[];
    public level: number;
    public score: number;
    public shields: number;
    public pressedKeys: { [key: number]: boolean };

    constructor(canvas: HTMLCanvasElement, public ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;

        //aktives Spielfeld, das von unseren Objekten befüllt werden kann. Es wird nicht das ganze Canvas verwendet, das sieht komisch aus!
        this.playBoundaries = {
            top: 150, // oberer Abstand vom oberen Rand des Canvas 
            bottom: 650, // unterer Abstand vom oberen Rand des Canvas
            left: 100, // linker Abstand vom Linken Rand des Canvas 
            right: 800, // rechter Abstand vom linken Rand des Canvas
        };
        // Anfangswerte, zu Beginn des Spiels 
        this.level = 1; // Das Anfanglevel ist 1 
        this.score = 0; // Der Score startet bei Null 
        this.shields = 2; // Der Falcon hat zwei Schilde, kann also insgesamt 3 Treffer verkraften

        //Standardeinstellungen des Spiels 
        this.setting = {
            updateSeconds: 1 / 60, // 60 FPS
            falconSpeed:200,
            bulletSpeed:130, // Geschwindigkeit der Kugel
            bulletMaxFrequency:500, // wie schnell der Falcon nacheinander feuern kann
        };
        // Hier wird der aktuelle Zustand des Spiels zwischengespeichert (Pause, Start, inGame etc.)
        this.stateContainer = [];
         // Zwischenspeicher für gedrückte Tasten innerhalb eines "{}" abstrakten Datentyps, Tasten werden als Integer gespeichert
         this.pressedKeys = {};

    }
    

    //  Gibt den aktuellen Status des Spiels wieder, in dem sich das Spiel gerade befindet. Gibt immer den obersten Wert aus dem stateContainer als return-Wert zurück.
    presentState() {
        return this.stateContainer.length > 0
            ? this.stateContainer[this.stateContainer.length - 1] // -1 weil Array nullbasiert ist // wenn die stateContainer length
            //größer als 0 ist, heißt das, dass der Container nicht leer ist und ein aktueller Status vorhanden ist, dieser soll als return-Wert zurückgegeben werden
            : null; // sollte der Container leer sein, wird "null" als return-Wert zurückgegeben
    }

    // Das Spiel in den gewünschten Zustand versetzen
    goToState(state: State) {
        // Sollten das Spiel bereits in einen Status versetzt sein, dann kann der StateContainer gelöscht werden.
        if (this.presentState()) {
            this.stateContainer.length = 0;
        }
        // Wenn wir ein "entry" in einem Status finden, wird das Spiel in den zugehörigen Status versetzt.
        if (state instanceof InGameState) {
            state.entry(play); // muss noch in inGame geschrieben werden!!!
        }
        // Der aktuelle Status, der aufgerufen wird, wird über eine push-Methode in den stateContainer (Array) gepushed
        this.stateContainer.push(state);
    }

    // Push-Methode
    pushState(state: State) {
        this.stateContainer.push(state);
    }

    // Pop-Methode
    popState() {
        this.stateContainer.pop();
    }

    start() {

        setInterval(function () {
            gameLoop(play);
        }, this.setting.updateSeconds * 1000);
        // Wir wollen die GameLoop Funktion alles 16 Millisekunden aufrufen und anschließend in den OpeningState wechseln
        this.goToState(new OpeningState());
    }

    
  // Sagt dem Spiel, dass eine Taste gedrückt ist
  keyDown(keyboardCode: number) {
    // speichert die gedrückte Taste in "pressed Keys" zwischen
    this.pressedKeys[keyboardCode] = true;
    //es wird geprüft, ob der akutelle Status des Spiels eine eigene keyDown/keyUp-Funktion hat und ruft diese im Falle des Tastendrückens auf
    let pos = this.presentState();
    if (
      pos &&
      (pos instanceof InGameState ||
        pos instanceof OpeningState)
    ) {
      pos.keyDown(this, keyboardCode);
    }
  }

    // Sagt dem Spiel, wenn eine Taste wieder losgelassen wird
    keyUp(keyboardCode: number) {
        //die losgelassene Taste aus "pressedKeys" löschen
        delete this.pressedKeys[keyboardCode];
      }

}

function gameLoop(play: GameBasics) {
    let presentState = play.presentState();

    if (presentState) {
        //Die Position der Objekte wird geupdatet, je nachdem in welchem Status sich das Spiel aktuell befindet
        if (
            presentState instanceof InGameState ||
            presentState instanceof TransferState
        ) {
            presentState.update(play); // muss noch in inGame geschrieben werden!!!
        }
        //Die Objekte werden mit einer draw-Funktion auf dem Canvas dargestellt
        if (presentState.draw) { // muss noch in Transfer geschrieben werden!!!
            presentState.draw(play);
        }
    }
}

//Event Listener für keyUp und keyDown in Abhängigkeit der gedrückten Tasten und je nach Browser-Support

window.addEventListener("keydown", (e: KeyboardEvent) => {
    const keyboardCode = e.which || e.keyCode; // Je nach Browsersupport wird "which" oder "keyCode" verwendet
    if (keyboardCode == 37 || keyboardCode == 39 || keyboardCode == 32) {
      e.preventDefault();
    } //Leertaste/Links/Rechts// (32/37/29) KeyboardCode wird als Datentyp Integer zwischengespeichert
    play.keyDown(keyboardCode);
  });
  
  window.addEventListener("keyup", function (e) {
    const keyboardCode = e.which || e.keyCode; 
    play.keyUp(keyboardCode);
  });
  

const play = new GameBasics(canvas, ctx);

play.start();
