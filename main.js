import Swiper from "swiper";
import "swiper/css";
// import helper functions
import { adjustVolume, playVideo } from "./helpers.js";
import  { captureScroll } from "./getScroll.js";

// make sure webflow content is loaded to DOM
window.Webflow.push(() => {

  // select container from webflow
  const container = document.querySelector(".swiper-wrapper");
  
  // capture scroll up or down
  container.addEventListener("scroll", function() {
    console.log("check scroll: ", container.scrollTop)
  });
  
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
                onImg.style.opacity = 1;
                muteImg.style.opacity = 0;
              } else {
                adjustVolume(vid, 0, 500, volRamping);
                onImg.style.opacity = 0;
                muteImg.style.opacity = 1;
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
