const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

let image = new Image();

let canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let imgData;

const fileInput = document.getElementById('file-input');
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const transparent = document.getElementById('transparent');
const saveBtn = document.getElementById('save-button');

saveBtn.addEventListener('click', async () => {
    let tmpLink = document.createElement('a');
    tmpLink.download = "result.png";
    tmpLink.href = canvas.toDataURL();
    tmpLink.click();
    // await sleep(1000);
    // tmpLink.delete;
});

fileInput.addEventListener('change', (ev) => {
    if (ev.target.files) {
        let file = ev.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = (e) => {
            // let image = new Image();
            image.src = e.target.result;
            image.onload = (ev) => {
                let canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            }
        }
    }
});

brightness.addEventListener('change', (e) => {
    processImage();
});

contrast.addEventListener('change', (e) => {
    processImage();
});

transparent.addEventListener('change', (e) => {
    processImage();
});

function processImage() {
    let b = parseInt(brightness.value);
    let c = parseInt(contrast.value);
    let t = parseFloat(transparent.value);
    let factor = 259 * (255 + c) / (255 * (259 - c));

    const imageData = ctx.createImageData(imgData);

    for (let i = 0; i < imageData.data.length; i++) {
        if ((i + 1) % 4 !== 0) {
            let p = imgData.data[i];
            p = factor * (p - 128) + 128;
            p = p + b;
            imageData.data[i] = clamp(p, 0, 255);
        } else {
            imageData.data[i] = imgData.data[i] * t;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}