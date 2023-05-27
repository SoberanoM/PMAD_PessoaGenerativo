var video;

function setup() { 
  
    noCanvas();
    video = createVideo("Videos/intro.webm");
    video.size(1000, 1400); 
    //video.play();
    video.showControls();
    //video.onended(video.hide());   
}

function next() {
  video.hide(); 
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


