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

var boundaries = []
let words = [];
let fragmentosPlayed = false;
let poemI = 0
let ptSize



function preload(){ 
  font = loadFont('assets/CourierNew.ttf');  
  fragmentos = loadSound('media/fragmentacao.mp3');
  fragTxt = loadStrings("assets/fragmentacao.txt");
}


function setup() {
  myCanvas = createCanvas(800, 800); 
  fill(0);
  initialSize = min(width, height)
  cursor(CROSS)
  ptSize = windowHeight/15
  engine = Engine.create()
  world = engine.world
 
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
  fragmentos.onended(enableButton);

   // slice up text from source into array
   for (let i = 0; i < fragTxt.length; i++) {
    let pieces = split(fragTxt[i], " ");
    // Add the pieces to the larger array;
    for (let j = 0; j < pieces.length; j++) {
      let word = pieces[j];
      if (word.length > 0) {
        words = append(words, word);
      }
    }
  }
}


function draw() {
  Engine.update(engine)  
  for (var i = 0; i < wordBlock.length; i++) {
    wordBlock[i].show();
    if (wordBlock[i].isOffScreen()){
      // splice removes objects from screen
      wordBlock[i].removeFromWorld()
      wordBlock.splice(i, 1)
      i--
    }
  } 
}

function enableButton() { 
   document.querySelector("#quit").style.visibility = "visible";  
}

function mouseClicked(){ 
  // fullscreen(true);   
  pickWords();  
  if (!fragmentos.isPlaying() && fragmentosPlayed === false) {
    fragmentos.play();
    fragmentosPlayed = true;
  }    
}


function pickWords(){
    if (mConstraint.body) {
        return
    }   
    wordBlock.push(new Rectangle(mouseX, mouseY, this.w, this.h, words[poemI]))   
    poemI = (poemI + 1) % words.length
    console.log(words[poemI]);    
}

function download() {
  saveCanvas(myCanvas,"Fragmentos","png");
}


//draws rectangle with word inside to give efect of concrete poetry
function Rectangle(x, y, w, h, poem) {
  var options = {
    friction: .8,
    restitution: .4  
}  

  // textToPoints(glyph, x, y, ptSize)
  this.ptSize = ptSize
  this.poem = poemI
  let points = font.textToPoints(poem, 0, 0, this.ptSize)
  let bounds = font.textBounds(poem, 0, 0, this.ptSize)

  this.w = bounds.w
  this.h = bounds.h
   
  
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



