precision mediump float;

uniform vec4 colorA;
uniform vec4 colorB;
uniform float alphaValue;
uniform int blendMode;

// interpolated color is emitted from the vertex shader
// where the variable is defined in the same exact way
// see your console!
varying vec4 color4;

float luminosity(vec4 color) {
  return (color.r + color.g + color.b)/3.0;
}

void main() {
  if( blendMode == 1 ){ // ADD
    gl_FragColor = (colorA + colorB) * alphaValue;
  }else if( blendMode == 2 ){ // DIFFERENCE
    gl_FragColor = (colorA - colorB) * alphaValue;
  }else if( blendMode == 3 ){ // MULTIPLY
    gl_FragColor = colorA * colorB * alphaValue;
  }else if( blendMode == 4 ){ // SCREEN
    gl_FragColor = (vec4((vec3(1.0) - colorA.rgb), colorA.a) * vec4((vec3(1.0) - colorB.rgb), colorB.a)) * alphaValue;
  }else if( blendMode == 5 ){ // LIGHTEST
    if( luminosity(colorA) >= luminosity(colorB) ) gl_FragColor = colorA * alphaValue;
    else gl_FragColor = colorB * alphaValue;
  }else if( blendMode == 6 ){ // DARKEST
    if( luminosity(colorA) <= luminosity(colorB) ) gl_FragColor = colorA * alphaValue;
    else gl_FragColor = colorB * alphaValue;
  }
}
