import { Input } from './Input';

export interface IEntity {
  update(input: Input, camera: THREE.Camera, renderer: THREE.Renderer, entityList: IEntity[]): void;
  render(input: Input, camera: THREE.Camera, renderer: THREE.Renderer): void;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface ISimpleSize {
  width: number;
  height: number;
}