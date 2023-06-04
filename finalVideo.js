var video;

function setup() { 
  noCanvas();   
  video = createVideo("assets/saidaTomas.mp4");  
  video.play(); 
  video.size(1400, 800);     
  video.showControls();
  video.onended(backToStart);   
}

//go to generate poetry page
function backToStart() {
  window.open("index.html","_self");
}

function mouseClicked() {
  fullscreen(true); 
}