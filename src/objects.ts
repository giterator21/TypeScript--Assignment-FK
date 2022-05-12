/// --- objects --- ///

export interface Falcon {
    x: number;
    y: number;
    width: number;
    height: number;
    falcon_image: HTMLImageElement;
  }

  export interface Bullet {
    x: number;
    y: number;
  }

  export interface Tiefighter {
    x: number;
    y: number;
    width: number;
    height: number;
    line: number;
    column: number;
    tiefighter_image: HTMLImageElement;
  }

export class Objects {
    constructor() {}
  
    falcon(x: number, y: number, falcon_image: HTMLImageElement): Falcon { // mit ": Falcon" wird aufs Interface referenziert
      falcon_image.src = "images/falcon.png";
      return { x, y, width: 64, height: 91, falcon_image };
    }
    bullet(x: number, y: number): Bullet {
      return { x, y };
    }
    tiefighter(
      x: number,
      y: number,
      line: number,
      column: number,
      tiefighter_image: HTMLImageElement
    ): Tiefighter {
      tiefighter_image.src = "images/tie-fighter.png";
      return { x, y, line, width: 62, height: 66, column, tiefighter_image };
    }
}