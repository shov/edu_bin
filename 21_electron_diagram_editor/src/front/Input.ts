import { IEntity } from "./Common";
import { Rectangle } from "./entities/Rectangle";

export class Input {
  mouseState: { x: number, y: number, leftButton: boolean, rightButton: boolean, focus: Set<any> } = 
    { x: 0, y: 0, leftButton: false, rightButton: false, focus: new Set() };

  
  constructor(
    private entityList: IEntity[],
    private scene: THREE.Scene,
    private camera: THREE.Camera,
    ) {}

  init(): void {

    document.addEventListener('mousemove', (event) => {
      const { clientX, clientY } = event;
      this.mouseState.x = clientX;
      this.mouseState.y = clientY;
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
      if(event.button === 0) {
        // create new Rectangle 1x1 middle around the mouse position
        // calculate the position of the rectangle give the camera position, the screen mouse position and the screen size
        const x = (this.mouseState.x - window.innerWidth / 2) * 0.01 + this.camera.position.x;
        const y = (window.innerHeight / 2 - this.mouseState.y) * 0.01 + this.camera.position.y;
        this.entityList.push(new Rectangle(this.scene, x, y, 1, 1));
      }
    });
  }
}