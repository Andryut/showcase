# Spatial Coherence
>**Prompt:** Implement a pixelator video application and perform a benchmark of the results (color avg vs spatial coherence). How would you assess the visual quality of the results?
>

The color averaging filter works smoothing the image loosing the pictures details, otherwise, the spacial coherence technique achieves to keep 
details and shapes edges, this cant be done by color averaging smooth effect.
{{< details title="Code implementation" open=false >}} {{< highlight js >}}
let img;
let ratioInput;
let ratioValue;
let newImg, newImg2;
let updateBtn;

function preload() {
  img = loadImage("https://picsum.photos/400");
}

function setup() {

  createCanvas(img.width * 2, img.height * 2);
  text = createP("Original");
  text.position(10, img.height/2 - 30);
  text2 = createP("Color averaging");
  text2.position(img.width + 8, 0);
  text3 = createP("Spatial coherence");
  text3.position(img.width + 8, img.height + 22);
  ratioInput = createInput(10, "number");
  ratioInput.position(55, (img.height/2) + img.height + 40);
  ratioInput.style('width', `${img.width / 2 - 70}px`);
  
  ratioValue = createDiv("Ratio: ");
  ratioValue.position(10, (img.height/2) + img.height + 42);

  updateBtn = createButton('Update');
  updateBtn.position(10, (img.height/2) + img.height + 65);
  updateBtn.style('background-color', '#76b5c5');
  updateBtn.style('border', 'none');
  updateBtn.style('color', 'white');
  updateBtn.style('padding', '8px 14px');
  updateBtn.style('text-align', 'center');
  updateBtn.style('text-decoration', 'none');
  updateBtn.style('display', 'inline-block');
  updateBtn.style('font-size', '16px');
  updateBtn.style('margin', '4px 2px');
  updateBtn.style('cursor', 'pointer');
  updateBtn.mousePressed(updateImages);
  pixelDensity(calcPixelDensity());
  newImg = createImage(img.width, img.height);
  newImg2 = createImage(img.width, img.height);

  updateImages();
  
}

function draw() {
  image(img, -10, img.height/2);
  image(newImg, img.width, 30);
  image(newImg2, img.width, img.height + 50);
}

function updateImages() {
  updateImage1();
  updateImage2();
  background("#eeeee4");
}

function updateImage1() {
  let ratio = ratioInput.value();
  let avgColors = getAverageColors(img);
  setPixels(newImg, avgColors, ratio);
  image(newImg, img.width, 30);
}

function updateImage2() {
  let ratio = parseInt(ratioInput.value());
  newImg2.loadPixels();
  let new_pixels = [];
  for (let y = 0; y < newImg2.height; y++) {
    for (let x = 0; x < newImg2.width; x++) {
      let randX = -1;
      let randY = -1;
      while (randX < 0 || randX >= img.width || randY < 0 || randY >= img.height){
        randX = x + int(random(parseInt(-ratio/2), parseInt(ratio/2)));
        randY = y + int(random(parseInt(-ratio/2), parseInt(ratio/2)));
      }
      let index = (x + y * newImg2.width) * 4;
      let new_index = (randX + randY * newImg2.width) * 4;
      
      newImg2.pixels[index] = img.pixels[new_index];
      newImg2.pixels[index + 1] = img.pixels[new_index+1];
      newImg2.pixels[index + 2] = img.pixels[new_index+2];
      newImg2.pixels[index + 3] = 255;      
    }
  }

  newImg2.updatePixels();
  image(newImg2, img.width, img.height + 50);
}

function getAverageColors(img)
{
  let avgColors = [];
  img.loadPixels();

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      avgColors.push(color(r , g , b));
    }
  }
  img.updatePixels();

  return avgColors;
}

function setPixels(img, avgColors, ratio) {
  img.loadPixels();

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;

      for (let i = 0; i <= ratio; i++) {
        for (let j = 0; j <= ratio; j++) {
          let neighborX = x + i;
          let neighborY = y + j;

          if (neighborX >= 0 && neighborX < img.width && neighborY >= 0 && neighborY < img.height) {
            let neighborIndex = (neighborX + neighborY * img.width) * 4;
            r += red(avgColors[neighborIndex / 4]);
            g += green(avgColors[neighborIndex / 4]);
            b += blue(avgColors[neighborIndex / 4]);
            count++;
          }
        }
      }

      r /= count;
      g /= count;
      b /= count;

      img.pixels[index] = r;
      img.pixels[index + 1] = g;
      img.pixels[index + 2] = b;
      img.pixels[index + 3] = 255;
    }
  }

  img.updatePixels();
}

function calcPixelDensity() {
  let density = displayDensity();
  let w = img.width * density;
  let h = img.height * density;
  let ratio = w / h;
  let pixelDensity = 1;
  if (w > displayWidth || h > displayHeight) {
    if (ratio > 1) {
      pixelDensity = ceil(w / displayWidth);
   

    } else {
      pixelDensity = ceil(h / displayHeight);
    }
  }
  return pixelDensity;
}
{{< /highlight >}} {{< /details >}}
{{< p5-iframe sketch="/showcase/sketches/exercises/spacial_coherence/2.js" width="735" height="830" >}}

# Pixelator
>**Prompt:** Implement a pielator in software that does not use spatial coherence.
>

{{< details title="Code implementation" open=false >}} {{< highlight js >}}
var img;
var arraylist = [];
var resMax = 30;

function preload(){
	img = loadImage("images/needler.jpg");
}

function setup() {
	frameRate(10);

	var sc = 1;
	createCanvas(img.width*sc,img.height*sc);
	
	pixelDensity(1);
	scale(sc);
	image(img,0,0);
	
	var d = pixelDensity();
	var w = d*img.width*sc;
	var h = d*img.height*sc;

	loadPixels();
	background(0);

	var count = 0;
	
	var colorRange = 255;
	colorRange = 256-colorRange;

	for(var res = 1; res < resMax; res++){
      // noprotect
		var newPixels = [];
		for (var i = 0; i<w; i++){
			for(var n =0; n<h; n++){
				newPixels[(n*w + i)*4] = round(pixels[floor((floor(n/res)*res*w + i)/res)*res*4]/colorRange)*colorRange;
				newPixels[(n*w + i)*4+1] = round(pixels[floor((floor(n/res)*res*w + i)/res)*res*4+1]/colorRange)*colorRange;
				newPixels[(n*w + i)*4+2] = round(pixels[floor((floor(n/res)*res*w + i)/res)*res*4+2]/colorRange)*colorRange;
				newPixels[(n*w + i)*4+3] = 255;
			}
		}
		append(arraylist,newPixels.slice(0));
	}

}

function draw() {
	for(var i = 0; i<pixels.length; i++){
		pixels[i] = arraylist[frameCount%(resMax-1)][i];
	}
  updatePixels();
}
{{< /highlight >}} {{< /details >}}
{{< p5-iframe sketch="/showcase/sketches/exercises/spacial_coherence/pixelator.js" width="720" height="550" >}} 