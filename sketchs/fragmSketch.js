var Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Constraint = Matter.Constraint,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint

var engine
var world
var mConstraint
var wordBlock = []
var ground
var boundaries = []

const yAxis = 1
let prevX, prevY
let poemI = 0
let ptSize
let bgCol


let poem = "não sei quantas almas tenho cada momento mudei continuamente me estranho nunca me vi nem achei torno-me eles e não sou eu sou minha própria paisagem assisto à minha passagem";



function preload(){ 
  font = loadFont('assets/CourierNew.ttf');  
  fragmentos = loadSound('media/fragmentacao.mp3');
}


function setup() {
   myCanvas = createCanvas(800, 800);
 // var canvas = createCanvas(windowWidth, windowHeight)  
  fill(255);
  initialSize = min(width, height)
  cursor(CROSS)
  ptSize = windowHeight/15
  engine = Engine.create()
  world = engine.world
  // Make Everything Float:
  //engine.world.gravity.y = -1

//  make a floor (new Boundary (x, y, width, height, angle)
  boundaries.push(new Boundary (width/2, height-5, width, 10, 0))
  boundaries.push(new Boundary (width/2, 5, width, 10, 0))
  boundaries.push(new Boundary (5, height/2, 10, height, 0))
  boundaries.push(new Boundary (width-5, height/2, 10, height, 0))
  
  var canvasMouse = Mouse.create(canvas.elt)
  canvasMouse.pixelRatio = pixelDensity()
  var options = {
    mouse: canvasMouse
  }
  mConstraint = MouseConstraint.create(engine, options)
  World.add(world, mConstraint)  
}



function draw() {
  Engine.update(engine)


   //gradHeight = height/8
  
 
  for (var i = 0; i < wordBlock.length; i++) {
    wordBlock[i].show();
    if (wordBlock[i].isOffScreen()){
      // splice removes objects from screen
      wordBlock[i].removeFromWorld()
      wordBlock.splice(i, 1)
      i--
    }
  }
  
  /*  for (var i = 0; i < boundaries.length; i++) {
    boundaries[i].show();
  }  */
  
}



function mouseClicked(){  
  if (mConstraint.body) {
     return
  } 
  let word = split(poem, ' ')
  wordBlock.push(new Rectangle(mouseX, mouseY, this.w, this.h, word[poemI]))   
  poemI = (poemI + 1) % poem.length
  if (!fragmentos.isPlaying()) {
    fragmentos.play();
  } 
  
}

function download() {
  saveCanvas(myCanvas,"Fragmentos","png");
}



/*function windowResized() {
  resizeCanvas(windowWidth, windowHeight)  
}*/



function Rectangle(x, y, w, h, poem) {
  var options = {
    friction: .8,
    restitution: .4,
    //angle : (random(0, -Math.PI))
    //density: .001
  }

  

  // textToPoints(glyph, x, y, ptSize)
  this.ptSize = ptSize
  this.poem = poemI
  let points = font.textToPoints(poem, 0, 0, this.ptSize)
  let bounds = font.textBounds(poem, 0, 0, this.ptSize)

  this.w = bounds.w
  this.h = bounds.h
  //this.density = 100
  
  
  for (let pt of points){
    pt.x = pt.x - bounds.x - bounds.w/2
    pt.y = pt.y - bounds.y - bounds.h/2
  }
  
  
  // defining center, then defining bounds
  this.body = Bodies.rectangle(x + bounds.w/2, y + bounds.h/2, bounds.w, bounds.h, options)
  
  this.poem = poem
  this.bounds = bounds
  World.add(world, this.body)

  this.isOffScreen = function() {
    var pos = this.body.position
    return (pos.y > height + 20) 
  }
  
  this.removeFromWorld = function(){
    World.remove(world, this.body)
  }
  
  this.show = function() {
    var pos = this.body.position
    var angle = this.body.angle

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    //noFill()
    //strokeWeight(1)
    noStroke();
    fill(0); 
    rect(0, 0, this.bounds.w, this.bounds.h);
    fill(255); 
    noStroke();
    textFont(font);
    textSize(ptSize/2);
    textAlign(CENTER, CENTER);
    translate(0, 0);
    text(this.poem, 0, -this.bounds.h/5);
    pop();
  }
}



function Boundary(x, y, w, h, a) {
  var options = {
    friction: .3,
    restitution: .06,
    isStatic: true,
    angle: a
  }

  this.body = Bodies.rectangle(x, y, w, h, options)
  this.w = w
  this.h = h
  World.add(world, this.body)

  this.show = function() {
    var pos = this.body.position
    var angle = this.body.angle

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    noStroke();
    fill(255);
    rect(0, 0, this.w, this.h);
    pop();

  }
}



