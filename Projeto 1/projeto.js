window.onload = function init() {
    var canvas = document.getElementById("canvas");
    var red = document.getElementById("red");
    var green = document.getElementById("green");
    var blue = document.getElementById("blue");
    var alpha = document.getElementById("alpha");
    gl = WebGLUtils.setupWebGL(canvas);

    if(!gl) { alert("WebGL isn't available"); }

    // Three vertices
    var vertices = [
        vec2(-0.5,-0.5),
        vec2(0.5,-0.5),
        vec2(0,0.5),
    ];

    // Configure WebGL
    gl.viewport(0,0,canvas.width, canvas.height);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    changeColors();
}

function changeColors(){
    gl.clearColor(red.value, green.value, blue.value, alpha.value);
    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
}