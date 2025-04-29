// Portfolio Carousel Functionality for Mobile
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on mobile
    if (window.innerWidth <= 767) {
      initializeCarousels();
    }
    
    // Re-initialize on resize
    window.addEventListener('resize', function() {
      if (window.innerWidth <= 767) {
        initializeCarousels();
      }
    });
    
    function initializeCarousels() {
      // Initialize both carousels
      initCarousel('portfolio-left');
      initCarousel('portfolio-right');
    }
    
    function initCarousel(containerId) {
      const container = document.querySelector(`.${containerId}`);
      if (!container) return;
      
      // Get all projects in the grid
      const gridContainer = container.querySelector('.grid-cols-2');
      if (!gridContainer) return;
      
      const projects = gridContainer.querySelectorAll('.group');
      if (projects.length === 0) return;
      
      // If carousel already exists, don't re-initialize
      if (container.querySelector('.carousel-container')) return;
      
      // Create carousel elements
      const carouselContainer = document.createElement('div');
      carouselContainer.className = 'carousel-container';
      
      const carouselTrack = document.createElement('div');
      carouselTrack.className = 'carousel-track';
      
      // Add all projects to carousel
      projects.forEach(project => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        const clonedProject = project.cloneNode(true);
        slide.appendChild(clonedProject);
        carouselTrack.appendChild(slide);
      });
      
      carouselContainer.appendChild(carouselTrack);
      
      // Create carousel controls
      const controls = document.createElement('div');
      controls.className = 'carousel-controls';
      
      const prevButton = document.createElement('button');
      prevButton.className = 'carousel-button prev';
      prevButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg>';
      
      const nextButton = document.createElement('button');
      nextButton.className = 'carousel-button next';
      nextButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>';
      
      controls.appendChild(prevButton);
      controls.appendChild(nextButton);
      carouselContainer.appendChild(controls);
      
      // Create carousel navigation dots
      const carouselNav = document.createElement('div');
      carouselNav.className = 'carousel-nav';
      
      projects.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = index === 0 ? 'carousel-dot active' : 'carousel-dot';
        dot.dataset.index = index;
        carouselNav.appendChild(dot);
      });
      
      // Insert carousel after the grid
      gridContainer.after(carouselContainer);
      container.appendChild(carouselNav);
      
      // Set up carousel state
      let currentIndex = 0;
      updateCarousel();
      
      // Button event listeners
      prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + projects.length) % projects.length;
        updateCarousel();
      });
      
      nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % projects.length;
        updateCarousel();
      });
      
      // Dot event listeners
      carouselNav.querySelectorAll('.carousel-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          currentIndex = parseInt(dot.dataset.index);
          updateCarousel();
        });
      });
      
      // Touch events for swiping
      let touchStartX = 0;
      let touchEndX = 0;
      
      carouselTrack.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      });
      
      carouselTrack.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        
        if (touchStartX - touchEndX > 50) {
          // Swipe left - next slide
          currentIndex = (currentIndex + 1) % projects.length;
          updateCarousel();
        } else if (touchEndX - touchStartX > 50) {
          // Swipe right - previous slide
          currentIndex = (currentIndex - 1 + projects.length) % projects.length;
          updateCarousel();
        }
      });
      
      // Update carousel display
      function updateCarousel() {
        // Update track position
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        carouselNav.querySelectorAll('.carousel-dot').forEach((dot, index) => {
          if (index === currentIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    }
  });