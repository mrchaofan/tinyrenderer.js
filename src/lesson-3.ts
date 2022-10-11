import Canvas from "./Canvas";

const canvas = new Canvas({
    width: 400,
    height: 400
});

canvas.mount(document.getElementById('app')!);

canvas.triangle({
    x: 100,
    y: 100,
    z: 100,
}, {
    x: 110,
    y: 110,
    z: 0,
}, {
    x: 100,
    y: 110,
    z: 100,
}, {
    r: 0,
    g: 0,
    b: 255,
});

canvas.triangle({
    x: 100,
    y: 100,
    z: 0,
}, {
    x: 110,
    y: 110,
    z: 100,
}, {
    x: 100,
    y: 110,
    z: 0,
}, {
    r: 0,
    g: 255,
    b: 0,
});



(window as any).canvas = canvas;
