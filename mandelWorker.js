onmessage = function(e) {
    const [mandelSet, MAX_ITERATIONS, CANVAS_WIDTH, MAGNIFICATION_FACTOR, OFFSET_X, OFFSET_Y] = e.data
    for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
        console.log(`iteration ${iteration}`)
        let valueCalculated = false

        const pixels = []

        mandelSet.forEach((n, i) => {
            const x = i % CANVAS_WIDTH
            const y = Math.floor(i / CANVAS_WIDTH)
            const offsetX = x / MAGNIFICATION_FACTOR - OFFSET_X
            const offsetY = y / MAGNIFICATION_FACTOR - OFFSET_Y

            if (n.result) {
                pixels.push([x, y, n.result])
                return
            }

            if (iteration === 0) {
                n.real = offsetX
                n.imag = offsetY
            }

            const value = calculateValue(n, offsetX, offsetY, iteration)
            mandelSet[i] = value
            valueCalculated = true

            pixels.push([x, y, value.result])
        })
        postMessage(pixels)
        if (!valueCalculated) break
    }
    console.log('done')
};

function calculateValue({real, imag}, x, y, iteration) {
    const nReal = real * real - imag * imag + x
    const nImag = 2 * real * imag + y

    const result = Math.sqrt(nReal)
    if (result > 2)
        return {real: nReal, imag: nImag, result: iteration}
    return {real: nReal, imag: nImag, result: undefined}
}
