import { mat4 } from "gl-matrix";
import { Circle, Rectangle } from "./objects";
import { circleIntersectsRectangle, resolveCircleCollision } from "./collisions";
import { orthoMatUniformUpdate, type GeometryRenderer } from "./webgl/geometryRenderer";

const STORAGE_KEY: string = 'simulation_state';

export default class Scene {
    circles: Array<Circle> = [];
    rectangle: Rectangle;

    width: number = 0;
    height: number = 0;

    projectionMatrix: any;
    
    objects: Array<GeometryRenderer> = [];

    gl: WebGL2RenderingContext | null = null;

    simulation: boolean = false;

    constructor(width: number, height: number) {
        this.rectangle = new Rectangle(2, 1.5, [-1, 0.75]);

        this.width = width;
        this.height = height;

        const aspect = this.width / this.height;

        const worldHeight = 2;
        const worldWidth = worldHeight * aspect;

        const left = -worldWidth / 2;
        const right = worldWidth / 2;
        const bottom = -worldHeight / 2;
        const top = worldHeight / 2;

        this.projectionMatrix = mat4.create();
        mat4.ortho(this.projectionMatrix, left, right, bottom, top, -1, 1);
    }

    init(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.rectangle.createGeometryRenderer(gl);

        this.loadState();
    }

    removeCircles(): void {
        this.circles.forEach(circle => {
            circle.remove();
        })

        this.circles[0].geometryRenderer?.deleteShaderProgram();

        this.circles = [];
        localStorage.removeItem(STORAGE_KEY);
    }

    createCircle(x: number, y: number, radius: number, vx: number, vy: number): void {
        const circle = new Circle(radius, [vx, vy], [x, y]);
        this.circles.push(circle);
        if (this.gl) {
            const shader = this.circles[0].geometryRenderer?.shader;
            circle.createGeometryRenderer(this.gl, shader);
        }
    }

    udpateOrthoMatrix() {
        if (this.rectangle.geometryRenderer)
            orthoMatUniformUpdate(this.rectangle.geometryRenderer, this.projectionMatrix);

        this.circles.forEach(circle => {
            if (circle.geometryRenderer)
                orthoMatUniformUpdate(circle.geometryRenderer, this.projectionMatrix);
        })
    }

    moveCircles(deltaTime: number) {
        if (!this.simulation)
            return;

        this.circles.forEach(circle => {
            circle.position[0] += circle.direction[0] * deltaTime;
            circle.position[1] += circle.direction[1] * deltaTime;
            circleIntersectsRectangle(circle, this.rectangle);
        })

        this.circles.forEach(circle1 => {
            this.circles.forEach(circle2 => {
                resolveCircleCollision(circle1, circle2);
            })
        })


    }

    saveState(): void{
        const state = {
            circles: this.circles.map((c: Circle) => ({
                x: c.x,
                y: c.y,
                radius: c.radius,
                vx: c.direction[0],
                vy: c.direction[1],
            }))
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    loadState(): boolean {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        try {
            const state = JSON.parse(raw);
            state.circles.forEach((c: any) => {
                this.createCircle(c.x, c.y, c.radius, c.vx, c.vy);
            });
            return true;
        } 
        catch (e) {
            console.warn("Ошибка загрузки состояния", e);
            return false;
        }
    }
}