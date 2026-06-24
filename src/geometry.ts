export type Geometry = {
    positions: Float32Array<ArrayBuffer> | null;
    indices:  Uint16Array<ArrayBuffer> | null;
}

export function circleGeometry() : Geometry {
    const SEGMETNS = 128;

    const geometry: Geometry = {
        positions: new Float32Array((SEGMETNS + 1) * 2),
        indices: null
    };

    geometry.positions = new Float32Array((SEGMETNS + 1) * 2);

    geometry.positions[0] = 0;
    geometry.positions[1] = 0;

    for (let i = 0; i <= SEGMETNS; i++) {
        const angle = (i / SEGMETNS) * 2 * Math.PI;
        const x = Math.cos(angle);
        const y = Math.sin(angle);

        geometry.positions[i * 2] = x;
        geometry.positions[i * 2 + 1] = y;
    }

    return geometry;
}

export function squareGeometry() : Geometry {
    const geometry: Geometry = {
        positions: new Float32Array([
                            0.5, 0.5,
                            0.5, -0.5,
                            -0.5, -0.5,
                            -0.5, 0.5
                        ]),
        indices: new Uint16Array([0, 1, 2, 0, 2, 3])
    };

    return geometry;
}