(function (win, doc, exports) {

    'use strict';

    var sqrt = Math.sqrt;

    /**
     * vec3
     * @param {number|Array.<number>} x Position of x.
     * @param {?number} y Position of y.
     * @param {?number} z Position of z.
     */
    function vec3(x, y, z) {
        return vec3.create(x, y, z);
    }

    /**
     * Check to equal values.
     * @param {vec3} v
     */
    vec3.equal = function(v1, v2) {
        var v1x = v1[0],
            v1y = v1[1],
            v1z = v1[2],

            v2x = v2[0],
            v2y = v2[1],
            v2z = v2[2];

        return (v1x === v2x) && (v1y === v2y) && (v1z === v2z);
    };

    /**
     * Create values to x,y,z
     * @param {number|Array.<number>} x Position of x.
     * @param {?number} y Position of y.
     * @param {?number} z Position of z.
     */
    vec3.create = function(x, y, z) {

        var elements = [];

        if (Array.isArray(x)) {
            elements = x;
        }
        else if (x === undefined) {
            elements = [0, 0, 0];
        }
        else if (y === undefined) {
            elements = [x, x, x];
        }
        else if (z === undefined) {
            elements = [x, y, 0];
        }
        else {
            elements = [x, y, z];
        }

        return new Float32Array(elements);
    };


    /**
     * Sub vectors
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec3.sub = function(v1, v2, dest) {
        dest[0] = v1[0] - v2[0];
        dest[1] = v1[1] - v2[1];
        dest[2] = v1[2] - v2[2];
        return dest;
    };

    /**
     * Add vectors
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec3.add = function(v1, v2, dest) {
        dest[0] = v1[0] + v2[0];
        dest[1] = v1[1] + v2[1];
        dest[2] = v1[2] + v2[2];
        return dest;
    };

    /**
     * Copy vector.
     * @param {Float32Array} v1
     * @param {Float32Array} dest
     */
    vec3.copy = function(v, dest) {
        dest[0] = v[0];
        dest[1] = v[1];
        dest[2] = v[2];
        return dest;
    };

    /**
     * Calc norm from vector.
     * @param {Float32Array} v
     */
    vec3.norm = function(v) {
        var x = v[0], y = v[1], z = v[2];
        return sqrt(x * x + y * y + z * z);
    };

    /**
     * Normalized vector
     * @param {Float32Array} v
     */
    vec3.normalize = function(v) {
        var nrm = vec3.norm(v);

        if (nrm !== 0) {
            nrm = 1 / nrm;
            v[0] *= nrm;
            v[1] *= nrm;
            v[2] *= nrm;
        }

        return v;
    };

    /**
     * Multiply vectors.
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec3.multiply = function(v1, v2, dest) {
        dest[0] = v1[0] * v2[0];
        dest[1] = v1[1] * v2[1];
        dest[2] = v1[2] * v2[2];
        return dest;
    };

    /**
     * Multiple scalar
     * @param {Float32Array} v
     * @param {number} s
     * @param {Float32Array} dest
     */
    vec3.multiplyScalar = function(v, s, dest) {
        dest[0] = v[0] * s;
        dest[1] = v[1] * s;
        dest[2] = v[2] * s;
        return dest;
    };

    /**
     * Calc dot
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     */
    vec3.dot = function(v1, v2) {

        var v1x = v1[0],
            v1y = v1[1],
            v1z = v1[2],

            v2x = v2[0],
            v2y = v2[1],
            v2z = v2[2];

        return v1x * v2x + v1y * v2y + v1z * v2z;
    };

    /**
     * Calc cross
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec3.cross = function(v1, v2, dest) {

        var v1x = v1[0],
            v1y = v1[1],
            v1z = v1[2],

            v2x = v2[0],
            v2y = v2[1],
            v2z = v2[2];

        dest[0] = (v2y * v1z) - (v2z * v1y);
        dest[1] = (v2z * v1x) - (v2x * v1z);
        dest[2] = (v2x * v1y) - (v2y * v1x);

        return dest;
    };

    /**
     * Applay matrix for the vector.
     * @param {Float32Array} v
     * @param {Float32Array} mat
     * @param {Float32Array} dest
     */
    vec3.applyMatrix4 = function(v, mat, dest) {

        var x = v[0],
            y = v[1],
            z = v[2];

        dest[0] = mat[0] * x + mat[4] * y + mat[8]  * z + mat[12];
        dest[1] = mat[1] * x + mat[5] * y + mat[9]  * z + mat[13];
        dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];

        return dest;
    };

    /**
     * 射影投影座標変換
     *
     * 計算された座標変換行列をスクリーンの座標系に変換するために計算する
     * 基本はスケーリング（&Y軸反転）と平行移動。
     * 行列で表すと
     * w = width  / 2
     * h = height / 2
     * とすると
     *             |w  0  0  0|
     * M(screen) = |0 -h  0  0|
     *             |0  0  1  0|
     *             |w  h  0  1|
     *
     * 4x4の変換行列を対象の1x4行列[x, y, z, 1]に適用する
     * 1x4行列と4x4行列の掛け算を行う
     *
     * |@_11 @_12 @_13 @_14|   |x|
     * |@_21 @_22 @_23 @_24| x |y|
     * |@_31 @_32 @_33 @_34|   |z|
     * |@_41 @_42 @_43 @_44|   |1|
     *
     * @_4nは1x4行列の最後が1のため、ただ足すだけになる
     *
     * @param {Float32Array} v
     * @param {Float32Array} mat
     * @param {Array} dest
     */
    vec3.applyProjection = function(v, mat, dest) {

        var w, x, y, z, _w, _x, _y, _z;

        x = v[0];
        y = v[1];
        z = v[2];

         w = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];

        //wで除算するため、予め割った値を入れておく
        _w = 1 / w;

        _x = mat[0] * x + mat[4] * y + mat[8]  * z + mat[12] /* (* 1)のため省略 */;
        _y = mat[1] * x + mat[5] * y + mat[9]  * z + mat[13] /* (* 1)のため省略 */;
        _z = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] /* (* 1)のため省略 */;

        if (!(((-w <= _x && _x <= w)) || ((-w <= _y && _y <= w)) || ((-w <= _z && _z <= w)))) {
            return false;
        }

        v[0] = _x * _w;
        v[1] = _y * _w;
        v[2] = _z * _w;
        
        dest[0] = v;
        dest[1] = w;

        return dest;
    };

    /**
     * To string vector.
     * @param {Float32Array} v
     * @return {string}
     */
    vec3.toString = function(v) {
        return '' + v[0] + ',' + v[1] + ',' + v[2];
    };

    /*!--------------------------------------------------
      EXPORTS
      ----------------------------------------------------- */
    exports.vec3 = vec3;

}(window, document, window));
