(function (win, doc, exports) {

    'use strict';

    var PI   = Math.PI,
        sqrt = Math.sqrt,
        acos = Math.acos;

    /**
     * vec2
     * @param {number|Array.<number>} x Position of x.
     * @param {?number} y Position of y.
     */
    function vec2(x, y) {
        return vec2.create(x, y);
    }

    /**
     * Check to equal values.
     * @param {vec2} v
     */
    vec2.equal = function(v1, v2) {
        var v1x = v1[0],
            v1y = v1[1],

            v2x = v2[0],
            v2y = v2[1];

        return (v1x === v2x) && (v1y === v2y);
    };

    /**
     * Create values to x,y,z
     * @param {number|Array.<number>} x Position of x.
     * @param {?number} y Position of y.
     */
    vec2.create = function(x, y) {

        var elements = [];

        if (Array.isArray(x)) {
            elements = new Float32Array(x);
        }
        else if (x === undefined) {
            elements = [0, 0];
        }
        else if (y === undefined) {
            elements = [x, x];
        }
        else {
            elements = [x, y];
        }

        return new Float32Array(elements);
    };


    /**
     * Sub vectors
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec2.sub = function(v1, v2, dest) {

        dest || (dest = vec2());

        dest[0] = v1[0] - v2[0];
        dest[1] = v1[1] - v2[1];

        return dest;
    };

    /**
     * Add vectors
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec2.add = function(v1, v2, dest) {

        dest || (dest = vec2());

        dest[0] = v1[0] + v2[0];
        dest[1] = v1[1] + v2[1];

        return dest;
    };

    /**
     * Copy vector.
     * @param {Float32Array} v1
     * @param {Float32Array} dest
     */
    vec2.copy = function(v, dest) {

        dest || (dest = vec2());

        dest[0] = v[0];
        dest[1] = v[1];

        return dest;
    };

    /**
     * Calc norm from vector.
     * @param {Float32Array} v
     */
    vec2.norm = function(v) {
        var x = v[0], y = v[1];
        return sqrt(x * x + y * y);
    };

    /**
     * Normalized vector
     * @param {Float32Array} v
     */
    vec2.normalize = function(v) {
        var nrm = vec2.norm(v);

        if (nrm !== 0) {
            nrm = 1 / nrm;
            v[0] *= nrm;
            v[1] *= nrm;
        }

        return v;
    };

    /**
     * Multiply vectors.
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     * @param {Float32Array} dest
     */
    vec2.multiply = function(v1, v2, dest) {

        dest || (dest = vec2());

        dest[0] = v1[0] * v2[0];
        dest[1] = v1[1] * v2[1];

        return dest;
    };

    /**
     * Multiple scalar
     * @param {Float32Array} v
     * @param {number} s
     * @param {Float32Array} dest
     */
    vec2.multiplyScalar = function(v, s, dest) {

        dest || (dest = vec2());

        dest[0] = v[0] * s;
        dest[1] = v[1] * s;

        return dest;
    };

    /**
     * Calc dot
     * @param {Float32Array} v1
     * @param {Float32Array} v2
     */
    vec2.dot = function(v1, v2) {

        var v1x = v1[0],
            v1y = v1[1],

            v2x = v2[0],
            v2y = v2[1];

        return v1x * v2x + v1y * v2y;
    };

    /**
     * @param {Float32Array} from
     * @param {Float32Array} to
     * @return {number} angle number as radian.
     */
    vec2.lookAtRad = function (from, to) {

        var sub = vec2.normalize(vec2.sub(to, from));
        var fromCopy = vec2.normalize(vec2.copy(from));
        var rad = vec2.dot(sub, fromCopy);

        return acos(rad);
    };

    /**
     * @param {Float32Array} from
     * @param {Float32Array} to
     * @return {number} angle number as degrees.
     */
    vec2.lookAtDeg = function (from, to) {
        var rad = vec2.lookAtRad(from, to);
        return rad * 180 / PI;
    };

    /**
     * To string vector.
     * @param {Float32Array} v
     * @return {string}
     */
    vec2.toString = function(v) {
        return '' + v[0] + ',' + v[1];
    };

    Object.defineProperty(vec2, 'zero', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec2(0, 0); }
    });

    Object.defineProperty(vec2, 'up', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec2(0, 1); }
    });

    Object.defineProperty(vec2, 'down', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec2(0, -1); }
    });

    Object.defineProperty(vec2, 'right', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec2(1, 0); }
    });

    Object.defineProperty(vec2, 'left', {
        enumerable: true,
        set: function (x) {},
        get: function () { return vec2(-1, 0); }
    });

    /*!--------------------------------------------------
      EXPORTS
      ----------------------------------------------------- */
    exports.vec2 = vec2;

}(window, document, window));
