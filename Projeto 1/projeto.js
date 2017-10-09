var canvas;
var red;
var green;
var blue;
var alpha;
var gl;
var vertices;
window.onload = function init() {
    canvas = document.getElementById("canvas");
    red = document.getElementById("red");
    green = document.getElementById("green");
    blue = document.getElementById("blue");
    alpha = document.getElementById("alpha");
    gl = WebGLUtils.setupWebGL(canvas);

    canvas.addEventListener("click", function (e) {
        console.log("x:" + e.clientX + " y:"+ e.clientY);
      vertices.push(vec2(-1 + (2*e.clientX/canvas.width),
      -1 + (2*(canvas.height - e.clientY)/canvas.height)));
      /*
      x = -1 + (2*e.clientx/canvas.width)
      y = -1 + (2*(canvas.height - e.clienty)/canvas.height)

      TO BE OPTIMIZED
      */
      gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
      render();
    }) ;

    if(!gl) { alert("WebGL isn't available"); }

    vertices = [];

    // Configure WebGL
    gl.viewport(0, 0,canvas.width, canvas.height);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //points buffer
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer - points buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    render();
}

function changeColors(){
    document.getElementById("preview").style.backgroundColor = "rgb("
        + Math.floor(256 * red.value) + ","
        + Math.floor(256 * green.value) + ","
        + Math.floor(256 * blue.value) + ")";

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, vertices.length);
}
