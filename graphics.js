class Graphics {
    constructor(logger) {
        this.logger = logger;
        this.init();
    }

    init() {
        this.logger.info("Initializing graphics");
        this.element = document.getElementById("graphics");

        this.gl = this.element.getContext("webgl");
        this.shaders = this.initShaders();
        this.onResizeWindow();

        window.onresize = () => this.onResizeWindow();
    }

    getShader(scriptId) {
        const gl = this.gl;
        const logger = this.logger;

        const scriptElement = document.getElementById(scriptId);
        const shaderType = scriptElement.type == "x-shader/x-vertex" ?
            gl.VERTEX_SHADER :
            gl.FRAGMENT_SHADER;

        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, scriptElement.text);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            logger.log(gl.getShaderInfoLog(shader));

        return shader;
    }

    getProgram(...shaders) {
        const gl = this.gl;
        const program = gl.createProgram();

        for (const shader of shaders)
            gl.attachShader(program, shader);
        // const logger = this.logger;

        // if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        //     logger.log(gl.getProgramInfoLog(program));

        return program;
    }

    initShaders() {
        const gl = this.gl;

        const vs = this.getShader("shader-vs");
        const fs = this.getShader("shader-fs");
        const program = this.getProgram(vs, fs);

        gl.linkProgram(program);

        return {
            program: program,
            aPosition: gl.getAttribLocation(program, "a_position"),
            aColor: gl.getAttribLocation(program, "a_color"),
            aNormal: gl.getAttribLocation(program, "a_normal"),
            uView: gl.getUniformLocation(program, "u_view"),
            uProjection: gl.getUniformLocation(program, "u_projection"),
            uAlpha: gl.getUniformLocation(program, "u_alpha"),
            uNormal: gl.getUniformLocation(program, "u_normal"),
            uDrawNormal: gl.getUniformLocation(program, "u_draw_normal")
        }
    }

    onResizeWindow() {
        const element = this.element;
        const w = element.width = window.innerWidth;
        const h = element.height = window.innerHeight;

        const gl = this.gl;
        gl.viewportWidth = w;
        gl.viewportHeight = h;

        this.logger.info(`Resized window to ${w}x${h}`);
    }

    clear() {
        const gl = this.gl;
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(.5, .5, .5, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    createVertexBuffer(vertices) {
        const gl = this.gl;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }

    createColorBuffer(colors) {
        const gl = this.gl;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
        return buffer;
    }

    createIndexBuffer(indices) {
        const gl = this.gl;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        return buffer;
    }

    createNormalBuffer(normals) {
        const gl = this.gl;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        return buffer;
    }

    updateGLSetting(name, value) {
        const gl = this.gl;
        if (value) {
            gl.enable(name);
        } else {
            gl.disable(name);
        }
    }

    draw(t, camera, geometry, world) {
        // https://www.creativebloq.com/javascript/get-started-webgl-draw-square-7112981
        // https://www.tutorialspoint.com/webgl/webgl_sample_application.htm
        const gl = this.gl;
        gl.useProgram(this.shaders.program);

        // this.updateGLSetting(gl.CULL_FACE, geometry.cull);
        this.updateGLSetting(gl.CULL_FACE, false);
        this.updateGLSetting(gl.DEPTH_TEST, geometry.depthtest);

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);

        var fieldOfViewRadians = Utils.degToRad(45);
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        var zNear = 1;
        var zFar = 100;

        var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
        var viewMatrix = m4.multiply(camera.world, world);
        var normalMatrix = m4.transpose(m4.inverse(viewMatrix));

        gl.uniformMatrix4fv(this.shaders.uView, false, viewMatrix);
        gl.uniformMatrix4fv(this.shaders.uProjection, false, projectionMatrix);
        gl.uniformMatrix4fv(this.shaders.uNormal, false, normalMatrix);
        gl.uniform1f(this.shaders.uAlpha, geometry.alpha);

        const buffers = geometry.buffers;

        if (buffers.normal) {
            gl.uniform1f(this.shaders.uDrawNormal, true);

            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
            gl.enableVertexAttribArray(this.shaders.aNormal);
            gl.vertexAttribPointer(this.shaders.aNormal, 3, gl.FLOAT, false, 0, 0);
        } else {
            gl.uniform1f(this.shaders.uDrawNormal, false);
        }

        if (buffers.vertex) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
            gl.enableVertexAttribArray(this.shaders.aPosition);
            gl.vertexAttribPointer(this.shaders.aPosition, 3, gl.FLOAT, false, 0, 0);
        }

        if (buffers.color) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
            gl.enableVertexAttribArray(this.shaders.aColor);
            gl.vertexAttribPointer(this.shaders.aColor, 3, gl.UNSIGNED_BYTE, true /* normalize */ , 0, 0);
        }

        if (buffers.index) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);
            gl.drawElements(gl.TRIANGLES, geometry.primitiveCount, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, geometry.primitiveCount);
        }
    }
}