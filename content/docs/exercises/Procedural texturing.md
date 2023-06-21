# Procedural Texturing

## Problem statement

El texturizado procedimental implica generar texturas superficiales utilizando procedimientos o algoritmos matemáticos. Este enfoque ofrece varios beneficios, incluidos requisitos de almacenamiento bajos, resolución de texturas ilimitada y mapeo de texturas sencillo.

El método de texturizado procesal encuentra aplicaciones en diversas áreas, como la creación de efectos visuales, la mejora del agarre mecánico, la reducción de la resistencia aerodinámica y el modelado de superficies o representaciones volumétricas de elementos naturales como madera, mármol, granito, metal, piedra y más.

Para aplicar una textura usando texturizado procedimental, el primer paso es obtener las coordenadas de textura, que representan los vértices del objeto en un espacio bidimensional conocido como espacio de textura (referido como coordenadas "st"). Estas coordenadas proporcionan un marco de referencia para crear diferentes patrones bidimensionales. Normalmente, el eje "s" denota el eje x, mientras que el eje "t" representa el eje y.

Luego, para asignar un elemento de textura a un elemento de pantalla, las coordenadas de textura de ese elemento se ubican dentro del espacio de textura, que es un sistema de coordenadas que va de (0,0) a (1,1). Este proceso permite asignar la misma coordenada de textura a diferentes texturas. Por ejemplo, se puede asignar una coordenada de textura de (0.5,1.0) a texel(2,4) en una textura y texel(3,6) en otra textura, incluso si las texturas tienen diferentes tamaños.

Para ilustrar el proceso de asignación de coordenadas de textura al espacio de la pantalla, imagine un píxel representado como un cuadrado coloreado en la parte izquierda de la ilustración. Las esquinas del píxel en el espacio del objeto 3D se asignan a las esquinas correspondientes del área de superficie de la forma primitiva. Este mapeo introduce distorsiones en la forma del píxel debido a la forma y el ángulo de visión de la primitiva 3D. Las esquinas del área de superficie de la primitiva, que se alinean con las esquinas del píxel, se asignan al espacio de textura. Nuevamente, este mapeo puede resultar en más distorsiones de la forma del píxel. Finalmente, el valor de color del píxel se calcula en función de los téxeles dentro de la región asignada de la textura.

## Code

A continuación algunos ejemplos:

Aplicamos el siguiente patron a una esfera:

![](/visual_computing/imgs/patron.JPG)

Resultado:

{{< p5-iframe sketch="/showcase/sketches/exercises/procedural_texturing/procedural_texturing.js" width="620" height="620" >}}

{{< details "**CODIGO:** Esfera.frag" close >}}
**C**odigo generado usando el editor web de **P5.js**.
```javascript
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform float u_time;

vec2 rotate2D (vec2 _st, float _angle) {
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile (vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
}

vec2 rotateTilePattern(vec2 _st){

    _st *= 4.0;

    //  Give each cell an index number
    //  according to its position
    float index = 0.0;
    index += step(1., mod(_st.x,2.0));
    index += step(1., mod(_st.y,2.0))*2.0;
  
    _st = fract(_st);
  
    if(index == 1.0){
        //  Rotate cell 1 by -90 degrees
        _st = rotate2D(_st,PI*-0.5);
    }else if(index == 2.0){
        //  Rotate cell 2 by -90 degrees
        _st = rotate2D(_st,PI*-0.5);
    }
    return _st;
}

void main (void) {
  
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    st = tile(st,3.0);
    st = rotateTilePattern(st);
  
    gl_FragColor = vec4(vec3(step(st.x,st.y)),1.0);
}

//Fuente: https://thebookofshaders.com/09/
```
{{< /details >}}

Aplicamos el siguiente patron a un cubo:

{{< p5-iframe sketch="/showcase/sketches/exercises/procedural_texturing/procedural_texturing_3.js" width="620" height="620" >}}

Resultado:

{{< p5-iframe sketch="/showcase/sketches/exercises/procedural_texturing/procedural_texturing_2.js" width="620" height="620" >}}

{{< details "**CODIGO:** Cubo.frag" close >}}
**C**odigo generado usando el editor web de **P5.js**.
```javascript
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st, float pct){
  return 0.0 ;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    
	vec2 mt = vec2(sin(u_time),cos(u_time));
    
    float y = sin(st.x*PI*3.000);
	float altura = abs( pow(mt.x*cos(st.x*PI*2.4),3.0)
                       +pow(mt.y*sin(st.y*PI*2.040),2.0));
    vec3 color = vec3(altura);
	
    float pct = plot(st,y);
    color = (1.0-pct)*color+pct*vec3(0.524,0.570,0.565);

    gl_FragColor = vec4(color.rg,1.144,0.944);
}
```
{{< /details >}}

## Conclusiones

Este metodo ahorra tiempo en la aplicación de texturas

## Referencias

https://learn.microsoft.com/en-us/windows/win32/direct3d9/texture-coordinates

