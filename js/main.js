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
    var tex_coords = [
            0.5, 1.0, //v0
            0.0, 0.0, //v1
            1.0, 1.0  //v2
        ];

    var vbo = $gl.createBuffer('vbo', indecies);
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
    //ビュー座標変換マトリクスの生成
    var viewMatrix = mat4.lookAt(vec3(0, 0, 10), vec3(0, 0, 0), vec3(0, 1, 0), mat4());

    //プロジェクション変換マトリクスの生成
    var projMatrix = mat4.perspective(60, w / h, 1, 100, mat4());

    (function loop() {

        //モデル変換マトリクスを生成
        var modelMatrix = mat4();

        //最終的に使用されるMVP用マトリクスを生成
        var mvpMatrix   = mat4();

        angle = (angle + 1) % 360;
        mat4.rotate(modelMatrix, angle, vec3(0, 1, 0), modelMatrix);
        mat4.multiply(projMatrix, viewMatrix, mvpMatrix);
        mat4.multiply(mvpMatrix, modelMatrix, mvpMatrix);

        /*! ----------------------------------------------------------------------------------
         * draw**を呼び出す前に、そのdrawメソッドで使用するバッファ、
         * テクスチャなどをすべて有効化、バインドしておく。
         * ---------------------------------------------------------------------------------- */

        //頂点位置バッファをバインド
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.vertexAttribPointer(attLoc, 3, gl.FLOAT, false, 0, 0);

        //頂点色バッファをバインド
        gl.bindBuffer(gl.ARRAY_BUFFER, color_vbo);
        gl.vertexAttribPointer(attLoc2, 4, gl.FLOAT, false, 0, 0);

        //頂点テクスチャ座標バッファをバインド
        gl.bindBuffer(gl.ARRAY_BUFFER, tex_coord_vbo);
        gl.vertexAttribPointer(attLoc3, 2, gl.FLOAT, false, 0, 0);

        //使用するテクスチャをバインド・有効化
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(uniLoc2, texture);

        //最終的なMVPマトリクスをアップロード
        gl.uniformMatrix4fv(uniLoc, false, mvpMatrix);

        //色をクリア
        gl.clear(gl.COLOR_BUFFER_BIT);

        //上記で設定された情報を使ってドロー
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.flush();

        //アニメーションを実行するためにループ呼び出し
        requestAnimationFrame(loop);
    }());

}(window, document));
