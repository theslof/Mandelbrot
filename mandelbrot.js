var myCanvas = document.createElement("canvas");
var width = 1920;
var height = 1080;
myCanvas.width = width;
myCanvas.height = height;
document.body.appendChild(myCanvas);
var ctx = myCanvas.getContext("2d");

var magnificationFactor = 1900;
var panX = 0.6;
var panY = 0.9;

render();

function checkIfBelongsToMandelbrotSet(x, y) {
    var real = x;
    var imag = y;
    var maxIterations = 300;
    for (var i = 0; i < maxIterations; i++) {
        var tReal = real * real - imag * imag + x;
        imag = 2 * real * imag + y;
        real = tReal;

        if (real + imag > 4)
            return (i / maxIterations);
    }
    return 0;   // Return zero if in set
}

function render() {
    var matrix = new Array(height);
    for (var y = 0; y < height; y++) {
        matrix[y] = new Array(width);
        for (var x = 0; x < width; x++) {
            matrix[y][x] = new Array(3);
            var belongsToSet =
                checkIfBelongsToMandelbrotSet(x / magnificationFactor - panX,
                    y / magnificationFactor - panY);
            /*
            matrix[y][x][0] = Math.round(belongsToSet * 255);
            matrix[y][x][1] = Math.round(belongsToSet * 64);
            matrix[y][x][2] = Math.round(belongsToSet * 32);
            */

            if (belongsToSet == 0) {
                ctx.fillStyle = '#000';
                ctx.fillRect(x, y, 1, 1); // Draw a black pixel
            } else {
                ctx.fillStyle = 'hsl(' + belongsToSet * 72 + ', 100%, ' + belongsToSet * 100 + '%)';
                ctx.fillRect(x, y, 1, 1); // Draw a colorful pixel
            }

        }
    }
    /*
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                octx.fillStyle = getRGB(matrix, x, y);
                octx.fillRect(x, y, 1, 1); // Draw a colorful pixel
            }
        }
    */
//    octx.translate(0.5, 0.5);
//    ctx.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, myCanvas.width, myCanvas.height);
}

function getRGB(array, x, y) {
    var r = '0' + (array[y][x][0]).toString(16);
    var g = '0' + (array[y][x][1]).toString(16);
    var b = '0' + (array[y][x][2]).toString(16);

    return '#' + r.substr(-2) + g.substr(-2) + b.substr(-2);
}