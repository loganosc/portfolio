// Main JS

document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  html.classList.remove("no-js");
  html.classList.add("js");

  const isMobile = window.matchMedia("(max-width: 800px)").matches;

  // Cursor spotlight gradient
  const grad = document.querySelector(".page-gradient");

  function setHighlight(xPercent, yPercent) {
    if (!grad) return;
    document.documentElement.style.setProperty("--spot-x", `${xPercent}%`);
    document.documentElement.style.setProperty("--spot-y", `${yPercent}%`);
  }

  function enableHighlight() {
    document.documentElement.style.setProperty("--highlight-opacity", "1");
  }

  function disableHighlight() {
    document.documentElement.style.setProperty("--highlight-opacity", "0");
  }

  window.addEventListener("pointermove", (event) => {
    if (!grad) return;

    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;

    setHighlight(x, y);
    enableHighlight();
  });

  window.addEventListener("mouseleave", disableHighlight);

  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const main = document.querySelector("main");

  header?.addEventListener("mouseenter", disableHighlight);
  footer?.addEventListener("mouseenter", disableHighlight);
  main?.addEventListener("mouseenter", enableHighlight);

  // Scroll reveal
  function initScrollReveal() {
    if (isMobile) return;

    const items = document.querySelectorAll(".reveal-on-scroll");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((el) => observer.observe(el));
  }

  initScrollReveal();

  // Project modal data
  const PROJECT_DATA = {
    processingFees: {
      type: "Digital Package · Reporting & Design",
      title: "Processing Fees & the Small Business Squeeze",
      body: `
        <p>
          A WordPress-based feature package that blends interviews, data visualization, and video to explain how rising
          card-processing fees erode small business margins. The story highlights owner perspectives, shows effective
          rates at different ticket sizes, and shares transparent communication tactics that keep customers informed.
        </p>
      `,
      behance: "https://www.behance.net/loganoscher",
      imageSrc: "assets/portfolio/VT.png",
      imageAlt: "Collage of POS devices and receipts"
    },
    
    dinklink: {
      type: "UI/UX Case Study",
      title: "DinkLink: Pickleball Matchmaking App",
      body: `
        <p>
        I designed a mobile app interface that helps local pickleball players find partners, track performance, and manage match logistics. I built the full end-to-end experience in Figma. My focus was on creating a clean and approachable interface, visual clarity for match data, and a smooth flow for messaging and court discovery. The final system includes player profiles, real-time stats, location features, and a match dashboard. The goal was to make organizing casual play feel effortless for new and experienced players.        </p>
        </p>
      `,
      behance: "https://www.behance.net/gallery/226078383/DinkLink-Final-Group-Project-%28Spring-25%29",
      imageSrc: "assets/portfolio/dinklink.png",
      imageAlt: "DinkLink Mockup"
    },
    ebay: {
      type: "Responsive UI Exploration",
      title: "eBay Interface Redesign",
      body: `
        <p>
          I reimagined the eBay browsing and product-detail experience with a modern layout and simplified user flow. This project focused on reducing visual clutter, strengthening the hierarchy of information, and improving the bidding and product selection process. I redesigned the product page, error screen, and navigation components to make the platform feel more intuitive and consistent across devices. The final system presents a cleaner shopping experience with clear call-to-actions and a more user-friendly structure.
        </p>
      `,
      behance: "https://www.behance.net/gallery/239575167/Ebay-Feature-Redesign-Project",
      imageSrc: "assets/portfolio/ebayredesign.png",
      imageAlt: "Ebay Redesign Mockup"
    },
    hockey: {
      type: "Digital Media & Graphic Design",
      title: "UNC Hockey Graphic Collection",
      body: `
        <p>
          I created a series of promotional graphics for UNC Hockey that highlight major games, countdowns, and announcements. My goal was to capture the energy of UNC athletics while keeping the visuals bold and recognizable for fans. Each piece uses consistent typography, color treatments, and layout patterns to reinforce the team identity. The graphics were built for Instagram and other social platforms and were designed to stand out in fast-scrolling feeds.
        </p>
      `,
      behance: "https://www.behance.net/gallery/239582165/UNC-Hockey-Graphic-Designs",
      imageSrc: "assets/portfolio/Hockey.png",
      imageAlt: "Hockey Graphics"
    }
  };

  const modal = document.getElementById("project-modal");
  const modalType = document.getElementById("project-modal-type");
  const modalTitle = document.getElementById("project-modal-title");
  const modalBody = document.getElementById("project-modal-body");
  const modalBehance = document.getElementById("project-modal-behance");
  const modalImage = document.getElementById("project-modal-image");

  function openModal(key) {
    const data = PROJECT_DATA[key];
    if (!data || !modal) return;

    modalType.textContent = data.type || "";
    modalTitle.textContent = data.title || "";
    modalBody.innerHTML = data.body || "";

    if (modalImage) {
      if (data.imageSrc) {
        modalImage.src = data.imageSrc;
        modalImage.alt = data.imageAlt || data.title || "";
        modalImage.style.display = "block";
      } else {
        modalImage.style.display = "none";
      }
    }

    if (data.behance && modalBehance) {
      modalBehance.href = data.behance;
      modalBehance.style.display = "inline-flex";
    } else if (modalBehance) {
      modalBehance.style.display = "none";
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  const moreButtons = document.querySelectorAll(".project__more[data-project]");
  moreButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.project;
      openModal(key);
    });
  });

  modal?.addEventListener("click", (event) => {
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      (target.hasAttribute("data-modal-close") ||
        target.classList.contains("project-modal__backdrop"))
    ) {
      closeModal();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
});
