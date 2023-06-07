var titulo = "Pessoa Generativo.\n\n\n\"Como sabemos o que será, se nem ele sabe o que foi?\""
let fp1, fp2;
let voicePlayed = false;
//let style;


function preload(){
	font = loadFont("assets/CourierNew.ttf");  
    soundFormats('mp3', 'ogg');
    type = loadSound('media/typewriter.mp3');
    fp1 = loadSound('media/fp1');
    fp2 = loadSound('media/fp2');   
}

function setup() {      ;
    type.play(); 
    createCanvas(800, 800);
    fp2.onended(enableButton); 
    cursor(CROSS);              
}

function mouseMoved(event) {
    console.log(event);
    if (!type.isPlaying()) {
        type.play();      
    }   
}

function mouseClicked(){   
    fullscreen(true); 
    if (!fp2.isPlaying() && voicePlayed === false) {
        fp2.play();      
        voicePlayed = true;
    } else {
        console.log("Pessoa is still thinking!!!");
    }               
}

function enableButton() {
   // document.querySelector('#seguinte').disabled = true;
    document.querySelector("#seguinte").style.visibility = "visible";   
}


//exibir título
function draw() {   
    background(0);
    fill(255);
    textFont(font);   
    textAlign(LEFT);
    textSize(44);
    textLeading((mouseY / width) * 64);     
    text(titulo, 150, 150, 400, 400);         
}

 
