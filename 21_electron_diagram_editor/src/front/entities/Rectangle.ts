import * as THREE from 'three';
import { ESupportedEventType, Input } from '../Input';
import { IPosition, IEntity, ISimpleSize } from '../Common';
import { CameraController } from '../CameraController';
import { ConnectionPoint } from './ConnectionPoint';
import { Curve } from './Curve';

export class Rectangle implements IPosition, IEntity, ISimpleSize {

  public static readonly DEFAULT_WIDTH = 2.5;
  public static readonly DEFAULT_HEIGHT = 1.8;

  public static createDefault(scene: THREE.Scene, input: Input, entityList: IEntity[], x: number, y: number): Rectangle {
    return new Rectangle(scene, input, entityList, x - Rectangle.DEFAULT_WIDTH / 2, y - Rectangle.DEFAULT_HEIGHT / 2, Rectangle.DEFAULT_WIDTH, Rectangle.DEFAULT_HEIGHT);
  }

  mouseClickedAt?: { x: number, y: number } = void 0;

  drawFocusHighlight: boolean = false;

  connectionPointList: ConnectionPoint[] = [];

  constructor(
    public scene: THREE.Scene,
    public input: Input,
    public entityList: IEntity[],
    public x: number = 1,
    public y: number = 1,
    public width: number = 1,
    public height: number = 1,
  ) {
    this.connectionPointList.push(new ConnectionPoint(this, scene, width / 2, 0));
    this.connectionPointList.push(new ConnectionPoint(this, scene, width / 2, height));
    this.connectionPointList.push(new ConnectionPoint(this, scene, 0, height / 2));
    this.connectionPointList.push(new ConnectionPoint(this, scene, width, height / 2));

    this.input.eventPool.addEventListener(ESupportedEventType.DBLCLICK, this.onDoubleClick.bind(this));
  }

  update(input: Input, camera: THREE.Camera, render: THREE.Renderer, entityList: IEntity[]): void {
    // hover focus
    const mouseHover = input.mouseState.x > this.x && input.mouseState.x < this.x + this.width && input.mouseState.y > this.y && input.mouseState.y < this.y + this.height;
    if (mouseHover && !input.mouseState.focusGroupCheck(Rectangle) && !input.mouseState.focusGroupCheck(CameraController)) {
      input.mouseState.focusSet(this);
      input.renderUnlockedStack.inc();
    }
    if (!mouseHover && !input.mouseState.leftButton && input.mouseState.focusCheck(this)) {
      input.mouseState.focusClear(Rectangle);
      input.renderUnlockedStack.dec();
    }

    this.drawFocusHighlight = false;
    if (input.mouseState.focusCheck(this)) {
      this.drawFocusHighlight = true;
    }

    // drag
    const onDrag = 
      input.mouseState.leftButton 
      && input.mouseState.focusCheck(this) 
      && !input.mouseState.focusGroupCheck(ConnectionPoint)
      && !input.mouseState.focusGroupCheck(Curve);
      
    if (onDrag && !this.mouseClickedAt) {
      this.mouseClickedAt = { x: input.mouseState.x, y: input.mouseState.y };
    }
    if (!onDrag) {
      this.mouseClickedAt = void 0;
    }
    if (onDrag && this.mouseClickedAt) {
      const deltaX = input.mouseState.x - this.mouseClickedAt.x;
      const deltaY = input.mouseState.y - this.mouseClickedAt.y;

      this.x += deltaX;
      this.y += deltaY;

      this.mouseClickedAt = { x: input.mouseState.x, y: input.mouseState.y };
    }

    // connection points
    this.connectionPointList.forEach((connectionPoint) => {
      connectionPoint.update(input, camera, render, entityList);
    });
  }
  render(input: Input, camera: THREE.Camera, render: THREE.Renderer): void {

    const fillRectGeometry = new THREE.PlaneGeometry(this.width, this.height);
    const fillRectMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const rectangle = new THREE.Mesh(fillRectGeometry, fillRectMaterial);
    rectangle.position.x = this.x + this.width / 2;
    rectangle.position.y = this.y + this.height / 2;

    const pointList = [
      new THREE.Vector3(this.x, this.y, 0),
      new THREE.Vector3(this.x + this.width, this.y, 0),
      new THREE.Vector3(this.x + this.width, this.y + this.height, 0),
      new THREE.Vector3(this.x, this.y + this.height, 0),
      new THREE.Vector3(this.x, this.y, 0),
    ]

    const geometry = new THREE.BufferGeometry().setFromPoints(pointList);
    let material = new THREE.LineBasicMaterial({ color: 0x000000, });
    let rectangleLine = new THREE.Line(geometry, material);

    if (this.drawFocusHighlight) {
      material = new THREE.LineBasicMaterial({ color: 0x0000BB });
      rectangleLine = new THREE.Line(geometry, material);
    }

    this.scene.add(rectangle);
    this.scene.add(rectangleLine!);

    this.connectionPointList.forEach((connectionPoint) => {
      connectionPoint.render(input, camera, render);
    });
  }

  onDoubleClick(event: Event) {
    // if left button is double clicked
    if ((event as MouseEvent).button === 0 && !this.input.mouseState.focusGroupCheck(Rectangle)) {
      this.entityList.push(Rectangle.createDefault(this.scene, this.input, this.entityList, this.input.mouseState.x, this.input.mouseState.y));
    }
  }
}