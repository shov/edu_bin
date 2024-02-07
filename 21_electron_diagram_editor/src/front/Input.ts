import { CameraController } from "./CameraController";
import { IEntity } from "./Common";
import { Rectangle } from "./entities/Rectangle";
import * as THREE from 'three';

export type TMouseState = {
  x: number,
  y: number,
  leftButton: boolean,
  rightButton: boolean,
  focus: Map<Function, IEntity>,
  focusCheck: (entity: IEntity) => boolean,
  focusGroupCheck: (t: Function) => boolean,
  focusSet: (entity: IEntity) => void,
  focusClear: (t: Function) => void,
}

//export type TEventListenerMap = Map<eventName>

export class Input {
  mouseState: TMouseState =
    {
      x: 0,
      y: 0,
      leftButton: false,
      rightButton: false,
      focus: new Map(),
      focusCheck(entity: IEntity) {
        return this.focus.has(entity.constructor) && this.focus.get(entity.constructor) === entity;
      },
      focusGroupCheck(t: Function) {
        return this.focus.has(t);
      },
      focusSet(entity: IEntity) {
        this.focus.set(entity.constructor, entity);
      },
      focusClear(t: Function) {
        this.focus.delete(t);
      },
    };


  constructor(
    private entityList: IEntity[],
    private scene: THREE.Scene,
    private camera: THREE.Camera,
  ) { }

  init(): void {

    document.addEventListener('mousemove', (event) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      // Calculate normalized device coordinates (-1 to +1) for mouse position
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, this.camera);

      // Define the z-flat you want to intersect with
      const zFlat = 0; // Change this to your desired z-flat

      // Create a plane at the desired z-flat
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), zFlat);

      // Intersect the ray with the plane
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);

      // The intersection point contains the mouse coordinates on the z-flat
      this.mouseState.x = intersection.x;
      this.mouseState.y = intersection.y;
    });

    // Track mouse down
    document.addEventListener('mousedown', (event) => {
      this.mouseState.leftButton = event.button === 0;
      this.mouseState.rightButton = event.button === 2;
    });

    // Track mouse up
    document.addEventListener('mouseup', (event) => {
      this.mouseState.leftButton = event.button !== 0;
      this.mouseState.rightButton = event.button !== 2;
    });

    // double left click
    document.addEventListener('dblclick', (event) => {
      // if left button is double clicked
      if (event.button === 0 && !this.mouseState.focusGroupCheck(Rectangle)){
        this.entityList.push(Rectangle.createDefault(this.scene, this.mouseState.x, this.mouseState.y));
      }
    });
  }
}