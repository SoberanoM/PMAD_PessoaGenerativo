let lines = [];
let words = [];
let font;
let btn;

function preload(){ 
  handWrite = loadFont("assets/HandWrite.ttf");  
  anonymousPro = loadFont("assets/AnonymousPro.ttf");  
  travesty = loadFont("assets/Travesty.ttf");
	courierNew = loadFont("assets/CourierNew.ttf");  
  dadaDict = loadStrings("assets/alexSearch.txt");
  fingimentoDict = loadStrings('assets/fingimento.txt'); 
  //soundFormats('mp3', 'ogg');
  alexSearch = loadSound('media/AlexSearch.mp3');
  tomas = loadSound('media/fingimento.wav');
}

function setup() {
  myCanvas = createCanvas(800, 670);
  
  fill(255); //text 
  cursor(CROSS);

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

    //detect witch button is clicked, and then execute options when mouse clicked
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


//detect witch button is pressed and execute instructions
function mouseClicked() { 
  if (alexSearch.isPlaying() && btn != "dada") {
    alexSearch.stop();
  } else if (tomas.isPlaying() && btn != "fingimento") {
    tomas.stop();
  }
 // fullscreen(true);  
  switch (btn) {      
      case 'nostalgia':
        setup();       
        window.open("nostalgia.html","_self");
        console.log('Generate new poem with poemario.js, from Pessoa words');
      break;
      case 'fragmentacao':
        setup();
        window.open("fragmentacao.html","_self");
        console.log('Generate text like concrete poetry, words falling inside rectangles, from Pessoa words');
      break;
      case 'dor':
        setup();
        window.open("dorDePensar.html","_self");
        console.log('Generate new poem with poemario.js, from Pessoa words');
      break;
      case 'fingimento':
        setup();
        generateFingimentoText();
        shuffle(fingimentoDict, true);
        if (!tomas.isPlaying()) {
          tomas.play();          
        }
        console.log('Generate new poem with random lines from it');
      break;
      case 'dada':           
        generateDadaText();              
        loop();
        if (!alexSearch.isPlaying()) {
          alexSearch.play();          
        }
        console.log('Generate random text from Alexander Search words');
      break;     
      default:
        console.log("no button pressed");
        break;
    }      
}

function download() {
  saveCanvas(myCanvas,"PessoaGenerativo","png");
}

function btnDada() {
    setup();
    generateDadaText();          
    loop();
}


// generate fingimento poetry with shuffle function
function generateFingimentoText() {
  textFont(travesty);
  textSize(32);
  for (let i = 0; i < fingimentoDict.length; i++) {
    fill(128+(i*10));
    text(fingimentoDict[i], 60, 50+i*30);
  }
}

// generate dada poetry, picking words from txt to array and generate new lines with random words
function generateDadaText() {
  background(0);  
  textSize(22);
  textFont(anonymousPro);

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
      
    // Print out a new line 
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



