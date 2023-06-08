/*
* Get main color of an Image
* Support: png jpg gif
*/
import getPixels from "get-pixels"
import quantize from "quantize"
import { NdArray } from "ndarray";

type Callback = (err: Error | null, pixels: NdArray<Uint8Array>) => void;

//jpg
// const demoPath = "https://fastly.picsum.photos/id/13/200/300.jpg?hmac=UHtWCvsKxIfcA_gIse7Rc6MH6nI3OGl0dzaCSSsYqas";
//png
// const demoPath = "./pics/red.png"
// const demoPath = "./pics/blue.png"
//gif
// const demoPath = "./pics/gifdemo.gif"
const demoPath = "./pics/sunset.gif"

interface ImgData {
    data: NdArray<Uint8Array>;
    shape: Array<number>;
    stride: Array<number>;
    offset: number;
}
type RgbPixel = [number, number, number]
type PixelArray = Array<RgbPixel>

/**
* Get image pixels array by get-pixels
* @param {string} path
* @return {Promise} ndarray/err
*/
const getImage = (path: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        getPixels(path, (err: Error | null, pixels: NdArray<Uint8Array>) => {
            if(err){
                reject(err)
            }else{
                resolve(pixels)
            }
        })
    })
};

/**
* construct and filter a new pixelArray
* @param {object} imgData
* @param {number} pixelCount
* @param {number} quality
* @return {Array} pixelArray
*/
const createPixelArray = (imgData: Array<number>, pixelCount: number, quality: number): PixelArray => {
    const pixels: Array<number> = imgData;
    const pixelArray: PixelArray = [];

    for (let i = 0, offset = 0, random = 0, r = 0, g = 0, b = 0, a = 0; i < pixelCount; i = i + quality) {
        // original
        // offset = i * 4;
        // r = pixels[offset + 0];
        // g = pixels[offset + 1];
        // b = pixels[offset + 2];
        // a = pixels[offset + 3];

        //apply a random number
        // offset = i * 4;
        // random = Math.floor(Math.random() * quality)
        // r = pixels[offset + random + 0];
        // g = pixels[offset + random + 1];
        // b = pixels[offset + random + 2];
        // a = pixels[offset + random + 3];

        //avg rgb of a region
        r = 0;
        g = 0;
        b = 0;
        a = 0;
        for(let j = i; j < i + quality; j++){
            offset = j * 4;

            r += pixels[offset + 0];
            g += pixels[offset + 1];
            b += pixels[offset + 2];
            a += pixels[offset + 3];
        }
        r = r / quality;
        g = g / quality;
        b = b / quality;
        a = a / quality;


        // pixel: mostly opaque
        // ==> aim to get rid of the influence of transparent bg of png
        if (typeof a === 'undefined' || a >= 125) {

            // if (!(r > 250 && g > 250 && b > 250)) {
                pixelArray.push([r, g, b]);
            // }
        }
    }
    return pixelArray;
}

/**
* get the color palette of an image
* @param {string} path
* @param {number} colorCount
* @param {number} quality
* @return {Promise} palette/err
*/
const getPalette = (path: string, colorCount: number = 3, quality: number = 10): Promise<RgbPixel[] | null> => {
    const options = {
        colorCount,
        quality
    };

    return new Promise((resolve, reject) => {
        getImage(path)
            .then(imgData => {
                const pixelCount = imgData.shape[0] * imgData.shape[1];//width * height
                const pixelArray = createPixelArray(imgData.data, pixelCount, options.quality);

                const cmap = quantize(pixelArray, options.colorCount);
                const palette = cmap? cmap.palette() : null;//returns an array that contains the reduced color palette

                resolve(palette);
            })
            .catch(err => {
                reject(err);
            })
    });
}


/**
* get the main color of an image
* @param {string} path
* @param {number} colorCount the number of color in palette
* @param {number} quality the offset of pixelArray (lower the quality, better the result)
* @return {Promise} main color/err
*/
const getImageTheme = (path: string, colorCount: number, quality: number): Promise<object> => {
    return new Promise((resolve, reject) => {
        getPalette(path, colorCount = 3, quality = 10).then((palette: any) => {
            resolve(palette[0]);// main color of img
        }).catch((err) => {
            reject(err);
        })
    })
};

//test
getImageTheme(demoPath, 10, 10).then((val) => {console.log(val)});

export default getImageTheme;