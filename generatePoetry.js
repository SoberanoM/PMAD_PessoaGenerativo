let lines = [];
let words = [];
let font;
let autor;

var rules = {
  "A":["C","F","E"],
  "C":["G","E"],
  "E":["C","G"],
  "F":["A","C"],
  "G":["E","F","C"]
};

var seqIndex = 0;
var noteIndex = -1;
let initSeq = ["C"];
let newTokens = [];
let sequences = [initSeq, []];
let maxNumSequences = 8;
let maxSequenceLength = 30;

function preload(){
	font = loadFont("assets/CourierNew.ttf");  
  lines = loadStrings("assets/soares.txt"); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //createCanvas(800, 800)

  fill(255);
  textFont(font);
  textSize(20);
  //textAlign(CENTER);
  
  // slice up text from source into array
  for (let i = 0; i < lines.length; i++) {
    let pieces = split(lines[i], " ");
    // Add the pieces to the larger array;
    for (let j = 0; j < pieces.length; j++) {
      let word = pieces[j];
      if (word.length > 0) {
        words = append(words, word);
      }
    }
  }

  //detect witch button is clicked by user
  document.querySelectorAll('button').forEach(occurence => {
    let id = occurence.getAttribute('id');
     occurence.addEventListener('click', function() {
       console.log('The button with ID ' + id + ' was clicked!')   
 
       switch (id) {
         case 'pessoa':           
           autor = 'pessoa';
           break;
           case 'campos':           
           autor = 'campos';
           break;
           case 'caeiro':           
           autor = 'caeiro';
           break;
           case 'reis':           
           autor = 'reis';
           break;
           case 'soares':           
           autor = 'soares';
           break;
           case 'search':           
           autor = 'search';
           break;   
         default:
           console.log(`Sorry, we are out of ${id}.`);
       }
       console.log(autor);
     } );
   });

   //background generative sounds 
   synth = new p5.PolySynth();
   sloop = new p5.SoundLoop(soundLoop, 0.7); 

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() { 
   // togglePlayPause();   
}

function mousePressed() { 
  if (autor === 'soares') {
    generateSoaresText();
    togglePlayPause(); 
    loop();
  } else {
    setup();
    console.log('develop next step');
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    //vid.loop();
    //vid.speed(1);
  } else if (keyCode === DOWN_ARROW) {
    //vid.stop();
  }
}

function generateSoaresText() {
  background(0);
  
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

function soundLoop(cycleStartTime) {
  noteIndex++;
  if (noteIndex >= min(sequences[seqIndex].length, maxSequenceLength)) {
    nextSequence();
  }
  var token = sequences[seqIndex][noteIndex];

  var pitch = token + "4";
  var velocity = 0.6;
  var beatSeconds = 0.4; // Define 1 beat as half a second
  var duration = random([beatSeconds, beatSeconds/2, beatSeconds/2, beatSeconds/4]);
  this.interval = duration;
  synth.play(pitch, velocity, cycleStartTime, duration);

  newTokens = rules[token];
  sequences[seqIndex+1] = sequences[seqIndex+1].concat(newTokens);
  // If the sequence overruns maxSequenceLength, truncate it and proceed to next sequence
  if (sequences[seqIndex+1].length >= maxSequenceLength) {
    sequences[seqIndex+1] = sequences[seqIndex+1].slice(0, maxSequenceLength);
    nextSequence();
  }
}

function stepSoundLoop() {
  sloop.stop();
  soundLoop(0);
}

function togglePlayPause() {
  // Play/pause
  if (sloop.isPlaying) {
    sloop.pause();
  } else {
    sloop.maxIterations = Infinity;
    sloop.start();
  }
}

function nextSequence() {
  noteIndex = 0;
  seqIndex++;
  sequences.push([]); // Add a new empty sequence
  // If the number of sequences overruns maxNumSequences, remove oldest
  if (sequences.length > maxNumSequences) {
    seqIndex--;
    sequences.shift(); // Removes first element from array
  }
}



