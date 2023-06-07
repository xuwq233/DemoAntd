/*
* Get main color of an Image
* Support: png jpg gif
*/
import getPixels from "get-pixels"
import quantize from "quantize"

//jpg
// const demoPath = "https://fastly.picsum.photos/id/13/200/300.jpg?hmac=UHtWCvsKxIfcA_gIse7Rc6MH6nI3OGl0dzaCSSsYqas";
//png
// const demoPath = "https://raw.githubusercontent.com/scijs/get-pixels/master/test/test_pattern.png";
const demoPath ="./pics/instergram.png"
//gif
// const demoPath = "./pics/gifdemo.gif"

/**
* Get image pixels array by get-pixels
* @param {string} path
* @return {Promise} ndarray/err
*/
const getImage = (path) => {
    return new Promise((resolve, reject) => {
        getPixels(path, (err, pixels) => {
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
const createPixelArray = (imgData, pixelCount, quality) => {
    const pixels = imgData;
    const pixelArray = [];

    for (let i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
        offset = i * 4;
        r = pixels[offset + 0];
        g = pixels[offset + 1];
        b = pixels[offset + 2];
        a = pixels[offset + 3];

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
const getPalette = (path, colorCount = 3, quality = 10) => {
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
* @param {number} colorCount
* @param {number} quality
* @return {Promise} main color/err
*/
const getImageColor = async (path, colorCount, quality) => {
    return new Promise((resolve, reject) => {
        getPalette(path, colorCount = 3, quality = 10).then((palette) => {
            resolve(palette[0]);// main color of img
        }).catch((err) => {
            reject(err);
        })
    })
};

//test
getImageColor(demoPath, 3, 10).then((val) => {console.log(val)});

export default getImageColor;