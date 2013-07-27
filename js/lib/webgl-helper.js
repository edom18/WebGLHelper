(function (win, doc, exports) {

    'use strict';

    var gl,
        loading_image_queue = [];

    var WebGLHelper = {

        /**
         * Set parameters to the gl viewport.
         * @param {number} x
         * @param {number} y
         * @param {number} w
         * @param {number} h
         */
        setViewport: function (x, y, w, h) {
            gl.viewport(x, y, w, h);
        },

        /**
         * Set parameters to the gl clear color.
         * @param {number} r
         * @param {number} g
         * @param {number} b
         * @param {number} a
         */
        setClearColor: function (r, g, b, a) {
            gl.clearColor(r, g, b, a);
        },

        /**
         * Set a WebGL context.
         * @param {WebGLContext}
         */
        setGLContext: function (context) {
            gl = context;
        },

        /**
         * Get the current WebGL context.
         * @return {WebGLContext}
         */
        getCurrentContext: function () {
            return gl;
        },

        /**
         * Get shader source from DOM text
         * @param {string} id
         * @return {string} DOM's inner html.
         */
        getShaderSourceFromDOM: function (id) {
            var dom = doc.getElementById(id);

            if (!dom) {
                return null;
            }

            return dom.innerHTML;
        },

        /**
         * Get a WebGL context
         * @param {CanvasElement} canvas
         * @return {WebGLContext}
         */
        getGLContext: function (canvas) {

            var context,
                names = ['webgl', 'experimental-webgl'];

            if (!canvas.getContext) {
                alert('This browser doesn\'t suppoert canvas!');
            }

            for (var i = 0, l = names.length; i < l; i++) {
                try {
                    context = canvas.getContext(names[i]);
                }
                catch (e) {}

                if (context) {
                    break;
                }
            }

            if (!context) {
                alert('This browser doesn\'t suppoert WebGL!');
            }

            WebGLHelper.setGLContext(context);
            return context;
        },

        /**
         * Create a shader with a source.
         * @param {WebGLContext} gl
         * @param {string} type shader type
         * @param {string} source shader source
         * @return {WebGLShader}
         */
        createShader: function (type, source) {

            var shader;

            if (type === 'vertex') {
                shader = gl.createShader(gl.VERTEX_SHADER);
            }
            else if (type === 'fragment') {
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            }

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert(gl.getShaderInfoLog(shader));
                return null;
            }

            return shader;
        },

        /**
         * Create a program with vertex shader and fragment shader.
         * @param {WebGLContext} gl
         * @param {WebGLShader} vertex_shader
         * @param {WebGLShader} fragment_shader
         * @return {WebGLProgram}
         */
        createProgram: function (vertex_shader, fragment_shader) {
            var program = gl.createProgram();
            gl.attachShader(program, vertex_shader);
            gl.attachShader(program, fragment_shader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                alert(gl.getProgramInfoLog(program));
                return null;
            }

            gl.useProgram(program);

            return program;
        },

        /**
         * Create a buffer.
         * @param {string} type
         * @param {Float32Array} data
         */
        createBuffer: function (type, data) {
            var buffer = gl.createBuffer();

            if (type === 'vbo') {
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
            }
            else if (type === 'ibo') {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
            }

            return buffer;
        },

        /**
         * Create a texture object.
         * @param {string} url
         * @return {WebGLTexture}
         */
        createTexture: function (url) {

            var img     = new Image(),
                texture = gl.createTexture();

            loading_image_queue.push(img);

            img.onload = function () {
                loading_image_queue.splice(loading_image_queue.indexOf(img), 1);

                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.bindTexture(gl.TEXTURE_2D, null);
            };
            img.src = url;

            return texture;
        }
    };

    window.WebGLHelper = window.$gl = WebGLHelper;

}(window, document, window));
