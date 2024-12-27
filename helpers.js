export function adjustVolume(video, targetVolume, duration = 500, ramping) {
  // Unmute if ramping up the volume
  if (targetVolume > 0) { 
    video.muted = false;
    ramping = true;
  }
  
  const startVolume = video.volume;
  const volumeDifference = targetVolume - startVolume;
  const stepTime = 50; // Time interval for each step in ms
  const steps = duration / stepTime;
  let currentStep = 0;
  
  const volumeInterval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      video.volume = Math.pow( startVolume + volumeDifference * progress, 2);
      
      if (currentStep >= steps) {
          clearInterval(volumeInterval);
          if (targetVolume === 0) {
            video.muted = true; // Mute after ramping down
            ramping = false;
          }
      }
  }, stepTime);
}

// play that listens to load state
export function playVideo( video ) {
  if (video.readyState >= 3) { // 3 means the video is loaded enough to play
    video.play().catch(error => {
      console.error("Error playing video:", error);
    });
  } else {
    video.addEventListener("canplay", () => {
      video.play().catch(error => {
        console.error("Error playing video:", error);
      });
    }, { once: true }); // Ensures the event listener is triggered only once
  }
}
