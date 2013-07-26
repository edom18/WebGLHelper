(function () {

    var assert = require("assert");

    describe('mat4テスト', function () {
        it('mat4()はidentity化された4x4行列を生成する', function () {
            var mat1 = mat4();
            var mat2 = mat4.identity(mat4.create());
            assert.equal(true, mat4.equal(mat1, mat2));
        });

        it('copy()で行列をコピーできる', function () {
            var mat1 = mat4();
            var mat2 = mat4();
            mat4.translate(mat1, vec3(10, 10, 10), mat1);
            mat4.copy(mat1, mat2);
            assert.equal(true, mat4.equal(mat1, mat2));
            assert.equal(true, mat1 !== mat2);
        });

        it('multiplyで行列の掛け算ができる', function () {
            var mat1 = mat4([
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, 15, 16
                ]);
            var mat2 = mat4([
                    10, 20, 30, 40,
                    50, 60, 70, 80,
                    90, 100, 110, 120,
                    130, 140, 150, 160
                ]);
            var mat3 = mat4();

            mat4.multiply(mat1, mat2, mat3);
            assert.equal((1 * 10  + 5 * 20  + 9  * 30  + 13 * 40), mat3[0]);
            assert.equal((1 * 50  + 5 * 60  + 9  * 70  + 13 * 80), mat3[4]);
            assert.equal((1 * 90  + 5 * 100 + 9  * 110 + 13 * 120), mat3[8]);
            assert.equal((1 * 130 + 5 * 140 + 9  * 150 + 13 * 160), mat3[12]);
            assert.equal((2 * 10  + 6 * 20  + 10 * 30  + 14 * 40), mat3[1]);
            assert.equal((2 * 50  + 6 * 60  + 10 * 70  + 14 * 80), mat3[5]);
            assert.equal((2 * 90  + 6 * 100 + 10 * 110 + 14 * 120), mat3[9]);
            assert.equal((2 * 130 + 6 * 140 + 10 * 150 + 14 * 160), mat3[13]);
            assert.equal((3 * 10  + 7 * 20  + 11 * 30  + 15 * 40), mat3[2]);
            assert.equal((3 * 50  + 7 * 60  + 11 * 70  + 15 * 80), mat3[6]);
            assert.equal((3 * 90  + 7 * 100 + 11 * 110 + 15 * 120), mat3[10]);
            assert.equal((3 * 130 + 7 * 140 + 11 * 150 + 15 * 160), mat3[14]);
            assert.equal((4 * 10  + 8 * 20  + 12 * 30  + 16 * 40), mat3[3]);
            assert.equal((4 * 50  + 8 * 60  + 12 * 70  + 16 * 80), mat3[7]);
            assert.equal((4 * 90  + 8 * 100 + 12 * 110 + 16 * 120), mat3[11]);
            assert.equal((4 * 130 + 8 * 140 + 12 * 150 + 16 * 160), mat3[15]);
        });
    });

    describe('vec3テスト', function () {
        it('vec3()は引数なしはすべて0で初期化される', function () {
            var v = vec3();
            assert.equal(0, v[0]);
            assert.equal(0, v[1]);
            assert.equal(0, v[2]);
        });

        it('vec3()は引数ひとつですべて同じ数字で初期化される', function () {
            var v = vec3(2);
            assert.equal(2, v[0]);
            assert.equal(2, v[1]);
            assert.equal(2, v[2]);
        });

        it('vec3()は引数ふたつでx, yをそれに、zを0で初期化する', function () {
            var v = vec3(2, 3);
            assert.equal(2, v[0]);
            assert.equal(3, v[1]);
            assert.equal(0, v[2]);
        });

        it('vec3()は引数みっつでx, y, zをそれぞれその値で初期化する', function () {
            var v = vec3(2, 3, 4);
            assert.equal(2, v[0]);
            assert.equal(3, v[1]);
            assert.equal(4, v[2]);
        });

        it('vec3()に配列を渡すとそれで初期化する', function () {
            var v = vec3([2, 3, 4]);
            assert.equal(2, v[0]);
            assert.equal(3, v[1]);
            assert.equal(4, v[2]);
        });
    });

    describe('vec4テスト', function () {
        it('vec4()は引数なしはすべて0で初期化される', function () {
            var v = vec4();
            assert.equal(0, v[0]);
            assert.equal(0, v[1]);
            assert.equal(0, v[2]);
            assert.equal(0, v[3]);
        });

        it('vec4()は引数ひとつですべて同じ数字で初期化される', function () {
            var v = vec4(2);
            assert.equal(2, v[0]);
            assert.equal(2, v[1]);
            assert.equal(2, v[2]);
            assert.equal(2, v[3]);
        });

        it('vec4()は引数ふたつでx, yをそれに、z, wを0で初期化する', function () {
            var v = vec4(2, 3);
            assert.equal(2, v[0]);
            assert.equal(3, v[1]);
            assert.equal(0, v[2]);
            assert.equal(0, v[3]);
        });

        it('vec4()は引数みっつでx, y, zをそれぞれその値で、wを0で初期化する', function () {
            var v = vec4(2, 3, 4);
            assert.equal(2, v[0]);
            assert.equal(3, v[1]);
            assert.equal(4, v[2]);
            assert.equal(0, v[3]);
        });

        it('vec4()に配列を渡すとそれで初期化する', function () {
            var v = vec4([2, 3, 4, 5]);
            assert.equal(2, v[0]);
            assert.equal(3, v[1]);
            assert.equal(4, v[2]);
            assert.equal(5, v[3]);
        });
    });

}());
