// Hier wird auf das Canvas "gameCanvas" aus der CSS-Datei über "getElementById" in TypeScript zugegriffen
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
canvas.width = 900;
canvas.height = 750;

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

interface GameSettings {
    updateSeconds: number;
}

class GameBasics {
    public canvas: HTMLCanvasElement;
    public width: number;
    public height: number;
    public playBoundaries: Boundaries;
    public setting: any;
    public stateContainer: any;


    constructor(canvas: HTMLCanvasElement) {
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

        //Standardeinstellungen des Spiels 
        this.setting = {
            updateSeconds: 1 / 60, // 60 FPS
        };
        // Hier wird der aktuelle Zustand des Spiels zwischengespeichert (Pause, Start, inGame etc.)
        this.stateContainer = [];
    }

    //  Gibt den aktuellen Status des Spiels wieder, in dem sich das Spiel gerade befindet. Gibt immer den obersten Wert aus dem stateContainer als return-Wert zurück.
    presentState() {
        return this.stateContainer.length > 0
            ? this.stateContainer[this.stateContainer.length - 1] // -1 weil Array nullbasiert ist // wenn die stateContainer length
            //größer als 0 ist, heißt das, dass der Container nicht leer ist und ein aktueller Status vorhanden ist, dieser soll als return-Wert zurückgegeben werden
            : null; // sollte der Container leer sein, wird "null" als return-Wert zurückgegeben
    }

    // Das Spiel in den gewünschten Zustand versetzen
    goToState(state: any) {
        // Sollten das Spiel bereits in einen Status versetzt sein, dann kann der StateContainer gelöscht werden.
        if (this.presentState()) {
            this.stateContainer.length = 0;
        }
        // Wenn wir ein "entry" in einem Status finden, wird das Spiel in den zugehörigen Status versetzt.
        if (state instanceof InGameState) {
            state.entry(play);
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

}

function gameLoop(play: GameBasics) {
    let presentState = play.presentState();

    if (presentState) {
        //Die Position der Objekte wird geupdatet, je nachdem in welchem Status sich das Spiel aktuell befindet
        if (
            presentState instanceof InGameState ||
            presentState instanceof TransferState
        ) {
            presentState.update(play);
        }
        //Die Objekte werden mit einer draw-Funktion auf dem Canvas dargestellt
        if (presentState.draw) {
            presentState.draw(play);
        }
    }
}

const play = new GameBasics(canvas);

play.start();
