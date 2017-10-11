/*
  1º Projeto CGI
  Autor: Eduardo Bezerra Subtil - 48492
*/

var canvas;
var gl;
var rgba;
var vertices;
var auto;
var sizeShapeSpeedBuffer;
var sizeShapeSpeed;

window.onload = function init() {

    canvas = document.getElementById("canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }

    rgba = [document.getElementById("red"),
        document.getElementById("green"),
        document.getElementById("blue"),
        document.getElementById("alpha")];
    
    auto = false;
    vertices = [];


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

    //sizeShapeSpeed buffer
    sizeShapeSpeedBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeShapeSpeedBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 30000, gl.DYNAMIC_DRAW);

    // Associate our shader variables with our data buffer - sizeShapeSpeed buffer
    sizeShapeSpeed = gl.getAttribLocation(program, "sizeShapeSpeed");
    gl.vertexAttribPointer(sizeShapeSpeed, 1, gl.FLOAT_VEC3, false, 0, 0);
    gl.enableVertexAttribArray(sizeShapeSpeed);

    canvas.addEventListener("click", function (e) {

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
        sizeShapeSpeed[0].push((Math.random() * 100) + 50);

        //sending in the shape
        gl.bindBuffer(gl.ARRAY_BUFFER, shapeBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 4 * nVertices,
            flatten(sizeShapeSpeed[1].value))


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

    sizeShapeSpeed[2][0] += 0.05;

    for (i = 0; i < sizeShapeSpeed[0].length; i++){

        var first = new Date().getTime();

        var sinVal = Math.sin(i + first / (500 * 0.6 + 0.5));

        var s = Math.floor(sizeShapeSpeed[0][i] + 0.60 * sinVal * sizeShapeSpeed[0][i]);
        var t = [s];

        //sending in the size
        gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 4 * i,
            flatten(t));

        //sending in the rotation

        gl.bindBuffer(gl.ARRAY_BUFFER, rotBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 4 * i,
            flatten([rotate]));

    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, vertices.length);
    window.requestAnimationFrame(render);
    bloom();
}
