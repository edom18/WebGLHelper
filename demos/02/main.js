(function (win, doc) {

    'use strict';

    var c = doc.getElementById('cv');
    c.width = 500;
    c.height = 300;

    var gl = $gl.getGLContext(cv);

    var eRange = doc.getElementById('range');

    var prg = $gl.setupProgram({
        property: value
    });

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

    //ライトの位置
    var ligthPosition = vec3(-10.0, 10.0, 10.0);
    
    //ライトビューの上方向
    var lightUpDirection = vec3(0.577, 0.577, -0.577);

    //

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
    ligthPosition[1] =  1.0 * r;
    ligthPosition[2] =  1.0 * r;

    //ライトから見たビュー座標変換行列
    tvMatrix = mat4.lookAt(lightPosition, vec3(0, 0, 0), lightUpDirection);

    //ライトから見たプロジェクション座標変換行列
    tpMatrix = mat4.perspective(90, 1.0, 0.1, 150);

    //ライトから見た座標変換行列を掛け合わせる
    mat4.multiply(tMatrix, tpMatrix, tvpMatrix);
    mat4.multiply(tvpMatrix, tvMatrix, tMatrix);


}(window, document));
