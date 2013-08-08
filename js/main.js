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
        vertexShader:   $gl.getShaderSourceFromDOM('vs'),
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
    var normals = [
        0.0, 0.0, 1.0, //v0
        0.0, 0.0, 1.0, //v1
        0.0, 0.0, 1.0, //v2
        0.0, 0.0, 1.0  //v3
    ];

    var indecies = [
        0, 1, 2, 0, 2, 3
    ];

    var vbo = $gl.createBuffer('vbo', position);
    var ibo = $gl.createBuffer('ibo', indecies);
    var color_vbo = $gl.createBuffer('vbo', colors);
    var tex_coord_vbo = $gl.createBuffer('vbo', tex_coords);
    var normal_vbo = $gl.createBuffer('vbo', normals);

    var texture = $gl.createTexture('img/logo.jpg');

    var attLoc = gl.getAttribLocation(prg, 'a_position');
    var attLoc2 = gl.getAttribLocation(prg, 'a_color');
    var attLoc3 = gl.getAttribLocation(prg, 'a_texCoord');
    var attLoc4 = gl.getAttribLocation(prg, 'a_normal');

    var uniLoc = gl.getUniformLocation(prg, 'u_mvMatrix');
    var uniLoc2 = gl.getUniformLocation(prg, 'u_texture');
    var uniLoc3 = gl.getUniformLocation(prg, 'u_lightPosition');
    var uniLoc4 = gl.getUniformLocation(prg, 'u_pMatrix');
    var uniLoc5 = gl.getUniformLocation(prg, 'u_NMatrix');

    gl.enableVertexAttribArray(attLoc);
    gl.enableVertexAttribArray(attLoc2);
    gl.enableVertexAttribArray(attLoc3);
    gl.enableVertexAttribArray(attLoc4);

    var angle = 0;
    var z = 10;
    var light_position = vec3(100, 0, 0);

    //プロジェクション変換マトリクスの生成
    var projMatrix = mat4.perspective(60, w / h, 1, 100);

    (function loop() {

        //モデル変換マトリクスを生成
        var modelMatrix = mat4();

        //モデルビュー行列
        var mvMatrix = mat4();
        
        //法線用マトリクス
        var nMatrix = mat4();

        //ビュー座標変換マトリクスの生成
        var viewMatrix = mat4.lookAt(vec3(0, 0, z), vec3(0, 0, 0), vec3(0, 1, 0));

        angle = (angle + 1) % 360;
        mat4.rotate(modelMatrix, angle, vec3(0, 1, 0), modelMatrix);
        mat4.scale(modelMatrix, vec3(5, 5, 5), modelMatrix);
        mat4.multiply(viewMatrix, modelMatrix, mvMatrix);
        mat4.copy(mvMatrix, nMatrix);
        mat4.transpose(mat4.inverse(nMatrix, nMatrix));

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

        //頂点の法線情報をバインド
        gl.bindBuffer(gl.ARRAY_BUFFER, normal_vbo);
        gl.vertexAttribPointer(attLoc4, 3, gl.FLOAT, false, 0, 0);

        //インデックスバッファをバインド
        //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

        //使用するテクスチャをバインド・有効化
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(uniLoc2, texture);

        //プロジェクションマトリクスをアップロード
        gl.uniformMatrix4fv(uniLoc4, false, projMatrix);

        //モデルビューマトリクスをアップロード
        gl.uniformMatrix4fv(uniLoc, false, mvMatrix);

        //法線用マトリクスをアップロード
        gl.uniformMatrix4fv(uniLoc5, false, nMatrix);

        //ライトの位置をアップロード
        gl.uniform3fv(uniLoc3, light_position);

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
