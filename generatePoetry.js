let lines = [];
let words = [];
let font;
let btn;


function preload(){ 
  handWrite = loadFont("fonts/HandWrite.ttf");  
  anonymousPro = loadFont("fonts/AnonymousPro.ttf");  
	courierNew = loadFont("fonts/CourierNew.ttf");  
  dadaDict = loadStrings("dictionary/alexSearch.txt");
  fingimentoDict = loadStrings('dictionary/fingimento.txt'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  fill(255);  
  //textSize(32);  
  //text("que apetece escrever hoje?");
  
  
  // slice up text from source into array
  for (let i = 0; i < dadaDict.length; i++) {
    let pieces = split(dadaDict[i], " ");
    // Add the pieces to the larger array;
    for (let j = 0; j < pieces.length; j++) {
      let word = pieces[j];
      if (word.length > 0) {
        words = append(words, word);
      }
    }
  }

  //detect witch button is clicked 
document.querySelectorAll('button').forEach(occurence => {
    let id = occurence.getAttribute('id');
     occurence.addEventListener('click', function() {
       console.log('The button with ID ' + id + ' was clicked!')    
       switch (id) {
         case 'nostalgia':           
           btn = 'nostalgia';
           break;
           case 'fragmentacao':           
           btn = 'fragmentacao';
           break;
           case 'dor':           
           btn = 'dor';
           break;
           case 'fingimento':           
           btn = 'fingimento';
           break;
           case 'dada':           
           btn = 'dada';
           break;
           case 'restart':           
           btn = 'restart';
           break;   
         default:
           console.log(`Sorry, we are out of ${id}.`);
       }      
     } );
   });

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() { 
   
}

function download() {
  saveCanvas(cnv,"poem","png");
}

//detect witch button is pressed and execute new instructions
function mouseClicked() { 
  fullscreen(true);  
  switch (btn) {      
      case 'nostalgia':
        setup();
        console.log('develop next step');
      break;
      case 'fragmentacao':
        setup();
        console.log('develop next step');
      break;
      case 'dor':
        setup();
        console.log('develop next step');
      break;
      case 'fingimento':
        setup();
        generateFingimentoText();
        shuffle(fingimentoDict, true);
      break;
      case 'dada':           
        generateDadaText();      
        loop();
      break;     
      default:
        console.log("no button pressed");
        break;
    }      
}

function btnDada() {
    setup();
    generateDadaText();      
    loop();
}

// generate fingimento poetry
function generateFingimentoText() {
  textFont(handWrite);
  textSize(44);
  for (let i = 0; i < fingimentoDict.length; i++) {
    fill(128+(i*10));
    text(fingimentoDict[i], 60, 50+i*30);
  }
}

// generate dada poetry
function generateDadaText() {
  background(0);  
  textSize(32);
  textFont(courierNew);

  let i = 0; 
  let j = 0;
  let sentenceLength = 0;
  let poemLength = min(8, int(5 + random(10)));
  let stanzaLength = int(random(5) + 2);
  let next;
  let word;
  let theLine = "";
  let spacing = "";
  
    while (poemLength >= 0) {
    next = int(random(words.length));
    word = words[next];

    theLine += spacing + word;
    spacing = " ";
    sentenceLength++;
      
    // Print out a line every now and again...
    if (sentenceLength > 10 || (random(sentenceLength) > 2.5 && word.length > 1)) {
      text(theLine, 20, (j * 40) + 50 + random(5)); 
      j++;
      for (let s = int (random (4)); s > 0; s--) {
        spacing += " ";       
      }
      theLine = "";      
      sentenceLength = 0;
      if (poemLength % stanzaLength == 0) {
        j++;
      }
      poemLength--;             
    }      
  } 
}



