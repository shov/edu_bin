import * as THREE from "three";
import { IEntity, IPosition } from "../Common";
import { ESupportedEventType, Input } from "../Input";
import { Rectangle } from "./Rectangle";
import { Curve } from "./Curve";

export type TConnectionPointCurveDict = {
  start: Set<Curve>,
  end: Set<Curve>,
}
export class ConnectionPoint implements IPosition, IEntity {
  public static readonly RADIUS = 0.05;
  public static readonly SEGMENT_NUMBER = 8;
  public static readonly COLOR_DEFAULT = 0x000000;
  public static readonly COLOR_FOCUS = 0x0000FF;

  drawFocusHighlight: boolean = false;
  isDisplayed: boolean = false;

  curveDict: TConnectionPointCurveDict = {
    start: new Set(),
    end: new Set(),
  }



  constructor(
    public rectangle: Rectangle,
    public scene: THREE.Scene,
    public x: number,
    public y: number,
  ) { 
    this.rectangle.input.eventPool.addEventListener(ESupportedEventType.MOUSEDOWN, this.onMouseDown.bind(this));
    this.rectangle.input.eventPool.addEventListener(ESupportedEventType.MOUSEUP, this.onMouseUp.bind(this));
  }

  update(input: Input, camera: THREE.Camera, renderer: THREE.Renderer, entityList: IEntity[]): void {
    if (input.mouseState.focusCheck(this.rectangle) || input.mouseState.focusCheck(this)) {
      this.isDisplayed = true;
    } else {
      this.isDisplayed = false;
    }

    const isHover =
      input.mouseState.x > (this.rectangle.x + this.x) - ConnectionPoint.RADIUS * 2
      && input.mouseState.x < (this.rectangle.x + this.x) + ConnectionPoint.RADIUS * 2
      && input.mouseState.y > (this.rectangle.y + this.y) - ConnectionPoint.RADIUS * 2
      && input.mouseState.y < (this.rectangle.y + this.y) + ConnectionPoint.RADIUS * 2;

    if (isHover && this.isDisplayed && !input.mouseState.focusCheck(this)) {
      input.mouseState.focusSet(this);
      input.renderUnlockedStack.inc();
    }

    if (!isHover && input.mouseState.focusCheck(this)) {
      input.mouseState.focusClear(ConnectionPoint);
      input.renderUnlockedStack.dec();
    }

    this.drawFocusHighlight = input.mouseState.focusCheck(this);

    this.curveDict.start.forEach((curve) => {
      curve.start = { x: this.rectangle.x + this.x, y: this.rectangle.y + this.y };
      curve.update(input, camera, renderer, entityList);
    });
    this.curveDict.end.forEach((curve) => {
      curve.end = { x: this.rectangle.x + this.x, y: this.rectangle.y + this.y };
      curve.update(input, camera, renderer, entityList);
    });
  }

  render(input: Input, camera: THREE.Camera, renderer: THREE.Renderer): void {
    // render three js circle with radius 0.1
    if (!this.isDisplayed) {
      return;
    }

    const geometry = new THREE.CircleGeometry(ConnectionPoint.RADIUS, ConnectionPoint.SEGMENT_NUMBER);
    const material = new THREE.MeshBasicMaterial({ color: this.drawFocusHighlight ? ConnectionPoint.COLOR_FOCUS : ConnectionPoint.COLOR_DEFAULT });
    const circle = new THREE.Mesh(geometry, material);
    circle.position.x = this.rectangle.x + this.x;
    circle.position.y = this.rectangle.y + this.y;

    this.curveDict.start.forEach((curve) => {
      curve.render(input, camera, renderer);
    });
    this.curveDict.end.forEach((curve) => {
      curve.render(input, camera, renderer);
    });
    this.scene.add(circle);
  }

  onMouseDown(): void {
    if(this.rectangle.input.mouseState.focusCheck(this) && !this.rectangle.input.mouseState.focusGroupCheck(Curve)) {
      const curve = new Curve(this.rectangle.input, this.scene, this, void 0, {x: this.x, y: this.y}, {x: this.rectangle.input.mouseState.x, y: this.rectangle.input.mouseState.y});
      this.curveDict.start.add(curve);
      this.rectangle.input.renderUnlockedStack.inc();
      this.rectangle.input.mouseState.focusSet(curve);
      this.rectangle.input.mouseState.focusClear(ConnectionPoint);
    }
  }

  onMouseUp(): void {

  }
}