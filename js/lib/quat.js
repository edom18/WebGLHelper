(function (win, doc, exports) {

    'use strict';

    var sin = Math.sin,
        cos = Math.cos;

    /**
     * Make rotation quat
     * @param {number} w Component of w.
     * @param {number} x Component of x.
     * @param {number} y Component of y.
     * @param {number} z Component of z.
     *
     * quatの中の数値の意味は以下。
     * q = [ cos(θ/2) sin(θ/2)n ] //nはベクトル
     *   = [ cos(θ/2) (sin(θ/2)nx sin(θ/2)ny sin(θ/2)nz ] //ベクトル成分を分解して表記
     */
    function quat(w, x, y, z) {
        return vec4.call(null, arguments);
    }

    /**
     * convert quatuernion to matrix4.
     * @param {Float32Array} qt
     * @param {Float32Array} dest as matrix4
     */
    quat.toMat = function (qt, dest) {

        dest || (dest = mat4());

        var qw, qx, qy, qz;
        var x2, y2, z2;
        var xy, yz, zx;
        var wx, wy, wz;

        qw = qt[0];
        qx = qt[1];
        qy = qt[2];
        qz = qt[3];

        x2 = 2 * qx * qx;
        y2 = 2 * qy * qy;
        z2 = 2 * qz * qz;

        xy = 2 * qx * qy;
        yz = 2 * qy * qz;
        zx = 2 * qz * qx;

        wx = 2 * qw * qx;
        wy = 2 * qw * qy;
        wz = 2 * qw * qz;

        dest[0]  = 1 - y2 - z2;
        dest[4]  = xy - wz;
        dest[8]  = zx + wy;
        dest[12] = 0;

        dest[1]  = xy + wz;
        dest[5]  = 1 - z2 - x2;
        dest[9]  = yz - wx;
        dest[13] = 0;

        dest[2]  = zx - wy;
        dest[6]  = yz + wx;
        dest[10] = 1 - x2 - y2;
        dest[14] = 0;

        dest[3]  = 0;
        dest[7]  = 0;
        dest[11] = 0;
        dest[15] = 1;

        return dest;
    };

    /**
     * Multiply quaternions.
     *
     *  quatの掛け算の公式は以下。
     *  ・は内積、×は外積、U, Vはともにベクトル。
     *  ;の左が実部、右が虚部。基本的に実部は`0`で計算。
     *  A = (a; U) 
     *  B = (b; V) 
     *  AB = (ab - U・V; aV + bU + V×U)
     */
    quat.multiply = function (pq, qq, dest) {
        
        dest || (dest = quat());

        var pqw, pqx, pqy, pqz;
        var qqw, qqx, qqy, qqz;

        pqw = pq[0];
        pqx = pq[1];
        pqy = pq[2];
        pqz = pq[3];

        qqw = qq[0];
        qqx = qq[1];
        qqy = qq[2];
        qqz = qq[3];

        dest[0] = pqw * qqw - pqx * qqx - pqy * qqy - pqz * qqz;
        dest[1] = pqw * qqx + pqx * qqw + pqy * qqz - pqz * qqy;
        dest[2] = pqw * qqy - pqx * qqz + pqy * qqw + pqz * qqx;
        dest[3] = pqw * qqz + pqx * qqy - pqy * qqx + pqz * qqw;

        return dest;
    };

    /**
     * Make a rotation quaternion.
     * @param {number} radian
     * @param {Float32Array} vec
     * @return {Float32Array}
     */
    quat.rotate = function (radian, vec, dest) {

        dest || (dest = quat());

        var hrad = 0.5 * radian;
        var s = sin(hrad);

        dest[0] = cos(hrad);
        dest[1] = s * vec[0];
        dest[2] = s * vec[1];
        dest[3] = s * vec[2];

        return dest;
    };

    /*!--------------------------------------------------
      EXPORTS
    ----------------------------------------------------- */
    exports.quat = quat;

}(window, document, window));
