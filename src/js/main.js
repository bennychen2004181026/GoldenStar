document.addEventListener("DOMContentLoaded", () => {
    let currentSlide = 0;
    const slides = document.querySelectorAll(".carousel-slide");
    const indicators = document.querySelectorAll(".carousel-indicator");
    const slidesContainer = document.querySelector(".carousel-slides");
  
    // Function to update slides
    function updateSlides() {
      slides.forEach((slide, index) => {
        slide.classList.remove("active");
        if (index === currentSlide) {
          slide.classList.add("active");
        }
      });
  
      indicators.forEach((indicator, index) => {
        indicator.classList.remove("active");
        if (index === currentSlide) {
          indicator.classList.add("active");
        }
      });
  
      slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  
    // Next slide button
    document.getElementById("next").addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlides();
    });
  
    // Previous slide button
    document.getElementById("prev").addEventListener("click", () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateSlides();
    });
  
    // Indicator buttons
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        currentSlide = index;
        updateSlides();
      });
    });
  
    // Initialize slides
    updateSlides();
  
    // Auto-slide every 3 seconds
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlides();
    }, 6000);
  });
  