/*
* Get RGB of an Image
*/
import fetch from "node-fetch"

const demoPath = "https://fastly.picsum.photos/id/13/200/300.jpg?hmac=UHtWCvsKxIfcA_gIse7Rc6MH6nI3OGl0dzaCSSsYqas";

const getBlob = async (path) => {
    const response = await fetch(path);
    const blob = await response.blob();

    return blob;
};

const getPicRGB = async (path) => {
    const blob = await getBlob(path);

    const reader = new FileReader();
    reader.readAsDataURL(blob);

    return blob;
};

getPicRGB(demoPath)

export default getPicRGB;
