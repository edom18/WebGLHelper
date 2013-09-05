(function (win, doc) {

    'use strict';

    var c = doc.getElementById('cv');
    c.width = 500;
    c.height = 300;

    var gl = $gl.getGLContext(cv);

    var eRange = doc.getElementById('range');

    var prg = $gl.setupProgram({
        vertexShader: $gl.getShaderSourceFromDOM('vs'),
        fragmentShader: $gl.getShaderSourceFromDOM('fs')
    });

    var attLoc = [
        gl.getAttribLocation(prg, 'position'),
        gl.getAttribLocation(prg, 'normal'),
        gl.getAttribLocation(prg, 'color')
    ];

    var attSize = [ 3, 3, 4 ];

    // 板ポリゴン
    var position = [
        -1.0,  0.0, -1.0,
         1.0,  0.0, -1.0,
        -1.0,  0.0,  1.0,
         1.0,  0.0,  1.0
    ];
    var normal = [
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0
    ];
    var color = [
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0
    ];
    var index = [
        0, 1, 2,
        3, 2, 1
    ];

    var vPosition = $gl.createBuffer($gl.ARRAY_BUFFER, position);
    var vNormal = $gl.createBuffer($gl.ARRAY_BUFFER, normal);
    var vColor  = $gl.createBuffer($gl.ARRAY_BUFFER, color);
    var vIndex  = $gl.createBuffer($gl.ELEMENT_ARRAY_BUFFER, index);

    var uniLoc = [
        gl.getUniformLocation(prg, 'mMatrix'),
        gl.getUniformLocation(prg, 'tMatrix'),
        gl.getUniformLocation(prg, 'mvpMatrix'),
        gl.getUniformLocation(prg, 'invMatrix'),
        gl.getUniformLocation(prg, 'lightPosition'),
        gl.getUniformLocation(prg, 'texture')
    ];

    var mMatrix   = mat4();
    var vMatrix   = mat4();
    var pMatrix   = mat4();
    var tmpMatrix = mat4();
    var mvpMatrix = mat4();
    var invMatrix = mat4();
    var tMatrix   = mat4();
    var tvMatrix  = mat4();
    var tpMatrix  = mat4();
    var tvpMatrix = mat4();

    //テクスチャ関連
    var texture = $gl.setupTexture('texture.jpg');
    gl.activeTexture(gl.TEXTURE0);

    //ライトの位置
    var lightPosition = vec3(-10.0, 10.0, 10.0);
    
    //ライトビューの上方向
    var lightUpDirection = vec3(0.577, 0.577, -0.577);

    var count = 0;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    (function loop() {
        //canvasを初期化
        gl.clearColor(0.0, 0.7, 0.7, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        count++;

        var eyePosition = vec3();
        var camUpDirection = vec3();
        quat.toVec3(vec3(0.0, 0.0, 70.0), quat(), eyePosition);
        quat.toVec3(vec3(0.0, 1.0, 0.0), quat(), camUpDirection);
        vMatrix = mat4.lookAt(eyePosition, vec3(0, 0, 0), camUpDirection);
        pMatrix = mat4.perspective(45, c.width / c.height, 0.1, 150);
        mat4.multiply(pMatrix, vMatrix, tmpMatrix);

        //テクスチャのバインド
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        //テクスチャ変換用行列
        tMatrix = mat4([
            0.5,  0.0, 0.0, 0.0,
            0.0, -0.5, 0.0, 0.0,
            0.0,  0.0, 1.0, 0.0,
            0.5,  0.5, 0.0, 1.0
        ]);

        //ライトの距離をエレメントの値に応じて調整
        var r = eRange.value / 5.0;
        lightPosition[0] = -1.0 * r;
        lightPosition[1] =  1.0 * r;
        lightPosition[2] =  1.0 * r;

        //ライトから見たビュー座標変換行列
        tvMatrix = mat4.lookAt(lightPosition, vec3(0, 0, 0), lightUpDirection);

        //ライトから見たプロジェクション座標変換行列
        tpMatrix = mat4.perspective(90, 1.0, 0.1, 150);

        //ライトから見た座標変換行列を掛け合わせる
        mat4.multiply(tMatrix, tpMatrix, tvpMatrix);
        mat4.multiply(tvpMatrix, tvMatrix, tMatrix);

        //板ポリゴンの描画（底面）
        $gl.setupBuffer({
            buffer: vPosition,
            index: attLoc[0],
            size: attSize[0]
        });

        $gl.setupBuffer({
            buffer: vNormal,
            index: attLoc[1],
            size: attSize[1]
        });

        $gl.setupBuffer({
            buffer: vColor,
            index: attLoc[2],
            size: attSize[2]
        });

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndex);

        mat4.identity(mMatrix);
        mat4.translate(mMatrix, vec3(0.0, -10.0, 0.0), mMatrix);
        mat4.scale(mMatrix, vec3(20.0, 0.0, 20.0), mMatrix);
        mat4.multiply(tmpMatrix, mMatrix, mvpMatrix);
        mat4.inverse(mMatrix, invMatrix);
        gl.uniformMatrix4fv(uniLoc[0], false, mMatrix);
        gl.uniformMatrix4fv(uniLoc[1], false, mvpMatrix);
        gl.uniformMatrix4fv(uniLoc[2], false, invMatrix);
        gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);

        //板ポリゴンの描画（奥面）
        mat4.identity(mMatrix);
        mat4.translate(mMatrix, vec3(0.0, 10.0, -20.0), mMatrix);
        mat4.rotate(mMatrix, $gl.degToRad(90), vec3(1, 0, 0), mMatrix);
        mat4.scale(mMatrix, vec3(20.0, 0.0, 20.0), mMatrix);
        mat4.multiply(tmpMatrix, mMatrix, mvpMatrix);
        mat4.inverse(mMatrix, invMatrix);
        gl.uniformMatrix4fv(uniLoc[0], false, mMatrix);
        gl.uniformMatrix4fv(uniLoc[1], false, mvpMatrix);
        gl.uniformMatrix4fv(uniLoc[2], false, invMatrix);
        gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);

        //板ポリゴンの描画（右脇面）
        mat4.identity(mMatrix);
        mat4.translate(mMatrix, vec3(20.0, 10.0, 0.0), mMatrix);
        mat4.rotate(mMatrix, $gl.degToRad(90), vec3(0, 0, 1), mMatrix);
        mat4.scale(mMatrix, vec3(20.0, 0.0, 20.0), mMatrix);
        mat4.multiply(tmpMatrix, mMatrix, mvpMatrix);
        mat4.inverse(mMatrix, invMatrix);
        gl.uniformMatrix4fv(uniLoc[0], false, mMatrix);
        gl.uniformMatrix4fv(uniLoc[1], false, mvpMatrix);
        gl.uniformMatrix4fv(uniLoc[2], false, invMatrix);
        gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);

        //コンテキストの再描画
        gl.flush();

        requestAnimFrame(loop);
    }());

}(window, document));
