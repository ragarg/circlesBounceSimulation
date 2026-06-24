import type { Geometry } from "../geometry";
import type { Circle, Rectangle } from "../objects";
import type { Shader } from "./shader";

export const SHAPE_CIRCLE = 0;
export const SHAPE_RECTANGLE = 1;

export class GeometryRenderer {
    gl: WebGL2RenderingContext;
    shader: Shader;
    geometry : Geometry

    locations : Map<string, WebGLUniformLocation | null> = new Map;

    buffers: Array<WebGLBuffer> = [];
    vao: WebGLVertexArrayObject | null = null;
    indexCount: number = 0;

    constructor(gl: WebGL2RenderingContext, geometry : Geometry, shader: Shader) {
        this.gl = gl;
        this.geometry = geometry;
        this.shader = shader;
    }

    init() {
        if (this.shader.program == null) {
            throw new Error('Нельзя инициализировать GeometryRenderer без WebGLProgram');
            return;
        }

        this.createVAO(this.shader.program);
    }

    createVAO(program: WebGLProgram) {
        const vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(vao);

        const positionBuffer = this.gl.createBuffer();
        this.buffers.push(positionBuffer);

        const posLoc = this.gl.getAttribLocation(program, "aPosition");
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.geometry.positions, this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(posLoc);
        this.gl.vertexAttribPointer(posLoc, 2, this.gl.FLOAT, false, 0, 0);

        if (this.geometry.indices != null) {
            const indexBuffer = this.gl.createBuffer();
            this.buffers.push(indexBuffer);

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.geometry.indices, this.gl.STATIC_DRAW);

            this.indexCount = this.geometry.indices.length;
        }

        this.gl.bindVertexArray(null);

        this.vao = vao;
    }

    remove() {
        this.buffers.forEach(buffer => {
            this.gl.deleteBuffer(buffer);
        })
        this.gl.deleteVertexArray(this.vao);
    }

    deleteShaderProgram() {
        this.shader.remove();
    }
}

export function circleUniformsConnect(GR: GeometryRenderer) {
    if (GR.shader.program == null) {
        throw new Error('Нельзя инициализировать GeometryRenderer без WebGLProgram');
        return;
    }
    GR.gl.useProgram(GR.shader.program);

    const locCenter = GR.gl.getUniformLocation(GR.shader.program, 'uCenter');
    const locRadius = GR.gl.getUniformLocation(GR.shader.program, 'uRadius');
    const locOrthoMat = GR.gl.getUniformLocation(GR.shader.program, 'uOrthoMat');

    GR.locations.set('uCenter', locCenter);
    GR.locations.set('uRadius', locRadius);
    GR.locations.set('uOrthoMat', locOrthoMat);
}

export function circleUniformsUpdate(GR: GeometryRenderer, circle: Circle) {
    const locCenter = GR.locations.get('uCenter');
    if (locCenter)
        GR.gl.uniform2f(locCenter, circle.position[0], circle.position[1]);

    const locRadius = GR.locations.get('uRadius');
    if (locRadius)
        GR.gl.uniform1f(locRadius, circle.radius);
}

export function rectangleUniformsConnect(GR: GeometryRenderer) {
    if (GR.shader.program == null) {
        throw new Error('Нельзя инициализировать GeometryRenderer без WebGLProgram');
        return;
    }
    GR.gl.useProgram(GR.shader.program);

    const locPos = GR.gl.getUniformLocation(GR.shader.program, 'uPos');
    const locSize = GR.gl.getUniformLocation(GR.shader.program, 'uSize');
    const locOrthoMat = GR.gl.getUniformLocation(GR.shader.program, 'uOrthoMat');

    GR.locations.set('uPos', locPos);
    GR.locations.set('uSize', locSize);
    GR.locations.set('uOrthoMat', locOrthoMat);
}

export function rectangleUniformsUpdate(GR: GeometryRenderer, rect: Rectangle) {
    const locPos = GR.locations.get('uPos');
    if (locPos)
        GR.gl.uniform2f(locPos, rect.center[0], rect.center[1]);

    const locSize = GR.locations.get('uSize');
    if (locSize)
        GR.gl.uniform2f(locSize, rect.width, rect.height);
}

export function orthoMatUniformUpdate(GR: GeometryRenderer, mat: any) {
    GR.gl.useProgram(GR.shader.program);
    const locOrthoMat = GR.locations.get('uOrthoMat');

    if (locOrthoMat)
        GR.gl.uniformMatrix4fv(locOrthoMat, false, mat);
}