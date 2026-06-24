import type { Circle, Rectangle } from "./objects";

export function circleIntersectsRectangle(circle: Circle, rect: Rectangle): void {
    if (circle.x - circle.radius < rect.left){
        circle.position[0] = rect.left + circle.radius;
        circle.direction[0] *= -1;
    }
    else if (circle.x + circle.radius > rect.right){
        circle.position[0] = rect.right - circle.radius;
        circle.direction[0] *= -1;
    }

    if (circle.y - circle.radius < rect.bottom){
        circle.position[1] = rect.bottom + circle.radius;
        circle.direction[1] *= -1;
    }
    else if (circle.y + circle.radius > rect.top){
        circle.position[1] = rect.top - circle.radius;
        circle.direction[1] *= -1;
    }
}

export function resolveCircleCollision(c1: Circle, c2: Circle): void {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const minDist = c1.radius + c2.radius;

    if (dist >= minDist || dist === 0) return;

    const nx = dx / dist;
    const ny = dy / dist;

    const overlap = minDist - dist;

    c1.position[0] += nx * overlap * 0.5;
    c1.position[1] += ny * overlap * 0.5;
    c2.position[0] -= nx * overlap * 0.5;
    c2.position[1] -= ny * overlap * 0.5;

    const speed1 = c1.direction[0] * nx + c1.direction[1] * ny;
    const speed2 = c2.direction[0] * nx + c2.direction[1] * ny;

    const new_speed1 = speed2;
    const new_speed2 = speed1;

    c1.direction = [c1.direction[0] + (new_speed1 - speed1) * nx, c1.direction[1] + (new_speed1 - speed1) * ny];
    c2.direction = [c2.direction[0] + (new_speed2 - speed2) * nx, c2.direction[1] + (new_speed2 - speed2) * ny];
}