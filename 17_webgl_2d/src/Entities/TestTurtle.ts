import { Game } from "../Game";
import { IGameEntity } from "../IGameEntity";
import { Sprite } from "../Sprite";

export class TestTurtle implements IGameEntity {

  protected sprite!: Sprite;

  constructor(protected readonly game: Game) {
    const vs = this.game.resourceRegistry.get<string>('assets/shaders/sprite.vert');
    const fs = this.game.resourceRegistry.get<string>('assets/shaders/sprite.frag');
    
    this.sprite = new Sprite(this.game.gl, this.game, "assets/turtle.png", vs, fs, {
      w: 64,
      h: 64,
    });

    this.sprite.setAnimation(function (this: Sprite) {
      this.frameOffset.x = this.uv.x * (Date.now() % 800 / 200 | 0);
    });
  }

  update(dt: number): void {
    this.sprite.update(dt);
  }

  render(): void {
    this.sprite.render();
  }
}