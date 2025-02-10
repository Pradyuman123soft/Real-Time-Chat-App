
export default async function getCroppedImg(imageSrc, croppedAreaPixels) {
    const image = await createImage(imageSrc);
    // create the image url into an element
    const canvas = document.createElement('canvas');
    // make a cnavas element
    const ctx = canvas.getContext('2d');
    // 2d context allow tp drawing in 2D


    // let set the dimension to match the cropped area
    canvas.width  = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    // Draw the cropped image onto the canvas
    ctx.drawImage(
        image,
        croppedAreaPixels.x, croppedAreaPixels.y,//position of the cropped area
        croppedAreaPixels.width,
        croppedAreaPixels.height, //width and height of the cropped area
        0,0,//position on the canvas
        croppedAreaPixels.width,
        croppedAreaPixels.height //canvas width and height
    );
    // convert the camvas content into a blob, which is an image format that can be uploaded
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob)=>{
            resolve(blob); //return the cropped image as blob
        }, 'image/jpeg');
    });
}

async function createImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load',()=>resolve(img));//resolve the promise once the image is loaded
        img.addEventListener('error',()=>reject(error));//reject on error
        img.src = url;
    });
}