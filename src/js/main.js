// Function to actually set the src from data-src and srcset from data-srcset
function loadImage(element) {
  if (element.tagName === "IMG" && element.getAttribute("data-src")) {
    element.src = element.getAttribute("data-src");
    element.onerror = function () {
      console.error("Error loading image: ", element.src);
    };
  }
  if (element.tagName === "SOURCE" && element.getAttribute("data-srcset")) {
    element.srcset = element.getAttribute("data-srcset");
  }
}

// Function to handle lazy loading images
function lazyLoadImages() {
  if ("IntersectionObserver" in window) {
    // Intersection Observers are set up for img tags
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target;
          loadImage(image);
          observer.unobserve(image);
        }
      });
    });

    const images = document.querySelectorAll(
      "img[data-src], source[data-srcset]"
    );
    images.forEach((image) => {
      observer.observe(image);
    });
  } else {
    // Fallback for older browsers: Load all images immediately
    // Intersection Observers are set up for img tags
    const images = document.querySelectorAll(
      "img[data-src], source[data-srcset]"
    );
    images.forEach((image) => {
      loadImage(image);
    });
  }
}

// After the DOM content is loaded

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

// Function to set the actual image URL from data attributes.
function loadImage(image) {
  const src = image.dataset.src;
  if (!src) {
    return;
  }
  image.src = src;
}

// Function to set the actual image set for source from data attributes.
function loadImageSet(source) {
  const srcset = source.dataset.srcset;
  if (!srcset) {
    return;
  }
  source.srcset = srcset;
}
// The Intersection Observer is a JavaScript API that provides a way to
// asynchronously observe changes in the intersection of a target element
// with its containing element or with a specified ancestor element.
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll("[data-src]");
  const sources = document.querySelectorAll("[data-srcset]");

  const config = {
    rootMargin: "0px 0px 50px 0px",
    threshold: 0,
  };

  let sourceObserver = new IntersectionObserver(function (entries, self) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadImageSet(entry.target);
        self.unobserve(entry.target);
      }
    });
  }, config);

  sources.forEach((source) => {
    sourceObserver.observe(source);
  });

  // Call lazyLoadImages function to initiate lazy loading
  lazyLoadImages();
});
