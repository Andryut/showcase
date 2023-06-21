function preload() {
  img = loadImage('https://picsum.photos/500');
}

function setup() {
  createCanvas(img.width, img.height);
  img.resize(width, height);
  
  sliderRad = createSlider(10, 100, 50, 5);
  sliderRad.position(40, 20);
  sliderRad.style('width', '80px');
  
  sliderDis = createSlider(0.1, 0.8, 0.3 , 0.05);
  sliderDis.position(40, 50);
  sliderDis.style('width', '80px');
  
}

function draw() {
  background(0);
  image(img, 0, 0);

  loadPixels();
  let lensRadius = sliderRad.value();
  let distortionFactor = sliderDis.value();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let dx = x - mouseX;
      let dy = y - mouseY;
      let distance = sqrt(dx * dx + dy * dy);
      if (distance < lensRadius) {
        let r = distance / lensRadius;
        let theta = atan2(dy, dx);
        let xDistorted = mouseX + (r * r * lensRadius * distortionFactor) * cos(theta);
        let yDistorted = mouseY + (r * r * lensRadius * distortionFactor) * sin(theta);
        let indexDistorted = (int(yDistorted) * width + int(xDistorted)) * 4;
        let index = (y * width + x) * 4;
        pixels[index] = pixels[indexDistorted];
        pixels[index + 1] = pixels[indexDistorted + 1];
        pixels[index + 2] = pixels[indexDistorted + 2];
      }
    }
  }
  updatePixels();
}