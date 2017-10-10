/*
  1º Projeto CGI
  Autor: Eduardo Bezerra Subtil - 48492
*/

var canvas;
var red;
var green;
var blue;
var alpha;
var gl;
var vertices;
var nVertices;
var colors;
var auto;
var sizes;
var sizeBuffer;
var shape;

window.onload = function init() {

    canvas = document.getElementById("canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    red = document.getElementById("red");
    green = document.getElementById("green");
    blue = document.getElementById("blue");
    alpha = document.getElementById("alpha");
    nVertices = 0;
    auto = false;
    vertices = [];
    sizes = [];
    step = [];
    shape = document.getElementById("shapes");


    // Configure WebGL
    gl.viewport(0, 0,canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //points buffer
    var pointsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 30000, gl.DYNAMIC_DRAW);

    // Associate our shader variables with our data buffer - points buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //color buffer
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 30000, gl.DYNAMIC_DRAW);

    // Associate our shader variables with our data buffer - color buffer
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    //size buffer
    sizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 30000, gl.DYNAMIC_DRAW);

    // Associate our shader variables with our data buffer - size buffer
    var vSize = gl.getAttribLocation(program, "vSize");
    gl.vertexAttribPointer(vSize, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vSize);

    //shape buffer
    shapeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, shapeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 30000, gl.DYNAMIC_DRAW);

    // Associate our shader variables with our data buffer - shape buffer
    var vShape = gl.getAttribLocation(program, "vShape");
    gl.vertexAttribPointer(vShape, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vShape);

    canvas.addEventListener("click", function (e) {
      console.log("x:" + e.offsetX + " y:"+ e.offsetY);

      /*
      TO BE OPTIMIZED
      */
      var x = -1 + (2*e.offsetX/canvas.width);
      var y = -1 + (2*(canvas.height - e.offsetY)/canvas.height);

      vertices.push(vec2(x, y));

      //sending in the vertices
      gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2'] * nVertices,
        flatten(vec2(x, y)));

      //sending in the colors
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4'] * nVertices,
        flatten(vec4(red.value, green.value, blue.value, alpha.value)));


      //sending in the size
      sizes.push((Math.random() * 100) + 51);

      var t = [sizes[sizes.length - 1]];
      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 4 * sizes.length,
        flatten(t));

      //sending in the shape
        gl.bindBuffer(gl.ARRAY_BUFFER, shapeBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 4 * sizes.length,
            flatten(shapes.value))

      nVertices++;
    });
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    render();
}

function changeColors(){
    document.getElementById("preview").style.backgroundColor = "rgba("
        + Math.floor(255 * red.value) + ","
        + Math.floor(255 * green.value) + ","
        + Math.floor(255 * blue.value) + ","
        + alpha.value + ")";
}

function toggleAutoMode(){
  auto = !auto;
}

function bloom(){
  for (i = 0; i < vertices.length; i++){

    sizes[i] *= Math.sin(new Date(milliseconds).getMilliseconds());

    var t = [sizes[i]];
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 4 * i,
      flatten(t));
  }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, vertices.length);
    window.requestAnimationFrame(render);
    bloom();
}
