var video;

function setup() {   
    noCanvas();   
    video = createVideo("assets/EntradaTomas.mp4");  
    video.play(); 
    video.size(1400, 800);     
    video.showControls();
    video.onended(goToPoemario);   
}

//go to generate poetry page
function goToPoemario() {
  window.open("generatePoetry.html","_self");
}

function mouseClicked() {
  fullscreen(true); 
}



//não estão a ser utilizados

/*
function next() {
  video.hide(); 
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

*/

