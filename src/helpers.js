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
