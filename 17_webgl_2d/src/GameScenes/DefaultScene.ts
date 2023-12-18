import { TestTurtle } from "../Entities/TestTurtle";
import { Game } from "../Game";
import { IGameEntity } from "../IGameEntity";
import { IGameScene } from "../IGameScene";

export class DefaultScene implements IGameScene {
    protected entityList: IGameEntity[] = [];
  
    constructor(public readonly game: Game) {
    }

    async init() {
      let vs = await fetch('shaders/vertex.glsl').then(r => r.text());
      let fs = await fetch('shaders/fragment.glsl').then(r => r.text());

      this.game.resourceRegistry.register<string>('assets/shaders/sprite.vert', vs);
      this.game.resourceRegistry.register<string>('assets/shaders/sprite.frag', fs);
  
      this.entityList.push(new TestTurtle(this.game));
    }

    update(dt: number) {
      for (const entity of this.entityList) {
        entity.update(dt);
      }
    }

    render() {
      for (const entity of this.entityList) {
        entity.render();
      }
    }
}