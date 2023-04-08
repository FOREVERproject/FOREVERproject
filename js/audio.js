
/*
let progress = document.getElementById("progress");
let song = document.getElementById("audio-player");
let ctrlIcon = document.getElementById("audio-ctrlIcon");

song.onloadedmetadata = function(){
  progress.max = song.duration;
  progress.value = song.currentTime;
}

function playPause(){
  if(ctrlIcon.classList.contains("bi-pause-circle")){
    song.pause();
    ctrlIcon.classList.remove("bi-pause-circle");
    ctrlIcon.classList.add("bi-play-circle");

  }
  else{
    song.play();
    ctrlIcon.classList.add("bi-pause-circle");
    ctrlIcon.classList.remove("bi-play-circle");
  }
}

if(song.play()){
  setInterval(()=>{
      progress.value = song.currentTime;
  },100)
}
progress.onchange = function(){
  song.currentTime = 0.001;
  song.play();

  song.currentTime = progress.value;
  ctrlIcon.classList.add("bi-pause-circle");
  ctrlIcon.classList.remove("bi-play-circle");
}
*/
