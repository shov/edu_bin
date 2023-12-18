import { Game } from "./Game";
import { IRenderable } from "./IRenderable";
import { IUpdatable } from "./IUpdatable";

export interface IGameScene extends IRenderable, IUpdatable {
  readonly game: Game;
  
  init(): Promise<void>;
}