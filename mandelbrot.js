const myCanvas = document.createElement("canvas");
const width = 1920;
const height = 1080;
myCanvas.width = width;
myCanvas.height = height;
document.body.appendChild(myCanvas);
const ctx = myCanvas.getContext("2d");

const magnificationFactor = 1900;
const panX = 0.6;
const panY = 0.9;
const maxIterations = 30;
const imageSize = width * height;

render(maxIterations);

async function render(iterations) {
    let currentPixel = 0;
//    let matrix = new Array(imageSize);

    let worker = new Worker('mandelWorker.js');
    worker.onmessage = function (e) {
        let x = e.data[0] % width;
        let y = Math.floor(e.data[0] / width);
        if (e.data[1] == 0) {
            ctx.fillStyle = '#000';
            ctx.fillRect(x, y, 1, 1); // Draw a black pixel
        } else {
            ctx.fillStyle = 'hsl(' + e.data[1] * 72 + ', 100%, ' + e.data[1] * 100 + '%)';
            ctx.fillRect(x, y, 1, 1); // Draw a colorful pixel
        }
        if(currentPixel < imageSize)
            worker.postMessage([currentPixel++, width, iterations, magnificationFactor, panX, panY]);
    };
    worker.postMessage([currentPixel++, width, iterations, magnificationFactor, panX, panY]);
}

function drawPixel() {

}
