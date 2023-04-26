let figuresCount = 100;
let shapeSize = 4;

function setup() {
  createCanvas(400, 400);
  shapesCount = createInput(figuresCount);
  shapesCount.value(100);

  shapeSizesInput = createInput(shapeSize);
  shapeSizesInput.value(10);

  shapesCount.input(() => {
    figuresCount = parseInt(shapesCount.value());
  });

  shapeSizesInput.input(() => {
    shapeSize = parseInt(shapeSizesInput.value());
  });

}

let rotationAngle = 0;

function draw() {
  background(220);
  noFill();
  strokeWeight(2);

  
  for (let i = 0; i < figuresCount; i++) {
    let squareW = shapeSize * (figuresCount - i);

    rotate(radians(rotationAngle)); 
    stroke("black");
    rectMode(CENTER);
    rect(-squareW/2, -squareW/2, squareW, squareW); 
    rect(-squareW/3, -squareW/3, squareW, squareW); 
  }
  
  rotationAngle += 1/5; 
}
