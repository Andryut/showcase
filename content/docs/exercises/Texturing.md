## Texturing

La texturización es el procedimiento mediante el cual se asigna una imagen o mapa de bits a un objeto tridimensional o a una superficie. Este proceso implica trabajar con los sistemas de coordenadas de las figuras y de la textura. Utilizando GLSL y técnicas de programación en paralelo, el shader y la GPU procesan la textura para lograr su aplicación adecuada en el objeto o superficie.


Los efectos que puedan aplicarse a una imagen requieren utilizar coordenaddas dadas, las coordenadas **texcoords2** y los **texels** permiten realizar operaciones pixel a pixel haciendo uso de la GPU .

{{< hint info >}}
**Ejercicio 3.1 y 3.2:**  
* Implementar heraamientas de iluminacion i color tales como *HSV valor V, HSL luminancia L, Promedio de componentes*. 
* Implementar el tintado de texturas mezclando el colo y los datos interpolados de los texeles.
{{< /hint >}}

{{< hint warning >}}


Se opera matematicamente los valores que se obtienen en los canales rgba para que el shader los procese nuevamente.
{{< /hint >}}

{{< p5-iframe sketch="/showcase/sketches/exercises/texturing/tools.js" lib1="/showcase/sketches/exercises/texturing/p5.treegl.js"  width="725" height="525" >}}

{{< details "**CODIGO:** tools.js" close >}}
```javascript
let lumaShader;
let img;
let grey_scale;
let average;
let HSVV;
let Tint;
let ColorT;

function preload() {
  lumaShader = readShader('/showcase/sketches/exercises/texturing/shaders/colors.frag',{ varyings: Tree.texcoords2});
  img = loadImage('/visual_computing/imgs/car.jpg');
}

function drawControls(enabled){
  if(enabled){
    colorT = createColorPicker(color(255,255,255));
    colorT.position(125, 10);
  }
}

function setup() {
  createCanvas(700, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);
  
  sel = createSelect();
  sel.position(10, 10);
  sel.option('None');
  sel.option('Luma');
  sel.option('Average');
  sel.option('HSV Value V');
  sel.option('HSL Value L');
  sel.option('Tint');
  
  sel.selected('None');
  
  drawControls(true);
  
  
  
}

function draw() {
  background(0);
  
  if(sel.value()=="None"){
    shader(lumaShader);
    lumaShader.setUniform('texture', img);
    lumaShader.setUniform('HSVV',false);
    lumaShader.setUniform('HSLL',false);
    lumaShader.setUniform('grey_scale',false);
    lumaShader.setUniform('average',false);
    
  }else if(sel.value()=="Luma"){
    shader(lumaShader);
    lumaShader.setUniform('grey_scale',true);
    lumaShader.setUniform('average',false);
    lumaShader.setUniform('HSVV',false);
    lumaShader.setUniform('HSLL',false);
    lumaShader.setUniform('texture', img);
    
  }else if(sel.value()=="Average"){
    shader(lumaShader);
    lumaShader.setUniform('average',true);
    lumaShader.setUniform('grey_scale',false);
    lumaShader.setUniform('HSVV',false);
    lumaShader.setUniform('HSLL',false);
    lumaShader.setUniform('texture', img);
    
  }else if(sel.value() =="HSV Value V"){
    shader(lumaShader);
    lumaShader.setUniform('HSVV',true);
    lumaShader.setUniform('HSLL',false);
    lumaShader.setUniform('average',false);
    lumaShader.setUniform('grey_scale',false);
    lumaShader.setUniform('texture', img);
    
  }else if(sel.value() =="HSL Value L"){
    shader(lumaShader);
    lumaShader.setUniform('HSLL',true);
    lumaShader.setUniform('HSVV',false);
    lumaShader.setUniform('average',false);
    lumaShader.setUniform('grey_scale',false);
    lumaShader.setUniform('texture', img);
    
  }else if(sel.value() =="Tint"){
    shader(lumaShader);
    lumaShader.setUniform('Tint',true);
    lumaShader.setUniform('HSLL',false);
    lumaShader.setUniform('HSVV',false);
    lumaShader.setUniform('average',false);
    lumaShader.setUniform('grey_scale',false);
    lumaShader.setUniform('texture', img);
    
    let RC = colorT.color();
    lumaShader.setUniform('colorT',[red(RC),green(RC),blue(RC),1.0]);
    
  }
  
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}
```
{{< /details >}}

{{< details "**CODIGO:** colors.frag" close >}}
```glsl
precision mediump float;

uniform bool grey_scale;
uniform bool average;
uniform bool HSVV;
uniform bool HSLL;
uniform bool Tint;

uniform vec4 colorT;

uniform sampler2D texture;

varying vec2 texcoords2;

float luma(vec3 texel) {
  return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}

float favg(vec3 texel){
  return (texel.r + texel.g + texel.b ) / 3.0;
}

float HSV (vec3 texel){
  return max(max(texel.r,texel.g),texel.b); ;
}

float HSL (vec3 texel){
  float CMax = max(max(texel.r,texel.g),texel.b);
  float CMin = min(min(texel.r,texel.g),texel.b);
  return (CMax + CMin) / 2.0 ;
}

float Ftint(float channel, float color){
  float N = channel * (color / 255.0);
  return N;
}


void main() {
  
  vec4 texel = texture2D(texture, texcoords2);
  
  if(grey_scale == true){
    gl_FragColor = vec4((vec3(luma(texel.rgb))), 1.0); 
  }else if(average == true){
    gl_FragColor = vec4((vec3(favg(texel.rgb))), 1.0); 
  }else if(HSVV== true){
    gl_FragColor = vec4((vec3(HSV(texel.rgb))), 1.0);
  }else if(HSLL== true){
    gl_FragColor = vec4((vec3(HSL(texel.rgb))), 1.0);
  }else if(Tint == true){
    gl_FragColor = vec4(Ftint(texel.r,colorT.x),Ftint(texel.g,colorT.y),Ftint(texel.b,colorT.z),1.0);
  }else{
    gl_FragColor = texel;  
  }
  
}
```
{{< /details >}}

{{< hint danger >}}
**Referencias:**  
* **[Speeding Up tint() in p5]:** https://www.davepagurek.com/blog/p5-tint/
* **[HSL & HSV]:** https://en.wikipedia.org/wiki/HSL_and_HSV#Disadvantages
* **[Blend Modes]:** https://en.wikipedia.org/wiki/Blend_modes#Overlay
* **[P5.js]:** https://p5js.org/es/reference/
{{< /hint >}}
