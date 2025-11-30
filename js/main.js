/* ===================================================================
 * Luther 1.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

(function(html) {

    "use strict";

    html.className = html.className.replace(/\bno-js\b/g, '') + ' js ';

    // Check if device is mobile
    const isMobile = window.matchMedia('(max-width: 800px)').matches;

   /* Animations
    * -------------------------------------------------- */
    const tl = anime.timeline({
        easing: 'easeInOutCubic',
        duration: 600, // Reduced from 800
        autoplay: false
    })
    .add({
        targets: '#loader',
        opacity: 0,
        duration: 500, // Reduced from 1000
        begin: function(anim) {
            window.scrollTo(0, 0);
        }
    })
    //
    .add({
        targets: '#preloader',
        opacity: 0,
        complete: function(anim) {
            document.querySelector("#preloader").style.visibility = "hidden";
            document.querySelector("#preloader").style.display = "none";
        }
    })
    
    // Desktop-only animations (skip on mobile)
    if (!isMobile) {
        tl.add({
            targets: '.s-header',
            translateY: [-100, 0],
            opacity: [0, 1]
        }, '-=200')
        
        .add({
            targets: ['.s-intro .text-pretitle', '.s-intro .text-huge-title'],
            translateX: [100, 0],
            opacity: [0, 1],
            delay: anime.stagger(300) // Reduced from 400
        }) 
        
        .add({
            targets: ['.s-about .about-info__pic', '.s-about .text-pretitle', '.s-about .about-info__text'],
            translateY: [-100, 0],
            opacity: [0, 1],
            delay: anime.stagger(300) // Reduced from 410
        }) 
        
        .add({
            targets: '.circles span',
            keyframes: [
                {opacity: [0, .3]},
                {opacity: [.3, .1], delay: anime.stagger(100, {direction: 'reverse'})}
            ],
            delay: anime.stagger(100, {direction: 'reverse'})
        })
        .add({
            targets: '.intro-social li',
            translateX: [-50, 0],
            opacity: [0, 1],
            delay: anime.stagger(100, {direction: 'reverse'})
        })
        .add({
            targets: '.intro-scrolldown',
            translateY: [100, 0],
            opacity: [0, 1]
        }, '-=600'); // Reduced from -=800
    } else {
        // For mobile, just make everything visible immediately
        tl.add({
            targets: 'body',
            begin: function() {
                document.querySelectorAll('.s-header, .s-intro .text-pretitle, .s-intro .text-huge-title, .s-about .about-info__pic, .s-about .text-pretitle, .s-about .about-info__text, .circles span, .intro-social li, .intro-scrolldown')
                    .forEach(function(el) {
                        el.style.opacity = 1;
                        el.style.transform = 'none';
                    });
            }
        });
    }

   /* Preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {

        const preloader = document.querySelector('#preloader');
        if (!preloader) return;
        
        window.addEventListener('load', function() {
            document.querySelector('html').classList.remove('ss-preload');
            document.querySelector('html').classList.add('ss-loaded');

            document.querySelectorAll('.ss-animated').forEach(function(item){
                item.classList.remove('ss-animated');
            });

            // Play animations faster
            setTimeout(function() {
                tl.play();
            }, 100); // Reduced initial delay
        });
    }; // end ssPreloader


   /* Mobile Menu
    * ---------------------------------------------------- */ 
    const ssMobileMenu = function() {

        const toggleButton = document.querySelector('.mobile-menu-toggle');
        const mainNavWrap = document.querySelector('.main-nav-wrap');
        const siteBody = document.querySelector("body");

        if (!(toggleButton && mainNavWrap)) return;

        toggleButton.addEventListener('click', function(event) {
            event.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        mainNavWrap.querySelectorAll('.main-nav a').forEach(function(link) {
            link.addEventListener("click", function(event) {

                // at 800px and below
                if (window.matchMedia('(max-width: 800px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {

            // above 800px
            if (window.matchMedia('(min-width: 801px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains("is-clicked")) toggleButton.classList.remove("is-clicked");
            }
        });

    }; // end ssMobileMenu


   /* Highlight active menu link on pagescroll
    * ------------------------------------------------------ */
    const ssScrollSpy = function() {

        const sections = document.querySelectorAll(".target-section");

        // Add an event listener listening for scroll
        window.addEventListener("scroll", navHighlight);

        function navHighlight() {
        
            // Get current scroll position
            let scrollY = window.pageYOffset;
        
            // Loop through sections to get height(including padding and border), 
            // top and ID values for each
            sections.forEach(function(current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute("id");
            
               /* If our current scroll position enters the space where current section 
                * on screen is, add .current class to parent element(li) of the thecorresponding 
                * navigation link, else remove it. To know which link is active, we use 
                * sectionId variable we are getting while looping through sections as 
                * an selector
                */
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.add("current");
                } else {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.remove("current");
                }
            });
        }

    }; // end ssScrollSpy


   /* Animate elements if in viewport
    * ------------------------------------------------------ */
    const ssViewAnimate = function() {
        // Skip animations on mobile
        if (window.matchMedia('(max-width: 800px)').matches) {
            // Make all elements visible immediately on mobile
            document.querySelectorAll("[data-animate-el]").forEach(function(el) {
                el.style.opacity = 1;
                el.style.transform = "none";
            });
            document.querySelectorAll("[data-animate-block]").forEach(function(block) {
                block.classList.add("ss-animated");
            });
            return;
        }

        const blocks = document.querySelectorAll("[data-animate-block]");

        window.addEventListener("scroll", viewportAnimation);

        function viewportAnimation() {
            // Skip animations on mobile (check again in case of resize)
            if (window.matchMedia('(max-width: 800px)').matches) return;

            let scrollY = window.pageYOffset;

            blocks.forEach(function(current) {

                const viewportHeight = window.innerHeight;
                const triggerTop = (current.offsetTop + (viewportHeight * .2)) - viewportHeight;
                const blockHeight = current.offsetHeight;
                const blockSpace = triggerTop + blockHeight;
                const inView = scrollY > triggerTop && scrollY <= blockSpace;
                const isAnimated = current.classList.contains("ss-animated");

                if (inView && (!isAnimated)) {
                    anime({
                        targets: current.querySelectorAll("[data-animate-el]"),
                        opacity: [0, 1],
                        translateY: [100, 0],
                        delay: anime.stagger(300, {start: 150}), // Reduced from 400,200
                        duration: 600, // Reduced from 800
                        easing: 'easeInOutCubic',
                        begin: function(anim) {
                            current.classList.add("ss-animated");
                        }
                    });
                }
            });
        }

    }; // end ssViewAnimate


   /* Swiper
    * ------------------------------------------------------ */ 
    const ssSwiper = function() {

        const mySwiper = new Swiper('.swiper-container', {

            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                // when window width is > 400px
                401: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // when window width is > 800px
                801: {
                    slidesPerView: 2,
                    spaceBetween: 32
                },
                // when window width is > 1200px
                1201: {
                    slidesPerView: 2,
                    spaceBetween: 80
                }
            }
         });

    }; // end ssSwiper
    
  const ssLightbox = function () {
    const folioLinks = document.querySelectorAll('.folio-list__item-link');

    folioLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const title = link.getAttribute("data-title");
            const category = link.getAttribute("data-category");
            const imgSrc = link.getAttribute("data-img");
            const behanceLink = link.getAttribute("data-behance");

            const behanceButtonHTML = behanceLink
                ? `
                    <a class="modal-behance-btn"
                       href="${behanceLink}"
                       target="_blank"
                       rel="noopener">
                       View full project on Behance
                    </a>
                  `
                : "";

            const modalHTML = `
                <div class="modal-content">
                    <img src="${imgSrc}" alt="${title}"
                         style="max-width:100%; border-radius: 6px; margin-bottom: 15px;">
                    <h2>${title}</h2>
                    <p style="color: #777;">${category}</p>
                    ${behanceButtonHTML}
                </div>
            `;

            const instance = basicLightbox.create(modalHTML, {
                onShow: function (instance) {
                    document.addEventListener("keydown", function (event) {
                        if (event.key === "Escape") instance.close();
                    });
                }
            });

            instance.show();
        });
    });
};

    
   /* Alert boxes
    * ------------------------------------------------------ */
    const ssAlertBoxes = function() {

        const boxes = document.querySelectorAll('.alert-box');
  
        boxes.forEach(function(box){

            box.addEventListener('click', function(event) {
                if (event.target.matches(".alert-box__close")) {
                    event.stopPropagation();
                    event.target.parentElement.classList.add("hideit");

                    setTimeout(function(){
                        box.style.display = "none";
                    }, 500)
                }    
            });

        })

    }; // end ssAlertBoxes


   /* Smoothscroll
    * ------------------------------------------------------ */
    const ssMoveTo = function(){

        const easeFunctions = {
            easeInQuad: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                t /= d;
                return -c * t* (t - 2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            }
        }

        const triggers = document.querySelectorAll('.smoothscroll');
        
        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);

        triggers.forEach(function(trigger) {
            moveTo.registerTrigger(trigger);
        });

    }; // end ssMoveTo

    // Add Behance button functionality inside popup
    document.querySelectorAll('.folio-list__item-link').forEach(item => {
        item.addEventListener('click', function () {

            const behanceLink = this.getAttribute('data-behance');
            const behanceBtn = document.getElementById('behance-btn');

            if (behanceLink && behanceBtn) {
                behanceBtn.href = behanceLink;
                behanceBtn.style.display = 'inline-block';
            } else if (behanceBtn) {
                behanceBtn.style.display = 'none';
            }
        });
    });


   /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssMobileMenu();
        ssScrollSpy();
        ssViewAnimate();
        ssSwiper();
        ssLightbox();
        ssAlertBoxes();
        ssMoveTo();

    })();
    
    // Cursor reactive hero gradient
    window.addEventListener("mousemove", function (event) {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;

    document.documentElement.style.setProperty("--mx", x + "%");
    document.documentElement.style.setProperty("--my", y + "%");
    });

})(document.documentElement);

