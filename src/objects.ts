/// --- objects --- ///

export interface Falcon {
    x: number;
    y: number;
    width: number;
    height: number;
    falcon_image: HTMLImageElement;
  }

export class Objects {
    constructor() {}
  
    falcon(x: number, y: number, falcon_image: HTMLImageElement): Falcon { // mit ": Falcon" wird aufs Interface referenziert
      falcon_image.src = "images/falcon.png";
      return { x, y, width: 64, height: 91, falcon_image };
    }
}