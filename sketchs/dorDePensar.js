
var pmr = new Poemario(POEM_TYPED, FLOW_GROWING, TYPE_CHAR, 400, 50, ["assets/poem1.xml"], 10, true, "assets");

function preload(){    
    backgroundMusic = loadSound('media/WhereIsMyMind.mp3');    
  }

function setup() {
    myCanvas = createCanvas(800, 800);    
    cursor(CROSS)
    backgroundMusic.play();
}

function mouseClicked() {    
   window.open("generatePoetry.html","_self"); 
}

