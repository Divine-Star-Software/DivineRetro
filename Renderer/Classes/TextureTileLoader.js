import { DynamicTexture } from "@babylonjs/core";
class TextureTileLoader {
    scene;
    url;
    tileSize;
    tiles = [];
    constructor(scene, url, tileSize = 8) {
        this.scene = scene;
        this.url = url;
        this.tileSize = tileSize;
    }
    async loadTexture() {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = this.url;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error("Failed to get 2D context"));
                    return;
                }
                // Set canvas size to the image size
                canvas.width = img.width;
                canvas.height = img.height;
                // Draw the image on the canvas
                ctx.drawImage(img, 0, 0);
                // Break the image into tiles
                this._createTiles(ctx, img.width, img.height);
                resolve(this.tiles);
            };
            img.onerror = () => {
                reject(new Error("Failed to load image from URL"));
            };
        });
    }
    _createTiles(ctx, imgWidth, imgHeight) {
        const rows = Math.floor(imgHeight / this.tileSize);
        const cols = Math.floor(imgWidth / this.tileSize);
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const tileCanvas = document.createElement('canvas');
                const tileCtx = tileCanvas.getContext('2d');
                if (!tileCtx) {
                    throw new Error("Failed to get 2D context for tile canvas");
                }
                // Set each tile to the size of 8x8
                tileCanvas.width = this.tileSize;
                tileCanvas.height = this.tileSize;
                // Extract the 8x8 section from the main image
                tileCtx.drawImage(ctx.canvas, col * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize, 0, 0, this.tileSize, this.tileSize);
                // Create a Babylon.js dynamic texture from the tile canvas
                const tileTexture = new DynamicTexture(`tile_${row}_${col}`, { width: this.tileSize, height: this.tileSize }, this.scene, false);
                // Apply the tile image data to the Babylon texture
                const tileTextureCtx = tileTexture.getContext();
                if (!tileTextureCtx) {
                    throw new Error("Failed to get 2D context for dynamic texture");
                }
                tileTextureCtx.drawImage(tileCanvas, 0, 0);
                tileTexture.update();
                // Store the tile texture
                this.tiles.push(tileTexture);
            }
        }
    }
}
