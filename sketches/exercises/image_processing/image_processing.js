let img;
let isGrayscale = false;

function preload() {
  img = loadImage('/showcase/car.jpg');
}

function setup() {
  createCanvas(img.width, img.height);
  img.resize(width, height);
  
  sliderRad = createSlider(10, 100, 50, 5);
  sliderRad.position(40, 20);
  sliderRad.style('width', '80px');
  
  sliderZoom = createSlider(1, 4, 2, 0.1);
  sliderZoom.position(40, 50);
  sliderZoom.style('width', '80px');
  
  grayscaleButton = createButton('Luma');
  grayscaleButton.position(40, 80);
  grayscaleButton.mouseClicked(toggleGrayscale);
}

function draw() {
  background(0);
  image(img, 0, 0);

  // Apply the zoom effect within the circular area
  loadPixels();
  let lensRadius = sliderRad.value();
  let zoomFactor = sliderZoom.value();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let dx = x - mouseX;
      let dy = y - mouseY;
      let distance = sqrt(dx * dx + dy * dy);
      if (distance < lensRadius) {
        let r = distance / lensRadius;
        let xZoomed = mouseX + (dx * (1 + zoomFactor * (1 - r)));
        let yZoomed = mouseY + (dy * (1 + zoomFactor * (1 - r)));
        let indexZoomed = (int(yZoomed) * width + int(xZoomed)) * 4;
        let index = (y * width + x) * 4;
        if (isGrayscale) {
          let gray = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
          pixels[index] = gray;
          pixels[index + 1] = gray;
          pixels[index + 2] = gray;
        } else {
          pixels[index] = pixels[indexZoomed];
          pixels[index + 1] = pixels[indexZoomed + 1];
          pixels[index + 2] = pixels[indexZoomed + 2];
        }
      }
    }
  }
  updatePixels();
}

function toggleGrayscale() {
  isGrayscale = !isGrayscale;
}