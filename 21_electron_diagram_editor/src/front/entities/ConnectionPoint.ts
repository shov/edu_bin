import * as THREE from "three";
import { IEntity, IPosition } from "../Common";
import { Input } from "../Input";
import { Rectangle } from "./Rectangle";

export class ConnectionPoint implements IPosition, IEntity {
  public static readonly RADIUS = 0.04;
  public static readonly SEGMENT_NUMBER = 8;
  public static readonly COLOR_DEFAULT = 0x000000;
  public static readonly COLOR_FOCUS = 0x0000FF;

  drawFocusHighlight: boolean = false;
  isDisplayed: boolean = false;



  constructor(
    public rectange: Rectangle,
    public scene: THREE.Scene,
    public x: number,
    public y: number,
  ) { }

  update(input: Input, camera: THREE.Camera, renderer: THREE.Renderer, entityList: IEntity[]): void {
    if (input.mouseState.focusCheck(this.rectange) || input.mouseState.focusCheck(this)) {
      this.isDisplayed = true;
    } else {
      this.isDisplayed = false;
    }

    const isHover =
      input.mouseState.x > (this.rectange.x + this.x) - ConnectionPoint.RADIUS * 2
      && input.mouseState.x < (this.rectange.x + this.x) + ConnectionPoint.RADIUS * 2
      && input.mouseState.y > (this.rectange.y + this.y) - ConnectionPoint.RADIUS * 2
      && input.mouseState.y < (this.rectange.y + this.y) + ConnectionPoint.RADIUS * 2;

    if (isHover && this.isDisplayed) {
      input.mouseState.focusSet(this);
    }

    if (!isHover && input.mouseState.focusCheck(this)) {
      input.mouseState.focusClear(ConnectionPoint);
    }

    this.drawFocusHighlight = input.mouseState.focusCheck(this);
  }

  render(input: Input, camera: THREE.Camera, renderer: THREE.Renderer): void {
    // render three js circle with radius 0.1
    if (!this.isDisplayed) {
      return;
    }

    const geometry = new THREE.CircleGeometry(ConnectionPoint.RADIUS, ConnectionPoint.SEGMENT_NUMBER);
    const material = new THREE.MeshBasicMaterial({ color: this.drawFocusHighlight ? ConnectionPoint.COLOR_FOCUS : ConnectionPoint.COLOR_DEFAULT });
    const circle = new THREE.Mesh(geometry, material);
    circle.position.x = this.rectange.x + this.x;
    circle.position.y = this.rectange.y + this.y;

    this.scene.add(circle);
  }




}