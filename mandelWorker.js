onmessage = function(e) {
    let x = e.data[0] % e.data[1];
    let y = Math.floor(e.data[0] / e.data[1]);
    let belongsToSet =
        checkIfBelongsToMandelbrotSet(x / e.data[3] - e.data[4],
            y / e.data[3] - e.data[5], e.data[2]);
    postMessage([e.data[0], belongsToSet]);

};

function checkIfBelongsToMandelbrotSet(x, y, iterations) {
    let real = x;
    let imag = y;
    for (let i = 0; i < iterations; i++) {
        let tReal = real * real - imag * imag + x;
        imag = 2 * real * imag + y;
        real = tReal;

        if (Math.sqrt(real) > 2)
            return (i / iterations);
    }
    return 0;   // Return zero if in set
}
