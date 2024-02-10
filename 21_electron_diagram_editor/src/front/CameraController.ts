import { Curve, Renderer } from "three";
import { IEntity } from "./Common";
import { Input } from "./Input";
import { Rectangle } from "./entities/Rectangle";
import { ConnectionPoint } from "./entities/ConnectionPoint";


export class CameraController implements IEntity {
  mouseClickedAt?: { x: number, y: number } = void 0;

  update(input: Input, camera: THREE.Camera, _: Renderer, entityList: IEntity[]): void {
    if (input.mouseState.leftButton && !this.mouseClickedAt) {
      this.mouseClickedAt = { x: input.mouseState.x, y: input.mouseState.y };
    }
    if (!input.mouseState.leftButton) {
      this.mouseClickedAt = void 0;
    }

    if
      (this.mouseClickedAt
      && !input.mouseState.focusGroupCheck(Rectangle)
      && !input.mouseState.focusGroupCheck(Curve)
      && !input.mouseState.focusGroupCheck(ConnectionPoint)
    ) {
      if (!input.mouseState.focusCheck(this)) {
        input.mouseState.focusSet(this);
        input.renderUnlockedStack.inc();
      }

      const deltaX = input.mouseState.x - this.mouseClickedAt.x;
      const deltaY = input.mouseState.y - this.mouseClickedAt.y;

      camera.position.x -= deltaX;
      camera.position.y -= deltaY;

      this.mouseClickedAt = { x: input.mouseState.x, y: input.mouseState.y };
    }

    if (!input.mouseState.leftButton && input.mouseState.focusGroupCheck(CameraController)) {
      input.mouseState.focusClear(CameraController);
      input.renderUnlockedStack.dec();
    }
  }
  render(): void {

  }
}