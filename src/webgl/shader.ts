import circle_vert from "./shaders/circle.vert";
import circle_frag from "./shaders/circle.frag";
import rectangle_vert from "./shaders/rectangle.vert";
import rectangle_frag from "./shaders/rectangle.frag";

export class Shader {
    gl: WebGL2RenderingContext;
    vertexShader: WebGLShader;
    fragmentShader : WebGLShader;

    program: null | WebGLProgram = null;
    constructor(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader : WebGLShader) {
        this.gl = gl;
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
    }

    init() {
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error(this.gl.getProgramInfoLog(this.program));
            throw new Error('Ошибка линковки программы');
        }
    }

    remove() {
        this.gl.deleteProgram(this.program);

        this.gl.deleteShader(this.vertexShader);
        this.gl.deleteShader(this.fragmentShader);
    }
}

function compileShader(gl: WebGL2RenderingContext, src: string, type: number): WebGLShader {
    const shader = gl.createShader(type);
    if (shader == null) {
        throw new Error('Не удалось создать шейдер');
    }
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw new Error('Ошибка компиляции');
    }

    return shader;
}

export function createCircleShader(gl: WebGL2RenderingContext): Shader {
    const vertexShader = compileShader(gl, circle_vert, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, circle_frag, gl.FRAGMENT_SHADER);

    return new Shader(gl, vertexShader, fragmentShader);
}

export function createRectangleShader(gl: WebGL2RenderingContext): Shader {
    const vertexShader = compileShader(gl, rectangle_vert, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, rectangle_frag, gl.FRAGMENT_SHADER);

    return new Shader(gl, vertexShader, fragmentShader);
}