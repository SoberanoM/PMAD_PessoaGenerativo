
var draw = new Poemario(POEM_TYPED, FLOW_STATIC_ALL, TYPE_LINE, 400, 50, ["assets/dor_de_pensar.xml"], 10, true, "assets/dorDePensarSounds");

function preload(){    
    backgroundMusic = loadSound('media/WhereIsMyMind.mp3');    
  }

function setup() {
    myCanvas = createCanvas(800, 800);    
    cursor(CROSS)
    backgroundMusic.play();
    backgroundMusic.loop();
}

function mouseClicked() {    
   //fullscreen(true);
   //window.open("generatePoetry.html","_self"); 
}

