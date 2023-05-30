var titulo = "Pessoa Generativo.\n\n\n\"Como sabemos o que será, se nem ele sabe o que foi?\""
let fp1, fp2;

function preload(){
	font = loadFont("fonts/CourierNew.ttf");  
    soundFormats('mp3', 'ogg');
    fp1 = loadSound('audios/fp1');
    fp2 = loadSound('audios/fp2');
}

function setup() { 
    createCanvas(800, 800);    
    
}

function mouseClicked(){     
        fp1.play();
        fp2.play();      
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

