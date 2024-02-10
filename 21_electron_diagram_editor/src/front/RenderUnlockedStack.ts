import { IEntity, IRenderUnlockedStack } from "./Common";
import { Input } from "./Input";

export class RenderUnlockedStack implements IRenderUnlockedStack {
  stack: number = 0;

  constructor(
    private scene: THREE.Scene,
    private renderer: THREE.Renderer,
    private camera: THREE.Camera,
    private entityList: IEntity[],
    private input: Input,
  ) { }

  protected isRenerAllowed: boolean = true;

  protected animate() {
    requestAnimationFrame(this.animate.bind(this));


    this.entityList.forEach((entity) => {
      entity.update(this.input, this.camera, this.renderer, this.entityList);
    });

    if (this.isRenerAllowed) {
      this.clearScene();
      this.entityList.forEach((entity) => {
        entity.render(this.input, this.camera, this.renderer);
      });

      this.renderer.render(this.scene, this.camera);

      console.log('Rendered', this.stack, new Date());
    }
    if(this.stack < 0) {
      this.stack = 0;
    }
    if(this.stack > 0) {
      this.isRenerAllowed = true;
    } else {
      this.isRenerAllowed = false;
    }
  }

  protected clearScene() {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }

  start(): void {
    this.animate();
  }

  inc(): void {
    this.stack++;
  }

  dec(): void {
    this.stack--;
  }
}