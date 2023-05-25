var video;


function setup() { 
  
    noCanvas();
    video = createVideo("assets/intro.webm");
    video.size(1000, 1400); 
    //video.play();
    //video.showControls();
    //video.onended(video.hide()); 
  
}

//exibir título
function draw() {
  background(50);
  fill(255);
  textFont(font);
  textSize(32);  
  textAlign(LEFT);
  textSize(36);
  textLeading((mouseX / width) * 64);  
  text(titulo, 150, 150, 300, 300);
  console.log("mouseX: ", mouseX);
  console.log("width: ", width);
  console.log("startVideo: ", width);
  if (mouseX > 290) {
    startVideo = true;
    console.log("startVideo: ", width);
  }
}

function next() {
  video.hide();
  window.open("insideHead.html", "_self");
}

//display alert message
function sayDone(elt) {
  alert('done playing ' + elt.src);
}

function playVideoIntro() { 
  video.loop();
  video.speed(1);
}

function stopVideoIntro() {
  video.stop();
}

function pauseVideoIntro() {
  video.pause();
}

//starts and stops video with arrow up and down (optional)
function keyPressed() {
  if (keyCode === UP_ARROW) {
    video.loop();
    video.speed(1);
  } else if (keyCode === DOWN_ARROW) {
    video.stop();
  }
}


