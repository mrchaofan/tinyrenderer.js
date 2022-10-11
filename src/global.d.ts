declare module '*.obj' {
    var exports: string
    export = exports;
}

declare module 'tga-js' {
    class TgaLoader {
        load(data: Uint8Array): void
        getImageData(imageData?: ImageData): ImageData
    }
    export = TgaLoader
}