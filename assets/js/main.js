(function () {
  "use strict";

  console.log("main.js is running");

  /**
   * Dynamically load HTML component into a container
   * @param {string} url - Path to the HTML file
   * @param {string} containerId - ID of the container element
   * @param {function} [callback] - Optional callback function to execute after loading
   */
  function loadComponent(url, containerId, callback) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${url}: ${response.statusText}`);
        }
        return response.text();
      })
      .then((html) => {
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = html;
          if (typeof callback === "function") callback(); // Execute callback after loading
          console.log(`Component loaded from ${url} into ${containerId}`);
        } else {
          console.error(`Container with ID "${containerId}" not found.`);
        }
      })
      .catch((error) => {
        console.error(`Error loading component from ${url}:`, error);
      });
  }

  // Load components on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", function () {
    loadComponent("components/menu.html", "menu-container", attachMenuListeners);
    loadComponent("components/footer.html", "footer-container");
    loadComponent("components/about.html", "about-container", initTyped);
    loadComponent("components/experience.html", "experience-container");
    loadComponent("components/education.html", "education-container");
    loadComponent("components/research.html", "research-container");
    loadComponent("components/projects.html", "projects-container");

    let vantaInstance;

    // Initialize Vanta Globe animation for the About section
    if (window.VANTA && VANTA.GLOBE) {
      vantaInstance = VANTA.GLOBE({
        el: "#about-background", // Target the container
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0x000000, // Default background color
        color: 0x87b3ff,          // Default primary color
        color2: 0xff5733,         // Default secondary color
        size: 1.4,                // Default size of the globe
      });
    } else {
      console.error("Vanta Globe library is not loaded.");
    }

    // Function to dynamically update Vanta Globe properties
    window.updateVantaProperties = function (properties) {
      if (vantaInstance) {
        Object.assign(vantaInstance.options, properties); // Update properties
        vantaInstance.restart(); // Restart the animation with updated properties
      } else {
        console.error("Vanta Globe instance is not initialized.");
      }
    };
  });

  /**
   * Attach event listeners to menu links after the menu is loaded
   */
  function attachMenuListeners() {
    const menuLinks = document.querySelectorAll(".menu-link");

    menuLinks.forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default anchor behavior

        // Remove the 'active' class from all links
        menuLinks.forEach((item) => item.classList.remove("active"));

        // Add the 'active' class to the clicked link
        this.classList.add("active");

        // Scroll to the corresponding section
        const targetId = this.getAttribute("href").substring(1); // Remove the '#' from href
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: "smooth",
          });
        }
      });
    });
  }

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add("active") : scrollTop.classList.remove("active");
    }
  }

  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (window.AOS) {
      AOS.init({
        duration: 600,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    } else {
      console.warn("AOS library is not loaded.");
    }
  }
  window.addEventListener("load", aosInit);

  /**
   * Init typed.js
   */
  function initTyped() {
    const typedSpan = document.querySelector(".typed");
    if (typedSpan && window.Typed) {
      const items = typedSpan.getAttribute("data-typed-items");
      if (items) {
        new Typed(".typed", {
          strings: items.split(",").map((s) => s.trim()),
          typeSpeed: 60,
          backSpeed: 40,
          backDelay: 1500,
          loop: true,
        });
      }
    } else if (!window.Typed) {
      console.warn("Typed.js library is not loaded.");
    }
  }

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
    const layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
    const filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
    const sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector(".isotope-container"), function () {
      initIsotope = new Isotope(isotopeItem.querySelector(".isotope-container"), {
        itemSelector: ".isotope-item",
        layoutMode: layout,
        filter: filter,
        sortBy: sort,
      });
    });

    isotopeItem.querySelectorAll(".isotope-filters li").forEach(function (filters) {
      filters.addEventListener(
        "click",
        function () {
          isotopeItem.querySelector(".isotope-filters .filter-active").classList.remove("filter-active");
          this.classList.add("filter-active");
          initIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
          if (typeof aosInit === "function") {
            aosInit();
          }
        },
        false
      );
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      const configElement = swiperElement.querySelector(".swiper-config");
      if (configElement) {
        const config = JSON.parse(configElement.innerHTML.trim());
        if (swiperElement.classList.contains("swiper-tab")) {
          initSwiperWithCustomPagination(swiperElement, config);
        } else {
          new Swiper(swiperElement, config);
        }
      } else {
        console.warn("Swiper configuration not found for an element.");
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener("load", function () {
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          const scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: "smooth",
          });
        }, 100);
      }
    }
  });
})();