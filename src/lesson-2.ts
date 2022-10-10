import objRaw from 'bundle-text:../obj/african_head.obj';
import Canvas from "./Canvas";
import ObjParser from './ObjParser';
import { crossProduct, dotProduct, IVec2, IVec3, normalizeVector, Vec3 } from './utils';

const canvas = new Canvas({
    width: 400,
    height: 400
});

canvas.mount(document.getElementById('app')!);

canvas.line(0, 0, 200, 200, 0, 0, 0);
canvas.line(0, 400, 200, 200, 0, 0, 0);

canvas.triangle({
    x: 100,
    y: 100,
}, {
    x: 200,
    y: 200,
}, {
    x: 100,
    y: 200
}, {
    r: 0,
    g: 0,
    b: 255,
});

const lightV: Vec3 = [0,0,-1];

const obj = ObjParser.parse(objRaw);

obj.faces.forEach(face => {
    const vertices = face.slice(0, 3).map(vtn => {
        const vertex = obj.vertices[vtn[0]];
        return {
            x: vertex[0],
            y: vertex[1],
            z: vertex[2],
        }
    }) as [IVec3, IVec3, IVec3];
    const triangle = vertices.map(v => ({
        x: Math.floor((v.x + 1) * canvas.width / 2),
        y: Math.floor((v.y + 1) * canvas.height / 2)
    })) as [IVec2, IVec2, IVec2];
    const normal = crossProduct({
        x: vertices[2].x - vertices[0].x,
        y: vertices[2].y - vertices[0].y,
        z: vertices[2].z - vertices[0].z,
    }, {
        x: vertices[1].x - vertices[0].x,
        y: vertices[1].y - vertices[0].y,
        z: vertices[1].z - vertices[0].z,
    })
    const normalized = normalizeVector([normal.x, normal.y, normal.z]);
    const intensity = dotProduct(normalized, lightV);
    if (intensity > 0) {
        canvas.triangle(...triangle, {
            r: 255 * intensity,
            g: 255 * intensity,
            b: 255 * intensity,
        })
    }
});

(window as any).canvas = canvas;
