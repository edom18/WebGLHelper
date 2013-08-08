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

    var prg = $gl.createProgramWithShader({
        vertexShader: $gl.getShaderSourceFromDOM('vs'),
        fragmentShader: $gl.getShaderSourceFromDOM('fs') 
    });

    var position = [
        -1.0,  1.0, 0.0, //v0
        -1.0, -1.0, 0.0, //v1
         1.0, -1.0, 0.0, //v2
         1.0,  1.0, 0.0  //v3
    ];
    var colors = [
        1.0, 0.0, 0.0, 1.0, //v0
        0.0, 1.0, 0.0, 1.0, //v1
        0.0, 0.0, 1.0, 1.0, //v2
        1.0, 0.0, 0.0, 1.0  //v3
    ];
    var tex_coords = [
        0.0, 0.0, //v0
        0.0, 1.0, //v1
        1.0, 1.0, //v2
        1.0, 0.0  //v0
    ];

    var indecies = [
        0, 1, 2, 0, 2, 3
    ];

    var vbo = $gl.createBuffer('vbo', position);
    var ibo = $gl.createBuffer('ibo', indecies);
    var color_vbo = $gl.createBuffer('vbo', colors);
    var tex_coord_vbo = $gl.createBuffer('vbo', tex_coords);

    var texture = $gl.createTexture('img/logo.jpg');

    var attLoc = gl.getAttribLocation(prg, 'a_position');
    var attLoc2 = gl.getAttribLocation(prg, 'a_color');
    var attLoc3 = gl.getAttribLocation(prg, 'a_texCoord');

    var uniLoc = gl.getUniformLocation(prg, 'u_mvpMatrix');
    var uniLoc2 = gl.getUniformLocation(prg, 'u_texture');

    gl.enableVertexAttribArray(attLoc);
    gl.enableVertexAttribArray(attLoc2);
    gl.enableVertexAttribArray(attLoc3);

    var angle = 0;
    var z = 10;

    //プロジェクション変換マトリクスの生成
    var projMatrix = mat4.perspective(60, w / h, 1, 100, mat4());

    (function loop() {

        //モデル変換マトリクスを生成
        var modelMatrix = mat4();

        //最終的に使用されるMVP用マトリクスを生成
        var mvpMatrix   = mat4();

        //ビュー座標変換マトリクスの生成
        var viewMatrix = mat4.lookAt(vec3(0, 0, z), vec3(0, 0, 0), vec3(0, 1, 0), mat4());

        angle = (angle + 1) % 360;
        mat4.rotate(modelMatrix, angle, vec3(0, 1, 0), modelMatrix);
        mat4.scale(modelMatrix, vec3(5, 5, 5), modelMatrix);
        mat4.multiply(projMatrix, viewMatrix, mvpMatrix);
        mat4.multiply(mvpMatrix, modelMatrix, mvpMatrix);

        /*! ----------------------------------------------------------------------------------
         * draw**を呼び出す前に、そのdrawメソッドで使用するバッファ、
         * テクスチャなどをすべて有効化、バインドしておく。
         * ---------------------------------------------------------------------------------- */

        //頂点位置バッファをバインド
        $gl.setupBuffer({
            buffer: vbo,
            index: attLoc,
            size: 3,
            type: $gl.ARRAY_BUFFER
        }); 

        //頂点色バッファをバインド
        $gl.setupBuffer({
            buffer: color_vbo,
            index: attLoc2,
            size: 4,
            type: $gl.ARRAY_BUFFER
        });

        //頂点テクスチャ座標バッファをバインド
        $gl.setupBuffer({
            buffer: tex_coord_vbo,
            index: attLoc3,
            size: 2,
            type: $gl.ARRAY_BUFFER
        });

        //インデックスバッファをバインド
        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

        //使用するテクスチャをバインド・有効化
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(uniLoc2, texture);

        //最終的なMVPマトリクスをアップロード
        gl.uniformMatrix4fv(uniLoc, false, mvpMatrix);

        //色をクリア
        gl.clear(gl.COLOR_BUFFER_BIT);

        //上記で設定された情報を使ってドロー
        //gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.drawElements(gl.TRIANGLES, indecies.length, gl.UNSIGNED_SHORT, 0);
        gl.flush();

        //アニメーションを実行するためにループ呼び出し
        requestAnimFrame(loop);
    }());

    doc.addEventListener('mousewheel', function (e) {
        z += e.wheelDelta / 100;
    }, false);

    doc.addEventListener('DOMMouseScroll', function (e) {
        z += e.detail / 10;
    }, false);

}(window, document));
