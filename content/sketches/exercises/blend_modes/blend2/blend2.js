let blendShader;
let brightness;
let color1, color2;
let radius;

function preload() {
  blendShader = readShader('blend2.frag');
}

function setup() {
  createCanvas(300, 300, WEBGL);
  colorMode(RGB, 1);
  rectMode(RADIUS);
  radius = width / 5;
  noStroke();
  color1 = createColorPicker(color(0.8, 0.5, 0.3));
  color1.position(10, 10);
  color2 = createColorPicker(color(0.9, 0.1, 0.4));
  color2.position(width / 2 + 10, 10);
  // brightness slider (located above to the right)
  // emits 'brightness' uniform in [0.0, 1.0] ∈ R
  brightness = createSlider(0, 1, 0.5, 0.05);
  brightness.position(width / 2 - 35, height / 2);
  brightness.style('width', '80px');
  shader(blendShader);
}

function draw() {
  // rectMode, e.g., rectMode(RADIUS) requires Tree.pmvMatrix
  // so no square but beginShape / endShape
  let l = 0.8;
  let offset = (1 - l) / 2;
  let color1Color = color1.color();
  let color2Color = color2.color();
  background(0);
  blendShader.setUniform('uMaterial1', [red(color1Color), green(color1Color), blue(color1Color), 1.0]);
  blendShader.setUniform('uMaterial2', [1.0, 1.0, 1.0, 1.0]);
  blendShader.setUniform('brightness', 1.0);
  beginShape();
  vertex(-offset - l, +offset, 0);
  vertex(-offset, +offset, 0);
  vertex(-offset, +offset + l, 0);
  vertex(-offset - l, +offset + l, 0);
  endShape();
  blendShader.setUniform('uMaterial1', [1.0, 1.0, 1.0, 1.0]);
  blendShader.setUniform('uMaterial2', [red(color2Color), green(color2Color), blue(color2Color), 1.0]);
  blendShader.setUniform('brightness', 1.0);
  beginShape();
  vertex(+offset, +offset, 0);
  vertex(+offset + l, +offset, 0);
  vertex(+offset + l, +offset + l, 0);
  vertex(+offset, +offset + l, 0);
  endShape();
  blendShader.setUniform('uMaterial1', [red(color1Color), green(color1Color), blue(color1Color), 1.0]);
  blendShader.setUniform('uMaterial2', [red(color2Color), green(color2Color), blue(color2Color), 1.0]);
  blendShader.setUniform('brightness', brightness.value());
  beginShape();
  vertex(-l / 2, -offset - l, 0);
  vertex(+l / 2, -offset - l, 0);
  vertex(+l / 2, -offset, 0);
  vertex(-l / 2, -offset, 0);
  endShape();
}
