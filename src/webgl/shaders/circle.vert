#version 300 es
precision highp float;

layout (location = 0) in vec2 aPosition;

uniform vec2 uCenter;
uniform float uRadius;


uniform mat4 uOrthoMat;

void main() {
    gl_Position = vec4(aPosition * uRadius + uCenter, 0., 1.);
    gl_Position = gl_Position * uOrthoMat;
}