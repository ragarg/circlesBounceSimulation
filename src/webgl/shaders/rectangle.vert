#version 300 es
precision highp float;

layout (location = 0) in vec2 aPosition;

uniform vec2 uPos;
uniform vec2 uSize;

uniform mat4 uOrthoMat;

void main() {
    gl_Position = vec4(aPosition.x * uSize.x + uPos.x, aPosition.y * uSize.y + uPos.y, 0., 1.);
    gl_Position = gl_Position * uOrthoMat;
}