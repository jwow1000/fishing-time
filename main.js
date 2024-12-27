// import helper functions
import { adjustVolume, playVideo } from "./helpers.js";

// make sure webflow content is loaded to DOM
window.Webflow.push(() => {

  // play videos in view
  const movies = document.querySelectorAll(".video-loop-container");

  movies.forEach((item) => {
    const vid = item.querySelector(".video-loop");
    const muteImg = item.querySelector(".vol-img");
    const onImg = item.querySelector(".vol-img.on");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          let volRamping = false;

          function handleClick(event) {
            if (!volRamping) {
              if (vid.muted) {
                adjustVolume(vid, 1, 500, volRamping);
                onImg.style.opacity = 0.61;
                muteImg.style.opacity = 0;
              } else {
                adjustVolume(vid, 0, 500, volRamping);
                onImg.style.opacity = 0;
                muteImg.style.opacity = 0.61;
              }
            }
          }

          if (entry.isIntersecting) {
            // make sure muted
            vid.muted = true;
            vid.volume = 0;

            // trigger play
            playVideo( vid );

            // add event listener
            if (!vid.hasAttribute("data-click-added")) {
              vid.addEventListener("click", handleClick);
              vid.setAttribute("data-click-added", true);
            }
          } else {
            // pause playback
            vid.pause();

            // mute the item
            vid.muted = true;

            // remove event listener
            if (vid.hasAttribute("data-click-added")) {
              vid.removeEventListener("click", handleClick);
              vid.removeAttribute("data-click-added");
            }
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(vid);
  });
});
