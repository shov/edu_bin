import { ISize2, Size2 } from '../infrastructure/Size2';
import { IVector2 } from '../infrastructure/Vector2';
import { MIXIN_NAME_SYMBOL } from '../infrastructure/Mixer';

export interface IRectangle {
    color: string;
    size: ISize2;
    draw(ctx: CanvasRenderingContext2D, location: IVector2): void;
}

export const rectangle: TMixIn = {
    [MIXIN_NAME_SYMBOL]: 'rectangle',
    color: 'white', // default color
    size: new Size2(10, 10), // default size

    draw(ctx: CanvasRenderingContext2D, location: IVector2) {
        ctx.fillStyle = this.color;
        ctx.fillRect(location.x, location.y, this.size.w, this.size.h);
    }
  }
