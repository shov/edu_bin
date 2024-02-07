import { Renderer } from "three";
import { IEntity } from "./Common";
import { Input } from "./Input";


export class CameraController implements IEntity {
  mouseClickedAt?: { x: number, y: number } = void 0;
  update(input: Input, camera: THREE.Camera, _: Renderer, entityList: IEntity[]): void {
    if(input.mouseState.leftButton && !this.mouseClickedAt) {
      this.mouseClickedAt = { x: input.mouseState.x, y: input.mouseState.y };
    }
    if(!input.mouseState.leftButton) {
      this.mouseClickedAt = void 0;
    }

    if(this.mouseClickedAt && input.mouseState.focus.size === 0) {
      const deltaX = input.mouseState.x - this.mouseClickedAt.x;
      const deltaY = input.mouseState.y - this.mouseClickedAt.y;

      camera.position.x -= deltaX * 0.01;
      camera.position.y += deltaY * 0.01;

      this.mouseClickedAt = { x: input.mouseState.x, y: input.mouseState.y };
    }
  }
  render(): void {
    
  }
}