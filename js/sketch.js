//VARIABLES
let captureVideo = false;
let backgroundImage = false;
let shapeShiny = false;
let shapeRound = true;
var sketchWidth;
var sketchHeight;
let speedY = 0;
let speedX = 0;


//PRELOAD
function preload() {
  //img = loadImage('bg-test-bluepink-radial.png');
}

//SETUP
function setup() {
  sketchWidth = windowWidth;
  sketchHeight = windowHeight;
  //let renderer = createCanvas(sketchWidth, sketchHeight,WEBGL);
  let renderer = createCanvas(408,408,WEBGL);
  renderer.parent("shape-container")
  renderer.style("display", "block")
  renderer.mouseClicked(my_function);
  //renderer.position(0,0);
  //renderer.style('z-index', '-99999999999');
  frameRate(60);
  pixelDensity(1);




}

let col = 250; // variable to store color
let dir = 1; // how to change direction
let acc = 0.1; // speed the color increases

//DRAW
function draw() {
  //colorMode(HSB, 100);
  angleMode(DEGREES); // change the mode to DEGREES.

  //colors
  let colorWhite = color(255, 255, 255);
  let colorBlue = color(122, 203, 207);
  let colorRed =  color(255, 0, 0);

  //background.
  background(col, col, col); //default background.
  if(col < 250){
    col = col + (acc * dir);
  }else{
    col = 250;
  }



  strokeColorSelected = '#222222';
  strokeWeight(0.5);
  if(backgroundImage == true){
    push(); //apply background image to rect.
      translate(0,0,-height);
      texture(img);

      rectMode(CENTER);
      rect(0, 0, width*1.2, height*1.2);
    pop();
  }

  //lights.
  lights();
  ambientLight(55);
  directionalLight(100, 100, 100, height / 2, width / 2, -1);
  //ambientLight(70);


  //capture video start.
  if(captureVideo == true && frameCount === 2){
    capturer.start();
  }

  //
  //DRAW - ASSETS
  //

  push();
    //SHINY
    if(shapeShiny == true){
      lights();
      let dx = 300;
      let dy = 200;
      let dz = -600;
      let v = createVector(dx, dy, dz);
      directionalLight(255, 255, 255, v);

      if(shapeRound == true){
        shininess(50);
      } else {
        shininess(10);
      }
      specularColor(colorBlue);
      specularMaterial(colorBlue);
    }
    //MATTE
    else{
      lights();
      let dx = 300;
      let dy = 200;
      let dz = -600;
      let v = createVector(dx, dy, dz);
      directionalLight(255, 255, 255, v);

      //ambientMaterial(colorBlue);
      fill('#ffffff');
    }
    //noStroke();
    rotateX(0.6*frameCount);
    rotateY(0.6*frameCount);
    //rotateX(speedX*frameCount);
    //rotateY(speedY*frameCount);

    //
    if(shapeRound == true){
      //torus(70,33, 96, 64);
      cubeShape();
    }else{
      box(200,400,200);
    }
  pop();

  //DRAW - CAPTURE VIDEO
  if (captureVideo == true && frameCount < (60 * 10) + 2){
  	capturer.capture(canvas)
  } else if (captureVideo == true && frameCount === (60 * 10) + 2) {
    capturer.save()
    capturer.stop()
  }






}
function mouseClicked(event) {
  //console.log(event + "clicked here!");
  //game.player.clickCookie();
}

function my_function(){
  console.log("clicked here!");
  game.player.clickCookie();
  col = 242;
}

function cubeShape(){
  box(100,100,100);
}
