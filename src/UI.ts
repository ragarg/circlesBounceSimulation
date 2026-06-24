import type Scene from "./scene";

export default class UIController {
    addBtn: HTMLButtonElement;
    panel: HTMLDivElement;
    speedInput: HTMLInputElement;
    angleInput: HTMLInputElement;
    radiusInput: HTMLInputElement;
    createBtn: HTMLButtonElement;
    closeBtn: HTMLButtonElement;
    clearBtn: HTMLButtonElement;

    scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;

        this.addBtn = document.getElementById("add-circle-btn") as HTMLButtonElement
        this.panel = document.getElementById("circle-panel") as HTMLDivElement
        this.speedInput = document.getElementById("speed-input") as HTMLInputElement
        this.angleInput = document.getElementById("angle-input") as HTMLInputElement
        this.radiusInput = document.getElementById("radius-input") as HTMLInputElement
        this.createBtn = document.getElementById("create-circle-btn") as HTMLButtonElement
        this.closeBtn = document.getElementById("close-panel-btn") as HTMLButtonElement
        this.clearBtn = document.getElementById("clear-scene-btn") as HTMLButtonElement

        this.bindEvents();
    }

    bindEvents(): void {
        this.addBtn.addEventListener('click', () => {
            this.showPanel();
        });

        this.closeBtn.addEventListener('click', () => {
            this.hidePanel();
        });

        this.clearBtn.addEventListener('click', () => {
            this.clearScene();
        });

        this.createBtn.addEventListener('click', () => {
            this.createCircleFromInput();
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === "Space") {
                console.log("dfsdfsd")
                this.handleSpace();
            }
        });
    }

    showPanel(): void {
        this.panel.style.display = "block";
    }

    hidePanel(): void {
        this.panel.style.display = "none";
    }

    createCircleFromInput(): void {
        const speed = parseFloat(this.speedInput.value) || 1;
        const angleDeg = parseFloat(this.angleInput.value) || 0;
        const radius = parseFloat(this.radiusInput.value) || 0.05;

        const angleRad = angleDeg * Math.PI / 100;
        const vx = speed * Math.cos(angleRad);
        const vy = speed * Math.cos(angleRad);

        // const margin = radius + 0.05;
        const halfWidth = this.scene.rectangle.width / 2
        const halfHeight = this.scene.rectangle.height / 2

        const x = (Math.random() - 0.5) * halfWidth;
        const y = (Math.random() - 0.5) * halfHeight;

        this.scene.createCircle(x, y, radius, vx, vy);
    }

    handleSpace(): void {
        this.scene.simulation = !this.scene.simulation;
    }

    clearScene(): void {
        this.scene.removeCircles();
    }
}