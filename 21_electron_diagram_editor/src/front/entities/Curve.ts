import { Camera, Renderer } from "three";
import { IEntity, IPosition } from "../Common";
import { ESupportedEventType, Input } from "../Input";
import * as THREE from 'three';
import { ConnectionPoint } from "./ConnectionPoint";

export class Curve implements IEntity {

  listenerDict = {
    onMouseDown: this.onMouseDown.bind(this),
    onMouseUp: this.onMouseUp.bind(this),
    onMouseMove: this.onMouseMove.bind(this),
  }

  constructor(
    public input: Input,
    public scene: THREE.Scene,
    public startConnectionPoint: ConnectionPoint,
    public endConnectionPoint: ConnectionPoint | undefined = void 0,
    public start: IPosition,
    public end: IPosition,
  ) {
    this.input.eventPool.addEventListener(ESupportedEventType.MOUSEDOWN, this.listenerDict.onMouseDown);
    this.input.eventPool.addEventListener(ESupportedEventType.MOUSEUP, this.listenerDict.onMouseUp);
    this.input.eventPool.addEventListener(ESupportedEventType.MOUSEMOVE, this.listenerDict.onMouseMove);
  }

  update(input: Input, camera: Camera, renderer: Renderer, entityList: IEntity[]): void {

  }
  render(input: Input, camera: Camera, renderer: Renderer): void {
    const isRightSide = this.start.x <= this.end.x;
    const isUpSide = this.start.y <= this.end.y;
    const C = 0.1;
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(this.start.x, this.start.y),
      // point in geometry middle
      //new THREE.Vector2(this.start.x + (this.end.x - this.start.x) / 2, this.start.y + (this.end.y - this.start.y) / 2),
       new THREE.Vector2( this.start.x + (isRightSide ? 2*C : - 2*C ), this.start.y + (isUpSide ? C : - C) ), 
         new THREE.Vector2( this.end.x + (isRightSide ? -2*C : 2*C), this.end.y + (isUpSide ? -C : C)),
      new THREE.Vector2(this.end.x, this.end.y),
    ]);

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0x000000 });

    const splineObject = new THREE.Line(geometry, material);
    this.scene.add(splineObject);
  }

  onMouseDown(): void {

  }

  onMouseUp(): void {
    if (this.input.mouseState.focusCheck(this) && this.input.mouseState.focusGroupCheck(ConnectionPoint)) {
      const connectionPointList = this.input.mouseState.focus.get(ConnectionPoint);
      if (Array.isArray(connectionPointList) && connectionPointList.length > 0) {
        const connectionPoint: ConnectionPoint = connectionPointList[0];

        if(this.startConnectionPoint === connectionPoint) {
          this.seflDestruct();
          return;
        }

        this.end = { x: connectionPoint.x, y: connectionPoint.y };
        connectionPoint.curveDict.end.add(this);
        this.input.mouseState.focusClear(Curve);
        this.input.renderUnlockedStack.dec();
      }
    }
    if (this.input.mouseState.focusCheck(this) && !this.input.mouseState.focusGroupCheck(ConnectionPoint)) {
      this.seflDestruct();
    }
  }

  onMouseMove(): void {
    if (this.input.mouseState.focusCheck(this)) {
      this.end = { x: this.input.mouseState.x, y: this.input.mouseState.y };
    }
  }

  seflDestruct(): void {
    this.input.mouseState.focusClear(Curve);
    this.startConnectionPoint.curveDict.start.delete(this);

    this.input.eventPool.removeEventListener(ESupportedEventType.MOUSEMOVE, this.listenerDict.onMouseMove);
    this.input.eventPool.removeEventListener(ESupportedEventType.MOUSEDOWN, this.listenerDict.onMouseDown);
    this.input.eventPool.removeEventListener(ESupportedEventType.MOUSEUP, this.listenerDict.onMouseUp);

    this.input.renderUnlockedStack.dec();
  }

}