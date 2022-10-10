export type Vec3 = [number, number, number];

export type Vec2 = [number, number];

export type Vec = Vec3 | Vec2;

export interface IVec2 {
    x: number;
    y: number;
}

export interface IVec3 extends IVec2 {
    z: number
}

export interface IVec4 extends IVec3 {
    w: number
}

export interface IRGBA {
    r: number;
    g: number;
    b: number;
    a?: number;
}

export function clamp(x: number, a: number, b: number) {
    return Math.min(Math.max(x, a), b);
}

export function crossProduct(a: IVec3, b: IVec3) {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x
    }
}

export function dotProduct<T extends Vec>(v1: T, v2: T) {
    return v1.reduce((a, b, i) => a + b * v2[i], 0)
}


export function barycentric(p: IVec2, a: IVec2, b: IVec2, c: IVec2): IVec3 | undefined {
    const u = crossProduct(
        { x: b.x - a.x, y: c.x - a.x, z: a.x - p.x },
        { x: b.y - a.y, y: c.y - a.y, z: a.y - p.y }
    )
    return u.z === 0 ? undefined : {
        x: 1 - (u.x + u.y) / u.z,
        y: u.x / u.z,
        z: u.y / u.z,
    }
}

export function normalizeVector<T extends Vec>(v: T): T {
    const sum = Math.sqrt(v.reduce((a, b) => a + b * b, 0));
    return v.map(v => v / sum) as T
}
