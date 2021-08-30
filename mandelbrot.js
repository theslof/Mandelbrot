const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 480
const MAGNIFICATION_FACTOR = 500
const OFFSET_X = 1.8
const OFFSET_Y = 0.5
const MAX_ITERATIONS = 30
const IMAGE_SIZE = CANVAS_WIDTH * CANVAS_HEIGHT

const myCanvas = document.createElement('canvas')
myCanvas.width = CANVAS_WIDTH
myCanvas.height = CANVAS_HEIGHT
document.body.appendChild(myCanvas)
const ctx = myCanvas.getContext('2d')
const mandelSet = []

for (let n = 0; n < IMAGE_SIZE; n++) {
  mandelSet.push({real: undefined, imag: undefined, result: undefined})
}

const worker = new Worker('mandelworker.js')
worker.onmessage = function (e) {
  const pixels = e.data
  renderImage(pixels)
}
worker.postMessage([mandelSet, MAX_ITERATIONS, CANVAS_WIDTH, MAGNIFICATION_FACTOR, OFFSET_X, OFFSET_Y])

function renderImage(pixels) {
  const imageData = new ImageData(CANVAS_WIDTH, CANVAS_HEIGHT)

  pixels.forEach(([x, y, iteration], index) => {
    if (!iteration) {
      // Draw a black pixel
      imageData.data[index * 4] = 0
      imageData.data[index * 4 + 1] = 0
      imageData.data[index * 4 + 2] = 0
      imageData.data[index * 4 + 3] = 255
    } else {
      const value = iteration / MAX_ITERATIONS
      imageData.data[index * 4] = value * 255
      imageData.data[index * 4 + 1] = Math.max(value - 0.25, 0) * 255
      imageData.data[index * 4 + 2] = Math.max(value / 2 - 0.5, 0) * 255
      imageData.data[index * 4 + 3] = 255
    }
  })

  ctx.putImageData(imageData, 0, 0)
}

