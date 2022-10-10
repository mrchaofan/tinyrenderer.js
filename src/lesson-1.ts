import objRaw from 'bundle-text:../obj/african_head.obj';
import Canvas from "./Canvas";
import ObjParser from './ObjParser';

const canvas = new Canvas({
    width: 400,
    height: 400
});

canvas.mount(document.getElementById('app')!);

canvas.line(0, 0, 200, 200, 0, 0, 0);
canvas.line(0, 400, 200, 200, 0, 0, 0);

const obj = ObjParser.parse(objRaw);

obj.faces.forEach(face => {
    face.forEach(([vIndex], index, face) => {
        const v0 = obj.vertices[vIndex];
        const v1 = obj.vertices[face[(index + 1) % face.length][0]]
        const x0 = Math.floor((v0[0] + 1) * canvas.width / 2)
        const y0 = Math.floor((v0[1] + 1) * canvas.height / 2)
        const x1 = Math.floor((v1[0] + 1) * canvas.width / 2)
        const y1 = Math.floor((v1[1] + 1) * canvas.height / 2)

        canvas.line(x0, y0, x1, y1, 0, 0, 0);
    })
});



(window as any).canvas = canvas;
