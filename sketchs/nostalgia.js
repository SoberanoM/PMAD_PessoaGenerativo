
var pm = new Poemario(POEM_TYPED, FLOW_STATIC_ALL, TYPE_CHAR, 400, 60, ["assets/nostalgia.xml"], 10, true, "assets/nostalgiaSounds");

var acceleration = 0.0098;
var nDrops = 1000;
var drops = [];

function preload(){    
    backgroundMusic = loadSound('media/WhereIsMyMind.mp3');    
  }

function setup() {  
  createCanvas(windowWidth, windowHeight);  
  backgroundMusic.play();
  backgroundMusic.loop();
  

  //generate new drops every time, by adding it to array
  for (i = 0; i < nDrops; i++) {
    drops.push(new Drop());
  }    
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {    
   //fullscreen(true);
   //window.open("generatePoetry.html","_self"); 
}

function draw() {  
  clear();
  drops.forEach(function(d) {
    d.drawAndDrop();
  });
}

//define format for drops, randomized forms
function Drop() { 
  this.initX = function() {
    this.x = random() * width;
  };
  this.initY = function() {
    this.y = -random() * height / 3; // Initialize rain at the screen area
  };

  this.initX();
  this.y = random() * height;

  this.length = random() * 10;
  this.speed = random();

  this.drawAndDrop = function() {
    this.draw();
    this.drop();
  };

  this.draw = function() { //draw drops 
    line(this.x, this.y, this.x, this.y + this.length);
    stroke(255);
  };

  this.drop = function() {
    if (this.y < height) {
      this.y += this.speed;
      this.speed += acceleration;
    } else {
      this.speed = random();
      this.initY();
      this.initX();
    }
  };
}

