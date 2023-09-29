import { AResource } from "./AResource";
import { AScene } from "./AScene";

export class ImageResource extends AResource {
  constructor(name: string, protected filePath: string) {
    super(name)
  }

  async load(scene: AScene) { // now threre is no option to RE-load if it's been loaded once
    const loaded = scene.imageLoader.get(this.name)
    if(!loaded) {
      await scene.imageLoader.load(this.name, this.filePath)
    }
    
    this._value = scene.imageLoader.get(this.name)
  }
}