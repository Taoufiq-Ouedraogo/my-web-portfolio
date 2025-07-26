/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  console.log('main.js is running');

  /**
   * Dynamically load HTML component into a container
   * @param {string} url - Path to the HTML file
   * @param {string} containerId - ID of the container element
   */
  function loadComponent(url, containerId, callback) {
    fetch(url)
      .then(response => response.text())
      .then(html => {
        const container = document.getElementById(containerId);
        container.innerHTML = html;
        if (typeof callback === "function") callback();
        console.log('Component loaded from ${url} into ${containerId}');
        console.log('Loaded HTML:', html);
      });
  }

  // Load sidebar and footer, then initialize sidebar toggle after sidebar is loaded
  document.addEventListener('DOMContentLoaded', function() {
    loadComponent('components/sidebar.html', 'sidebar-container', initSidebarToggle);
    loadComponent('components/footer.html', 'footer-container');
    loadComponent('components/about.html', 'about-container', initTyped);
    loadComponent('components/experience.html', 'experience-container');
    loadComponent('components/education.html', 'education-container');
    loadComponent('components/research-projects.html', 'research-projects-container');
  });

  /**
   * Header toggle (sidebar show/hide)
   */
  function initSidebarToggle() {
    const headerToggleBtn = document.querySelector('.sidebar-toggle');
    if (headerToggleBtn) {
      headerToggleBtn.addEventListener('click', function() {
        document.querySelector('#sidebar').classList.toggle('sidebar-show');
        headerToggleBtn.classList.toggle('bi-list');
        headerToggleBtn.classList.toggle('bi-x');
      });
    }
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.addEventListener('click', function(e) {
    if (e.target.closest('#navmenu a')) {
      if (document.querySelector('#sidebar.sidebar-show')) {
        const headerToggleBtn = document.querySelector('.sidebar-toggle');
        if (headerToggleBtn) {
          document.querySelector('#sidebar').classList.remove('sidebar-show');
          headerToggleBtn.classList.add('bi-list');
          headerToggleBtn.classList.remove('bi-x');
        }
      }
    }
  });


  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  function initTyped() {
    const typedSpan = document.querySelector('.typed');
    if (typedSpan && window.Typed) {
      const items = typedSpan.getAttribute('data-typed-items');
      if (items) {
        new Typed('.typed', {
          strings: items.split(',').map(s => s.trim()),
          typeSpeed: 60,
          backSpeed: 40,
          backDelay: 1500,
          loop: true
        });
      }
    }
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  function showSection(sectionId) {
    document.querySelectorAll('.section-container').forEach(el => {
      el.classList.remove('active');
    });
    const section = document.getElementById(sectionId + '-container');
    if (section) section.classList.add('active');
  }

  // Listen for sidebar nav clicks
  document.addEventListener('click', function(e) {
    const link = e.target.closest('#navmenu a');
    if (link) {
      const hash = link.getAttribute('href');
      if (hash && hash.startsWith('#')) {
        const sectionId = hash.substring(1);
        showSection(sectionId);
        e.preventDefault();
        // Optionally update the URL hash:
        history.replaceState(null, '', hash);
      }
    }
  });

  // Show About section by default on page load
  document.addEventListener('DOMContentLoaded', function() {
    showSection('about');
  });

})();