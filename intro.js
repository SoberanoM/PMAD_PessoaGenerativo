var titulo = "Pessoa Generativo.\n\n\n\"Como sabemos o que será, se nem ele sabe o que foi?\""

function preload(){
	font = loadFont("assets/CourierNew.ttf");   
}

function setup() { 

    createCanvas(800, 800);    
    
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

function next() {   
    window.open("pessoaGenerativo.html", "_self");
}