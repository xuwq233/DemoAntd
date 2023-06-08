# getImageColor

## Median-cut Algorithm.

1. Find the smallest box which contains all the colors in the image.

2. Sort the enclosed colors along the longest axis of the box.

3. Split the box into 2 regions at median of the sorted list.

4. Repeat the above process until the original color space has been divided into N regions where N is the number of colors you want.

note: the median-cut algorithm is included in the quantize.js to get the palette of an image

## Improvement

When we want to get main color of an image more productively, we could input less pixels into the median-cut algorithm. So, there should be a smaller box which contains most of the colors in the image.

1. original solution
    fixed offset
2. original solution
    random offset
3. average rgb solution (best quantization performance)
    calculate the average rgba of a small region


## Related Commands

```
npm i --save-dev @types/get-pixels

npm i --save-dev @types/quantize

// to run the script
ts-node getImageTheme.ts
```