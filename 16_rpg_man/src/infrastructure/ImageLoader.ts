
export class ImageLoader {

  protected _map: Map<string, HTMLImageElement> = new Map()

  public async load(name: string, src: string): Promise<void> {
    return new Promise((r, j) => { 
      const img = new Image()
      img.src = src
      img.onerror = j
      img.onload = () => {
        this._map.set(name, img)
        r()
      }
    })
  }

  public delete(name: string) {
    this._map.delete(name)
  }

  public get(name: string) {
    return this._map.get(name)
  }
}