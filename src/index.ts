// Hier wird auf das Canvas "gameCanvas" aus der CSS-Datei über "getElementById" in TypeScript zugegriffen
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
canvas.width = 900;
canvas.height = 750;

//Funktion für Automatische Größen-Anpassung des Canvas
function resize() {
    // Das Canvas muss unabhängig von der Auflösung die volle Bildschirmhöhe abdecken
    const height = window.innerHeight - 20; //inner hight muss um 20px verringert werden, weil hier die Scroll-Bar (20px) inkludiert ist
  
    // Berechnen der Breite mit der richtigen Skalierung, um das Spielfeld in jeder Auflösung richtig darstellen zu könnnen
    const ratio = canvas.width / canvas.height;
    const width = height * ratio;
  
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
  }
  window.addEventListener("load", resize, false); //Immer wenn das Fenster neu geladen wird, wird die resize-Funktion aufgerufen
  //Hierzu brauchen wir einen EventListener, der prüft ob das Fenster verändert wird und dann die Funktion called