import * as THREE from 'three';
import { Input } from '../Input';
import { IPosition, IEntity, ISimpleSize } from '../Common';

export class Rectangle implements IPosition, IEntity, ISimpleSize {
 
  mouseClickedAt?: { x: number, y: number } = void 0;

  pointList: THREE.Vector3[] = [];
  geometry?: THREE.BufferGeometry;
  material?: THREE.Material;
  rectangleLine?: THREE.Line;

 
  constructor(
    public scene: THREE.Scene, 
    public x: number = 1, 
    public y: number = 1, 
    public width: number = 1,
    public height: number = 1,
    ) {
  }

  update(input: Input, camera: THREE.Camera): void {
    this.pointList = [
      new THREE.Vector3(this.x, this.y, 0),
      new THREE.Vector3(this.x + this.width, this.y, 0),
      new THREE.Vector3(this.x + this.width, this.y + this.height, 0),
      new THREE.Vector3(this.x, this.y + this.height, 0),
      new THREE.Vector3(this.x, this.y, 0),
    ]

    this.geometry = new THREE.BufferGeometry().setFromPoints(this.pointList);
    this.material = new THREE.LineBasicMaterial({ color: 0x000000 });
    this.rectangleLine = new THREE.Line(this.geometry, this.material);

    const mouseXToSceneX = (input.mouseState.x - window.innerWidth / 2) * 0.01 + camera.position.x;
    const mouseYToSceneY = (window.innerHeight / 2 - input.mouseState.y) * 0.01 + camera.position.y;
    
    // hover
    const mouseHover = mouseXToSceneX > this.x && mouseXToSceneX < this.x + this.width && mouseYToSceneY > this.y && mouseYToSceneY < this.y + this.height;
    if(mouseHover) {
      this.material = new THREE.LineBasicMaterial({ color: 0x0000BB });
      this.rectangleLine = new THREE.Line(this.geometry, this.material);
    }

    // in focus
    if(input.mouseState.leftButton && !input.mouseState.focus.has(this)) {
      this.mouseClickedAt = { x: input.mouseState.x, y: input.mouseState.y };
      // if mouse clicked in the rectangle, then add it to focus
      
      if(mouseHover) {
        input.mouseState.focus.add(this);
      } else {
        this.mouseClickedAt = void 0;
      }
    }
    if(!input.mouseState.leftButton && input.mouseState.focus.has(this)) {
      input.mouseState.focus.delete(this);
      this.mouseClickedAt = void 0;
    }

    // move
    if(this.mouseClickedAt && input.mouseState.focus.has(this)) {
      const deltaX = input.mouseState.x - this.mouseClickedAt.x;
      const deltaY = input.mouseState.y - this.mouseClickedAt.y;

      this.x += deltaX * 0.01;
      this.y -= deltaY * 0.01;

      this.mouseClickedAt = { x: input.mouseState.x, y: input.mouseState.y };
    }
  }
  render(): void {
    this.scene.add(this.rectangleLine!);
  }
}