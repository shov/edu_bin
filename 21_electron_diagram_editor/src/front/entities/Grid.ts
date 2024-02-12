import { Camera, Renderer, Vector2 } from "three";
import { IEntity, IPosition } from "../Common";
import { Input } from "../Input";
import * as THREE from 'three'

export type TGridLine = [IPosition, IPosition];

export class Grid implements IEntity {
  public static readonly STEP = 0.2;
  public static readonly COLOR = 0xDDDDDD;
  public static readonly OFFSET_CELLS = 150;

  constructor(
    public scene: THREE.Scene,
  ) { }

  lineList: TGridLine[] = []

  update(input: Input, camera: Camera, renderer: Renderer, entityList: IEntity[]): void {
    const mCx = (camera.position.x * 10) | 0;
    const mCy = (camera.position.y * 10) | 0;
    const mCs = Grid.STEP * 10

    const cameraPosition: IPosition = { x: 0.1 * (mCx - mCx % mCs), y: 0.1 * (mCy - mCy % mCs) };

    this.lineList = [
      [
        {
          x: cameraPosition.x,
          y: cameraPosition.y - Grid.OFFSET_CELLS * Grid.STEP
        }
        ,
        {
          x: cameraPosition.x,
          y: cameraPosition.y + Grid.OFFSET_CELLS * Grid.STEP
        },
      ],
      [
        {
          x: cameraPosition.x - Grid.OFFSET_CELLS * Grid.STEP,
          y: cameraPosition.y
        },
        {
          x: cameraPosition.x + Grid.OFFSET_CELLS * Grid.STEP,
          y: cameraPosition.y
        },
      ],
    ];

    this.lineList = this.lineList.concat(Array(Grid.OFFSET_CELLS).fill(null).map((_, i) => {
      const addI = i + 1;
      return [
        {
          x: cameraPosition.x - (Grid.STEP * addI),
          y: cameraPosition.y - Grid.OFFSET_CELLS * Grid.STEP
        },
        {
          x: cameraPosition.x - (Grid.STEP * addI),
          y: cameraPosition.y + Grid.OFFSET_CELLS * Grid.STEP
        },
      ]
    }))

    this.lineList = this.lineList.concat(Array(Grid.OFFSET_CELLS).fill(null).map((_, i) => {
      const addI = i + 1;
      return [
        {
          x: cameraPosition.x + (Grid.STEP * addI),
          y: cameraPosition.y - Grid.OFFSET_CELLS * Grid.STEP
        },
        {
          x: cameraPosition.x + (Grid.STEP * addI),
          y: cameraPosition.y + Grid.OFFSET_CELLS * Grid.STEP
        },
      ]
    }))

    this.lineList = this.lineList.concat(Array(Grid.OFFSET_CELLS).fill(null).map((_, i) => {
      const addI = i + 1;
      return [
        {
          x: cameraPosition.x - Grid.OFFSET_CELLS * Grid.STEP,
          y: cameraPosition.y - (Grid.STEP * addI)
        },
        {
          x: cameraPosition.x + Grid.OFFSET_CELLS * Grid.STEP,
          y: cameraPosition.y - (Grid.STEP * addI)
        },
      ]
    }))

    this.lineList = this.lineList.concat(Array(Grid.OFFSET_CELLS).fill(null).map((_, i) => {
      const addI = i + 1;
      return [
        {
          x: cameraPosition.x - Grid.OFFSET_CELLS * Grid.STEP,
          y: cameraPosition.y + (Grid.STEP * addI)
        },
        {
          x: cameraPosition.x + Grid.OFFSET_CELLS * Grid.STEP,
          y: cameraPosition.y + (Grid.STEP * addI)
        },
      ]
    }))
  }

  render(input: Input, camera: Camera, renderer: Renderer): void {
    this.lineList.forEach(line => {
      const pointList = [
        new Vector2(line[0].x, line[0].y),
        new Vector2(line[1].x, line[1].y),
      ]

      const geometry = new THREE.BufferGeometry().setFromPoints(pointList);
      const material = new THREE.LineBasicMaterial({ color: Grid.COLOR });
      const threeLine = new THREE.Line(geometry, material);
      this.scene.add(threeLine);
    })
  }

}