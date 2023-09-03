export interface IVector2 {
  x: number;
  y: number;
}

export class Vector2 implements IVector2 {
  constructor(public x: number, public y: number) {
  }
}