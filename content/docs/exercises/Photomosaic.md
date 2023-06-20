## Photomosaic

The photomosaic is an image, portrait or photograph that is divided by geometric figures, generally by squares or rectangles of the same size, this in order to replace them with other portraits, photographs or images that match the average colors that the figures contain. geometric shapes of the original image, achieving that when viewing the image from a distant point it is possible to see it as the original, but when viewing from a nearby point or when zooming in it can be perceived that they are made up of other images.

# Photomosaic

## Photomosaic by hardware

The implementation of the photomosaic can be done through hardware, that is, the construction of an algorithm that is responsible for converting the original image into a mosaic of others.

In the `preload` function we define the fragment to use called `photomosaic.frag`, from there to the final mosaic we are going to define certain parameters that will be obtained at the moment of traversing the image, here the texels of the average color are compared that each pixel of the original image or video possesses.

The average colors of the original image are compared with the image returned by the quadrille, making use of a tolerance that increases until finding the closest color to the original, and in this way, that color found is the one used to fill in the image. image displayed as a result.

{{< details title="photomosaic.js" open=false >}}

```javascript

```

{{< /details >}}

{{< details title="photomosaic.frag" open=false >}}

```javascript
precision mediump float;

const int num_images = 40;

// source (image or video) is sent by the sketch
uniform sampler2D source;

// palette is sent by the sketch
uniform sampler2D palette;
// number of cols are sent by sketch
uniform float cols;

uniform float lumas[num_images];
uniform float red_palette[num_images];
uniform float green_palette[num_images];
uniform float blue_palette[num_images];

// toggles debug
uniform bool debug;

// toggles coloring
uniform bool color_on;
uniform vec4 background;
uniform vec4 foreground;

// target horizontal & vertical resolution
uniform float resolution;

// interpolated color (same name and type as in vertex shader)
varying vec4 vVertexColor;
// interpolated texcoord (same name and type as in vertex shader)
varying vec2 vTexCoord;

float luma(vec3 color) {
  return (0.299 * color.r + 0.587 * color.g + 0.114 * color.b);
}

void main() {
  vec2 fontCoord = vTexCoord * resolution;
  vec2 srcCoord = floor(fontCoord);
  fontCoord = fontCoord - srcCoord;
  srcCoord = srcCoord / vec2(resolution);
  float mid = 1.0/(2.0*resolution);
  srcCoord = srcCoord + vec2(mid);

  vec4 key = texture2D(source, srcCoord);
  if (debug) {
    gl_FragColor = key;
  } else {
    float lumakey = luma(key.rgb);
    float selected = 0.0;

    bool complete = false;
    for(float j = 0.02; j <= 0.5; j += 0.02){
      for(int i = 0 ; i < num_images; i ++)
      {
        if((red_palette[i]/255.0> (key.r - j) && red_palette[i]/255.0 < (key.r + j)) && (green_palette[i]/255.0> (key.g - j) && green_palette[i]/255.0 < (key.g + j)) && (blue_palette[i]/255.0> (key.b - j) && blue_palette[i]/255.0 < (key.b + j))){
          selected = float(i);
          complete = true;
          break;
        }
      }
      if(complete){
        break;
      }
    }

    vec2 tile = vec2((floor(selected) + fontCoord.x) / cols, fontCoord.y);

    vec4 paletteTexel = texture2D(palette, tile);
    gl_FragColor = paletteTexel;
  }
}

```

{{< /details >}}

{{< details title="photomosaic.js" open=false >}}

```javascript
function preload() {
  image_src = loadImage('/visual_computing/imgs/car.jpg');
  video_src = createVideo(['/visual_computing/vid/drift.mp4']);
  video_src.hide(); // by default video shows up in separate dom
  mosaic = readShader('/visual_computing/sketches/shaders/photomosaic.frag');
  p = [];
  for (let i = 1; i <= 40; i++) {
    if (i.toString().length == 1) {
      p.push(loadImage(`/visual_computing/imgs/cars/00000${i}.jpg`));
    } else {
      p.push(loadImage(`/visual_computing/imgs/cars/0000${i}.jpg`));
    }
  }
}

function sample() {
  if (pg.width !== SAMPLE_RES * imageCells.width) {
    pg = createGraphics(SAMPLE_RES * imageCells.width, SAMPLE_RES);
    mosaic.setUniform("cols", imageCells.width);
  }
  imageCells.sort({
    ascending: true,
    cellLength: SAMPLE_RES,
    mode: "LUMA",
  });

  luma = imageCells.saveLuma({
    cellLength: SAMPLE_RES,
  });
  rgb = imageCells.saveRGB({
    cellLength: SAMPLE_RES,
  });
  drawQuadrille(imageCells, {
    graphics: pg,
    cellLength: SAMPLE_RES,
    outlineWeight: 0,
  });
  mosaic.setUniform("palette", pg);
  mosaic.setUniform("lumas", luma);
  mosaic.setUniform("red_palette", rgb.r);
  mosaic.setUniform("green_palette", rgb.g);
  mosaic.setUniform("blue_palette", rgb.b);
}
```

{{< /details >}}

{{< p5-iframe sketch="/showcase/sketches/exercises/photomosaic/photomosaic.js" lib1="/showcase/sketches/exercises/photomosaic/p5.shaderbox.js" 
lib2="/showcase/sketches/exercises/photomosaic/p5.quadrille.js" width="675" height="675" >}}

# Referencias

{{< hint warning >}}

- [1] _“Shaders”_ **github.com** https://github.com/mattdesl/lwjgl-basics/wiki/Shaders (Mar. 8, 2020).

{{< /hint >}}