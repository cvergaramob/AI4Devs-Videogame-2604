/**
 * AssetLoader.js
 * Carga asíncrona de assets (imágenes, sonido, etc.).
 * Por ahora solo preparado para el futuro; el juego utiliza rendering por canvas puro.
 * Dependencias: ninguna
 */

class AssetLoader {
    constructor() {
        this.assets = new Map();
        this.isLoaded = false;
        this.loadPromise = Promise.resolve();
    }

    /**
     * Cargar una imagen
     * @param {string} key - Clave identificadora
     * @param {string} path - Ruta de la imagen
     * @returns {Promise<Image>}
     */
    async loadImage(key, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.assets.set(key, img);
                resolve(img);
            };
            img.onerror = () => {
                reject(new Error(`Failed to load image: ${path}`));
            };
            img.src = path;
        });
    }

    /**
     * Cargar múltiples recursos en paralelo
     * @param {Object} assetMap - { key: path, ... }
     * @returns {Promise<void>}
     */
    async loadAssets(assetMap) {
        const promises = [];
        for (const [key, path] of Object.entries(assetMap)) {
            promises.push(this.loadImage(key, path));
        }
        await Promise.all(promises);
        this.isLoaded = true;
    }

    /**
     * Obtener un asset cargado
     * @param {string} key - Clave identificadora
     * @returns {Image|null}
     */
    get(key) {
        return this.assets.get(key) || null;
    }

    /**
     * Verificar si el asset existe
     * @param {string} key - Clave identificadora
     * @returns {boolean}
     */
    has(key) {
        return this.assets.has(key);
    }

    /**
     * Obtener todos los assets
     * @returns {Map}
     */
    getAll() {
        return new Map(this.assets);
    }

    /**
     * Limpiar todos los assets
     */
    clear() {
        this.assets.clear();
        this.isLoaded = false;
    }
}

const assetLoader = new AssetLoader();
