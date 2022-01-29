export class Result {
  x: number;
  y: number;
  r: number;
  hitGraph: boolean;

  constructor(x: number,
              y: number,
              r: number,
              hitGraph: boolean) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.hitGraph = hitGraph;
  }
}
