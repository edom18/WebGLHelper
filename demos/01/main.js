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

    var prg = $gl.setupProgram({
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

    var vbo = $gl.createBuffer($gl.ARRAY_BUFFER, position);
    var ibo = $gl.createBuffer($gl.ELEMENT_ARRAY_BUFFER, indecies);
    var color_vbo = $gl.createBuffer($gl.ARRAY_BUFFER, colors);
    var tex_coord_vbo = $gl.createBuffer($gl.ARRAY_BUFFER, tex_coords);

    var texture = $gl.setupTexture('img/logo.jpg');

    var attLoc = [
        gl.getAttribLocation(prg, 'a_position'),
        gl.getAttribLocation(prg, 'a_color'),
        gl.getAttribLocation(prg, 'a_texCoord')
    ];

    var uniLoc = [
        gl.getUniformLocation(prg, 'u_mvpMatrix'),
        gl.getUniformLocation(prg, 'u_texture'),
        gl.getUniformLocation(prg, 'u_useTexture')
    ];

    gl.enableVertexAttribArray(attLoc[0]);
    gl.enableVertexAttribArray(attLoc[1]);
    gl.enableVertexAttribArray(attLoc[2]);

    var angle = 0;
    var z = 10;

    //プロジェクション変換マトリクスの生成
    var projMatrix = mat4.perspective(60, w / h, 1, 100, mat4());
    var offscreen = $gl.setupFrameBuffer(1024, 1024);

    (function loop() {

        {
            //モデル変換マトリクスを生成
            var modelMatrix = mat4();

            //最終的に使用されるMVP用マトリクスを生成
            var mvpMatrix = mat4();

            //ビュー座標変換マトリクスの生成
            var viewMatrix = mat4.lookAt(vec3(0, 0, z), vec3(0, 0, 0), vec3(0, 1, 0));

            angle = (angle + 1) % 360;

            //モデル回転用クォータニオンを作成
            var qt  = quat.rotate($gl.degToRad(angle), vec3(0, 1, 0));
            var qt2 = quat.rotate($gl.degToRad(angle), vec3(1, 0, 0));

            //クォータニオンを使って回転
            quat.multiply(qt, qt2, qt);
            quat.toMat(qt, modelMatrix);

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
                index: attLoc[0],
                size: 3
            }); 

            //頂点色バッファをバインド
            $gl.setupBuffer({
                buffer: color_vbo,
                index: attLoc[1],
                size: 4
            });

            //頂点テクスチャ座標バッファをバインド
            $gl.setupBuffer({
                buffer: tex_coord_vbo,
                index: attLoc[2],
                size: 2
            });

            //インデックスバッファをバインド
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);


            //最終的なMVPマトリクスをアップロード
            gl.uniformMatrix4fv(uniLoc[0], false, mvpMatrix);
        }

        //オフスクリーンレンダリング
        {
            //テクスチャを使うかどうか
            gl.uniform1i(uniLoc[2], false);

            //オフスクリーンレンダリング用フレームバッファをバインド
            gl.bindFramebuffer(gl.FRAMEBUFFER, offscreen.framebuffer);

            //色をクリア
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            //上記で設定された情報を使ってドロー
            //gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.drawElements(gl.TRIANGLES, indecies.length, gl.UNSIGNED_SHORT, 0);
        }

        //描画用バッファにレンダリング
        {
            //テクスチャを使うかどうか
            gl.uniform1i(uniLoc[2], true);

            //使用するテクスチャをバインド・有効化
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, offscreen.texture);
            gl.uniform1i(uniLoc[1], 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            //色をクリア
            gl.clearColor(1, 1, 1, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            //上記で設定された情報を使ってドロー
            //gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.drawElements(gl.TRIANGLES, indecies.length, gl.UNSIGNED_SHORT, 0);
            gl.flush();
        }

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
