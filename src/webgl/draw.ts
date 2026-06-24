import type { Circle, Rectangle } from "../objects";
import { circleUniformsUpdate, rectangleUniformsUpdate } from "./geometryRenderer";

export function draw(gl: WebGL2RenderingContext,  rect : Rectangle, circles : Array<Circle>): void {
    gl.disable(gl.CULL_FACE)
    gl.clearColor(0.1, 0.1, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw rectangle
    if (!rect.geometryRenderer || !rect.geometryRenderer.shader.program)
        return;
    gl.useProgram(rect.geometryRenderer.shader.program);
    
    rectangleUniformsUpdate(rect.geometryRenderer, rect);
    gl.bindVertexArray(rect.geometryRenderer.vao);
    gl.drawElements(gl.TRIANGLES, rect.geometryRenderer.indexCount, gl.UNSIGNED_SHORT, 0)

    // Draw circles
    if (circles.length != 0) {
        if (!circles[0].geometryRenderer || !circles[0].geometryRenderer.shader.program)
                return;
            gl.useProgram(circles[0].geometryRenderer.shader.program);

        circles.forEach(circle => {
            if (!circle.geometryRenderer || !circle.geometryRenderer.shader.program)
                return;
            circleUniformsUpdate(circle.geometryRenderer, circle)
            gl.bindVertexArray(circle.geometryRenderer.vao);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 129)
        })
    }
    gl.bindVertexArray(null);
}