import { circleGeometry, squareGeometry, type Geometry } from "./geometry";
import { circleUniformsConnect, GeometryRenderer, rectangleUniformsConnect } from "./webgl/geometryRenderer";
import { createCircleShader, createRectangleShader, Shader } from "./webgl/shader";

export class Circle {
    radius: number;
    direction: Array<number>;
    position: Array<number>;

    geometryRenderer: GeometryRenderer | null = null;

    constructor(radius: number, direction: Array<number>, position: Array<number>) {
        this.radius = radius;
        this.direction = [direction[0], direction[1]];
        this.position = position;
    }

    createGeometryRenderer(gl: WebGL2RenderingContext, shader: Shader | null = null, geometry: Geometry | null = null) {
        if (!shader) {
            shader = createCircleShader(gl);
            shader.init();
        }

        if (!geometry) {
            geometry = circleGeometry();
        }
        
        this.geometryRenderer = new GeometryRenderer(gl, geometry, shader);
        this.geometryRenderer.init();
        circleUniformsConnect(this.geometryRenderer)
    }

    remove() {
        this.geometryRenderer?.remove();
    }

    get x(): number {return this.position[0]}
    get y(): number {return this.position[1]}
}

export class Rectangle {
    width: number;
    height: number;
    position: Array<number>;

    geometryRenderer: GeometryRenderer | null = null;

    constructor(width: number, height: number, position: Array<number>) {
        this.width = width;
        this.height = height;
        this.position = position;
    }

    createGeometryRenderer(gl: WebGL2RenderingContext) {
        const shader = createRectangleShader(gl);
        shader.init();
        const geometry = squareGeometry();

        this.geometryRenderer = new GeometryRenderer(gl, geometry, shader);
        this.geometryRenderer.init();
        rectangleUniformsConnect(this.geometryRenderer);
    }

    get x(): number { return this.position[0] }
    get y(): number { return this.position[1] }
    get left(): number { return this.x; }
    get right(): number { return this.x + this.width; }
    get top(): number { return this.y; }
    get bottom(): number { return this.y - this.height; }
    get center(): Array<number> { return [this.x + this.width / 2, this.y - this.height / 2] }
}