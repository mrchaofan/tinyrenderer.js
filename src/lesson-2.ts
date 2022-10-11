import fs from 'fs'
import TgaLoader from 'tga-js';

import objRaw from 'bundle-text:../obj/african_head.obj';
import Canvas from "./Canvas";
import ObjParser from './ObjParser';
import { crossProduct, dotProduct, IVec2, IVec3, normalizeVector, Vec3 } from './utils';

const textureBuffer = fs.readFileSync(__dirname + '/../texture/african_head_diffuse.tga');

const canvas = new Canvas({
    width: 400,
    height: 400
});

canvas.mount(document.getElementById('app')!);

const lightV: Vec3 = [0, 0, -1];

const obj = ObjParser.parse(objRaw);

const tga = new TgaLoader();

tga.load(textureBuffer);

const textureData = tga.getImageData();

obj.faces.forEach(face => {
    const vertices = face.slice(0, 3).map(vtn => {
        const vertex = obj.vertices[vtn[0]];
        return {
            x: vertex[0],
            y: vertex[1],
            z: vertex[2],
        }
    }) as [IVec3, IVec3, IVec3];
    const triangle: [IVec3, IVec3, IVec3] = vertices.map(v => ({
        x: Math.floor((v.x + 1) * canvas.width / 2),
        y: Math.floor((v.y + 1) * canvas.height / 2),
        z: v.z,
    })) as [IVec3, IVec3, IVec3];
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
    const verticesOfTexture = face.slice(0, 3).map(vtn => {
        const v = obj.textures[vtn[1]];
        return {
            x: v[0],
            y: v[1],
        }
    }) as [IVec2, IVec2, IVec2]
    if (intensity > 0) {
        canvas.triangle(...triangle, (uv) => {
            const tx = Math.floor((verticesOfTexture[0].x * uv.x + verticesOfTexture[1].x * uv.y + verticesOfTexture[2].x * uv.z) * textureData.width);
            const ty = Math.floor((1 - (verticesOfTexture[0].y * uv.x + verticesOfTexture[1].y * uv.y + verticesOfTexture[2].y * uv.z)) * textureData.height);
            const offset = (tx + textureData.width * ty) * 4;
            return {
                r: textureData.data[offset] * intensity,
                g: textureData.data[offset + 1] * intensity,
                b: textureData.data[offset + 2] * intensity
            }
        })
    }
});

(window as any).canvas = canvas;
