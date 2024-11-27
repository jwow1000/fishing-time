// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import helper functions
import { adjustVolume } from './helpers.js';

// make sure webflow content is loaded to DOM
Webflow.push(function() {
  // select container from webflow
  const container = document.querySelector(".container");

  // initalize swiper
  const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'vertical',
    loop: true,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });
  
  // play videos in view
  const movies = document.querySelectorAll(".video-loop-container");

  let volRamping = false;
  
  movies.forEach( (item) => {
  
  	const vid = item.querySelector('.video-loop');
  	const muteImg = item.querySelector('.vol-img');
    const onImg = item.querySelector('.vol-img.on');
    
    //console.log("mute, on", muteImg, onImg);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          function handleClick( event ) {
            if( !volRamping ) {
            	if( vid.muted ) {
                adjustVolume( vid, 1, 500, volRamping );
                onImg.style.opacity = 1;
                muteImg.style.opacity = 0;
              } else {
                adjustVolume( vid, 0, 500, volRamping );
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
              vid.play();
              
             
              // add event listener
              if(!vid.hasAttribute('data-click-added') ) {
                vid.addEventListener("click", handleClick);
                vid.setAttribute('data-click-added', true);
              }
              
          } else {
          		// pause playback
              vid.pause();
              
              // mute the item
              vid.muted = true;
              
              // remove event listener
              if(!vid.hasAttribute('data-click-added') ) {
                vid.removeEventListener("click", handleClick);
                vid.removeAttribute('data-click-added');
              }
              
          }
        });
      }, { threshold: 0 });

      observer.observe( vid );
  });
});



