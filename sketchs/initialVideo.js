var video;

function setup() {   
    noCanvas();   
    video = createVideo("media/EntradaTomas.mp4");  
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
  //fullscreen(true); 
}



