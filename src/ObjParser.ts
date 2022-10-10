import { Vec3 } from "./utils"

export default class ObjParser {
    static parse(str: string) {
        const obj = new ObjParser()
        str.split(/\n/).forEach(line => {
            const args = line.split(/\s+/).filter(Boolean)
            if (args[0] === 'v') {
                obj.vertices.push(args.slice(1).map((arg) => parseFloat(arg)) as Vec3)
            } else if (args[0] === 'f') {
                obj.faces.push(args.slice(1).map(arg => arg.split('/').map(n => parseInt(n) - 1)) as Vec3[])
            }
        })
        return obj;
    }
    
    constructor(public vertices: Vec3[] = [], public faces: Vec3[][] = []) {

    }
}
