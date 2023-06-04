var titulo = "Pessoa Generativo.\n\n\n\"Como sabemos o que será, se nem ele sabe o que foi?\""
let fp1, fp2;
let style;

function preload(){
	font = loadFont("assets/CourierNew.ttf");  
    soundFormats('mp3', 'ogg');
    fp1 = loadSound('assets/fp1');
    fp2 = loadSound('assets/fp2');   
}

function setup() {      ;
    createCanvas(800, 800);
    fp2.onended(enableButton);               
}

function mouseClicked(){   
    fullscreen(true); 
    if (!fp2.isPlaying()) {
        fp2.play();      
    } else {
        console.log("Pessoa is still thinking!!!");
    }               
}

function enableButton() {
   // document.querySelector('#seguinte').disabled = true;
    document.querySelector("#seguinte").style.visibility = "visible";
    //document.querySelector("#seguinte").classList.add("generateButtons button5");
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

 
