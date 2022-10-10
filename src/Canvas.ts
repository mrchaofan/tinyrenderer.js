import { barycentric, clamp, IRGBA, IVec2, IVec4 } from "./utils"

export interface ICanvasOptions {
    width: number
    height: number
}

class RafScheduler {
    static queue: Array<Function> = []
    static enqueue(fn: () => void) {
        if (this.queue.length === 0) {
            requestAnimationFrame(this.onRaf.bind(this))
        }
        this.queue.push(fn)
        return this
    }
    static onRaf() {
        const queue = this.queue;
        this.queue = []
        queue.forEach((fn) => fn())
    }
}

export default class Canvas {
    width: number
    height: number
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    buffer: ImageData
    constructor(options: ICanvasOptions) {
        this.canvas = document.createElement('canvas');
        this.width = this.canvas.width = options.width
        this.height = this.canvas.height = options.height
        this.context = this.canvas.getContext('2d')!;
        this.buffer = this.context.getImageData(0, 0, options.width, options.height);
    }
    putPixel(x: number, y: number, r: number, g: number, b: number, a = 255) {
        // I use the opengl's coordinate representation hibit here. The origin of the coordinate is from bottom left.
        const offset = (x + this.width * (this.height - y)) * 4;
        if (offset >= this.width * this.height * 4) {
            return
        }
        this.buffer.data[offset] = r;
        this.buffer.data[offset + 1] = g;
        this.buffer.data[offset + 2] = b;
        this.buffer.data[offset + 3] = a;
        if (RafScheduler.queue.length === 0) {
            RafScheduler.enqueue(this.updateCanvas.bind(this))
        }
        return offset;
    }
    updateCanvas() {
        this.context.putImageData(this.buffer, 0, 0);
    }
    mount(el: HTMLElement, ref: Node | null = null) {
        el.insertBefore(this.canvas, ref)
        return this;
    }
    unMount() {
        if (this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
    line(x0: number, y0: number, x1: number, y1: number, r: number, g: number, b: number, a?: number) {
        let transposed = false;
        if (Math.abs(x1 - x0) < Math.abs(y1 - y0)) {
            [x0, y0] = [y0, x0];
            [x1, y1] = [y1, x1];
            transposed = true;
        }
        if (x0 > x1) {
            [x0, x1] = [x1, x0];
            [y0, y1] = [y1, y0];
        }
        const dx = x1 - x0;
        const dy = y1 - y0;
        const step = 2 * Math.abs(dy);
        let accumulation = 0;
        for (let x = x0, y = y0; x <= x1; x++) {
            this.putPixel(transposed ? y : x, transposed ? x : y, r, g, b, a);
            accumulation += step;
            if (accumulation > dx) {
                y += y1 > y0 ? 1 : -1;
                accumulation -= 2 * dx;
            }
        }
    }
    bbox(...args: IVec2[]): [IVec2, IVec2] {
        const minxy: IVec2 = {
            x: Math.max(0, Math.min(...args.map(arg => arg.x))),
            y: Math.max(0, Math.min(...args.map(arg => arg.y))),
        }
        const maxxy: IVec2 = {
            x: Math.min(this.width, Math.max(...args.map(arg => arg.x))),
            y: Math.min(this.height, Math.max(...args.map(arg => arg.y))),
        }
        return [minxy, maxxy];
    }
    triangle(a: IVec2, b: IVec2, c: IVec2, color: IRGBA) {
        const bbox = this.bbox(a, b, c);
        outer: for (let x = bbox[0].x; x <= bbox[1].x; x++) {
            for (let y = bbox[0].y; y <= bbox[1].y; y++) {
                const uv = barycentric({
                    x, y
                }, a, b, c)

                if(!uv) {
                    break outer;
                }
                
                if (uv.x < 0 || uv.y < 0 || uv.z < 0) {
                    continue
                }
                this.putPixel(x, y, color.r, color.g, color.b, color.a)
            }
        }
    }
}
