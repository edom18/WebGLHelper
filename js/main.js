(function (win, doc) {

    'use strict';

    var cv = doc.getElementById('cv'),
        gl = $gl.getGLContext(cv),
        w = win.innerWidth,
        h = win.innerHeight;

    cv.width = w;
    cv.height = h;

    $gl.setViewport(0, 0, w, h);
    $gl.setClearColor(0.0, 0.0, 0.0, 1.0);

    var v_shader = $gl.getShaderSourceFromDOM('vs');
    var f_shader = $gl.getShaderSourceFromDOM('fs');
    var vs = $gl.createShader('vertex', v_shader);
    var fs = $gl.createShader('fragment', f_shader);
    var prg = $gl.createProgram(vs, fs);
    var indecies = [
        -0.5, -0.5, 0.0, //v0
         0.0,  0.5, 0.0, //v1
         0.5, -0.5, 0.0  //v2
    ];
    var colors = [
        1.0, 0.0, 0.0, 1.0, //v0
        0.0, 1.0, 0.0, 1.0, //v1
        0.0, 0.0, 1.0, 1.0  //v2
    ];
    var vbo = $gl.createBuffer('vbo', indecies);
    var color_vbo = $gl.createBuffer('vbo', colors);

    var attLoc = gl.getAttribLocation(prg, 'a_position');
    var attLoc2 = gl.getAttribLocation(prg, 'a_color');

    var viewMatrix = mat4();

    gl.enableVertexAttribArray(attLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.vertexAttribPointer(attLoc, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(attLoc2);
    gl.bindBuffer(gl.ARRAY_BUFFER, color_vbo);
    gl.vertexAttribPointer(attLoc2, 4, gl.FLOAT, false, 0, 0);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

}(window, document));
