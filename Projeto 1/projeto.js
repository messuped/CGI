/*
  1º Projeto CGI
  Autor: Eduardo Bezerra Subtil - 48492
*/

var canvas;
var rgba;
var vertices;
var auto;
var pointsBuffer;
var colorBuffer;
var sizeShapeSpeedBuffer;
var sSS;
var shape;

window.onload = function init() {

    canvas = document.getElementById("canvas");
    gl = WebGLUtils.setupWebGL(canvas);

    if(!gl) { alert("WebGL isn't available"); }

    rgba = [document.getElementById("red"),
        document.getElementById("green"),
        document.getElementById("blue"),
        document.getElementById("alpha")];

    shape = document.getElementById("shapes");

    clearScreen();

    canvas.addEventListener("click", function (e) {

        var x = -1 + (2*e.offsetX/canvas.width);
        var y = -1 + (2*(canvas.height - e.offsetY)/canvas.height);

        vertices.push(vec2(x, y));

        //sending in the vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2'] * (vertices.length - 1) ,
            flatten(vec2(x, y)));

        //sending in the colors
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4'] * (vertices.length - 1),
            flatten(vec4(rgba[0].value, rgba[1].value, rgba[2].value, rgba[3].value)));


        //setting up the vec3
        vSS.push([(Math.random() * 100) + 50, shape.value, Math.random() - 0.5]);

        //sending in the size as 0, shape and speed as is
        gl.bindBuffer(gl.ARRAY_BUFFER, sizeShapeSpeedBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec3'] * (vertices.length - 1),
            flatten(vec3(0.0, vSS[vertices.length - 1][1], vSS[vertices.length - 1][2])));

    });

    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    render();
}

function changeColors(){
    document.getElementById("preview").style.backgroundColor = "rgba("
        + Math.floor(255 * rgba[0].value) + ","
        + Math.floor(255 * rgba[1].value) + ","
        + Math.floor(255 * rgba[2].value) + ","
        + rgba[3].value + ")";
}

function simulateClick() {
    if (auto) {
        var x = Math.random() * canvas.width;
        var y = Math.random() * canvas.height;

        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent(
            'click', true, true, window, 0,
            0, 0, x, y, false, false,
            false, false, 0, null
        );
        document.elementFromPoint(x, y).dispatchEvent(clickEvent);
    }
}

function toggleAutoMode(){
    auto = !auto;

    var active = setInterval(simulateClick, 2000);

}

function clearScreen(){
    auto = false;
    vertices = [];
    vSS = [];


    // Configure WebGL
    gl.viewport(0, 0,canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //points buffer
    pointsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 30000, gl.DYNAMIC_DRAW);

    // Associate our shader variables with our data buffer - points buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //color buffer
    colorBuffer = gl.createBuffer();
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
    gl.vertexAttribPointer(sizeShapeSpeed, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(sizeShapeSpeed);
}

function bloom(){

    for (i = 0; i < vSS.length; i++){

        var first = new Date().getTime();

        var sinVal = Math.sin(i + first / (500 * 0.6 + 0.5));

        var s = Math.floor(vSS[i][0] + 0.60 * sinVal * vSS[i][0]);

        //increasing theta angle
        vSS[i][2] += 0.1 * (Math.random() + 1.0) * Math.sign(vSS[i][2]);

        //sending in the size, shape and speed
        gl.bindBuffer(gl.ARRAY_BUFFER, sizeShapeSpeedBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec3'] * i,
            flatten(vec3(s, vSS[i][1], vSS[i][2])));
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, vertices.length);
    window.requestAnimationFrame(render);
    bloom();
}
