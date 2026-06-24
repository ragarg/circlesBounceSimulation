import Scene from './scene';
import { draw } from './webgl/draw';
import UIController from './UI';

const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

const gl = canvas.getContext('webgl2');
if (!gl) {
  throw new Error('Ваш браузер не поддерживает WebGL2');
}

let lastTime = 0;

const scene = new Scene(canvas.width, canvas.height);
scene.init(gl);

new UIController(scene);

function animate(currentTime: number) {
  if (gl == null)
    return;

  const deltaTime = (currentTime - lastTime) / 1000;
  scene.udpateOrthoMatrix();

  if (lastTime === 0) {
    lastTime = currentTime;
    requestAnimationFrame(animate);
    return;
  }

  lastTime = currentTime;

  scene.moveCircles(deltaTime);
  draw(gl, scene.rectangle, scene.circles);

  scene.saveState();

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);