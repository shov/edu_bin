import { Renderer } from "three";
import { IEntity } from "./Common";
import { Input } from "./Input";
import { Rectangle } from "./entities/Rectangle";


export class CameraController implements IEntity {
  mouseClickedAt?: { x: number, y: number } = void 0;
  update(input: Input, camera: THREE.Camera, _: Renderer, entityList: IEntity[]): void {
    if(input.mouseState.leftButton && !this.mouseClickedAt) {
      this.mouseClickedAt = { x: input.mouseState.x, y: input.mouseState.y };
    }
    if(!input.mouseState.leftButton) {
      this.mouseClickedAt = void 0;
    }

    if(this.mouseClickedAt && !input.mouseState.focusGroupCheck(Rectangle)) {
      input.mouseState.focusSet(this);

      const deltaX = input.mouseState.x - this.mouseClickedAt.x;
      const deltaY = input.mouseState.y - this.mouseClickedAt.y;

      camera.position.x -= deltaX;
      camera.position.y -= deltaY;

      this.mouseClickedAt = { x: input.mouseState.x, y: input.mouseState.y };
    }

    if(!input.mouseState.leftButton && input.mouseState.focusGroupCheck(CameraController)) {
      input.mouseState.focusClear(CameraController);
    }
  }
  render(): void {
    
  }
}