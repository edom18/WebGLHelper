(function (win, doc, exports) {

    'use strict';

    var gl,
        loading_image_queue = [];

    var WebGLHelper = {

        //const variables.
        VERTEX_SHADER: 0,
        FRAGMENT_SHADER: 1,

        ARRAY_BUFFER: 0,
        ELEMENT_ARRAY_BUFFER: 1,

        //Class method.
        degToRad: function() {
            var factor = Math.PI / 180;
            return function (degrees) {
                return degrees * factor;
            };
        }(),

        radToDeg: function() {
            var factor = 180 / Math.PI;
            return function (rad) {
                return rad * factor;
            };
        }(),

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
         * Set clear depth.
         * @param {number} depth
         */
        setClearDepth: function (depth) {
            gl.clearDepth(depth);
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

            if (type === this.VERTEX_SHADER) {
                shader = gl.createShader(gl.VERTEX_SHADER);
            }
            else if (type === this.FRAGMENT_SHADER) {
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

            if (type === this.ARRAY_BUFFER) {
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
            }
            else if (type === this.ELEMENT_ARRAY_BUFFER) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
            }

            return buffer;
        },

        setupBuffer: function (args) {
            var buffer = args.buffer,
                index  = args.index,
                size   = args.size,
                stride = args.stride || 0,
                offset = args.offset || 0;

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.enableVertexAttribArray(index);
            gl.vertexAttribPointer(index, size, gl.FLOAT, false, stride, offset);
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
        },

        /**
         * Create a material with shader.
         * @param {Object} args
         * @return {Object}
         */
        createProgramWithShader: function (args) {

            if (!util.isObject(args)) {
                throw new Error('An argument must be like Object.'); 
            }

            var vs  = this.createShader(this.VERTEX_SHADER, args.vertexShader);
            var fs  = this.createShader(this.FRAGMENT_SHADER, args.fragmentShader);
            var prg = this.createProgram(vs, fs);

            return prg;
        }
    };

    var requestAnimFrame = win.requestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame ||
                           function (func) {
                               return setTimeout(func, 16);
                           };

    var cancelAnimFrame = win.cancelAnimationFrame || win.mozCancelAnimationFrame || win.msCancelAnimationFrame ||
                          function (id) {
                              clearTimeout(id);
                          };

    /*! -----------------------------------------------------------------
        EXPORTS.
    --------------------------------------------------------------------- */
    exports.requestAnimFrame = requestAnimFrame;
    exports.cancelAnimFrame  = cancelAnimFrame;
    exports.WebGLHelper      = exports.$gl = WebGLHelper;

}(window, document, window));
