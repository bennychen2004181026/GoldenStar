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
