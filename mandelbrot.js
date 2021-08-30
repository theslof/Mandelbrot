let worker
let progress = 0

function startRender(event) {
  event.preventDefault()

  if (worker) {
    worker.terminate()
  }

  const CANVAS_WIDTH = document.getElementById('CANVAS_WIDTH').value
  const CANVAS_HEIGHT = document.getElementById('CANVAS_HEIGHT').value
  const MAGNIFICATION_FACTOR = document.getElementById('MAGNIFICATION_FACTOR').value
  const OFFSET_X = document.getElementById('OFFSET_X').value
  const OFFSET_Y = document.getElementById('OFFSET_Y').value
  const MAX_ITERATIONS = document.getElementById('MAX_ITERATIONS').value

  const elProgress = document.querySelector('#progress')
  elProgress.querySelector('#progress__iterations').innerText = 0
  elProgress.querySelector('#progress__max').innerText = MAX_ITERATIONS
  elProgress.classList.remove('hidden')
  progress = 0

  let myCanvas = document.querySelector('canvas')
  if (!myCanvas) {
    myCanvas = document.createElement('canvas')
    document.body.appendChild(myCanvas)
  }

  myCanvas.width = CANVAS_WIDTH
  myCanvas.height = CANVAS_HEIGHT
  const ctx = myCanvas.getContext('2d')

  worker = new Worker('mandelworker.js')
  worker.onmessage = function (e) {
    const pixels = e.data
    progress++
    elProgress.querySelector('#progress__iterations').innerText = progress
    renderImage(pixels)
  }
  worker.postMessage([MAX_ITERATIONS, CANVAS_WIDTH, CANVAS_HEIGHT, MAGNIFICATION_FACTOR, OFFSET_X, OFFSET_Y])

  function renderImage(pixels) {
    const imageData = new ImageData(CANVAS_WIDTH, CANVAS_HEIGHT)

    pixels.forEach((iteration, index) => {
      if (!iteration) {
        // Draw a black pixel
        imageData.data[index * 4] = 0
        imageData.data[index * 4 + 1] = 0
        imageData.data[index * 4 + 2] = 0
        imageData.data[index * 4 + 3] = 255
      } else {
        const value = Math.log(iteration) / Math.log(MAX_ITERATIONS)
        imageData.data[index * 4] = value * 255
        imageData.data[index * 4 + 1] = Math.pow(value, 2) * 255
        imageData.data[index * 4 + 2] = Math.pow(value, 4) * 255
        imageData.data[index * 4 + 3] = 255
      }
    })

    ctx.putImageData(imageData, 0, 0)
  }
}

document.getElementById('form').addEventListener('submit', startRender)
