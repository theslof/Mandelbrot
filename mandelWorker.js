onmessage = function(e) {
    const start_t = Date.now()
    const [MAX_ITERATIONS, CANVAS_WIDTH, CANVAS_HEIGHT, MAGNIFICATION_FACTOR, OFFSET_X, OFFSET_Y] = e.data
    const mandelSet = new Array(CANVAS_WIDTH * CANVAS_HEIGHT)

    for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
        let valueCalculated = false

        const pixels = []

        for (let i = 0; i < mandelSet.length; i++) {
            const x = i % CANVAS_WIDTH
            const y = Math.floor(i / CANVAS_WIDTH)
            const offsetX = (x - OFFSET_X) / MAGNIFICATION_FACTOR
            const offsetY = (y - OFFSET_Y) / MAGNIFICATION_FACTOR

            if (mandelSet[i] && mandelSet[i].result) {
                pixels.push(mandelSet[i].result)
                continue
            }

            if (!mandelSet[i]) {
                mandelSet[i] = {real: offsetX, imag: offsetY}
            }

            const value = calculateValue(mandelSet[i], offsetX, offsetY, iteration)
            mandelSet[i] = value
            valueCalculated = true

            pixels.push(value.result)
        }
        postMessage(pixels)
        if (!valueCalculated) break
    }
    console.log(`Done in ${(Date.now() - start_t) / 1000} seconds`)
};

function calculateValue({real, imag}, x, y, iteration) {
    const nReal = real * real - imag * imag + x
    const nImag = 2 * real * imag + y

    const result = Math.sqrt(nReal)
    if (result > 2)
        return {real: nReal, imag: nImag, result: iteration}
    return {real: nReal, imag: nImag, result: undefined}
}
