document.addEventListener("DOMContentLoaded", function() {
    const tabs = document.querySelectorAll(".menu-tabs li");
    const tabContents = document.querySelectorAll(".tab-content");
  
    tabs.forEach(function(tab, tabIndex) {
      tab.addEventListener("click", function() {
        tabs.forEach(function(innerTab) {
          innerTab.classList.remove("active");
        });
        tab.classList.add("active");
  
        tabContents.forEach(function(content, contentIndex) {
          if (contentIndex === tabIndex) {
            content.classList.add("active");
          } else {
            content.classList.remove("active");
          }
        });
      });
    });
  });
  