document.addEventListener("DOMContentLoaded", function () {
  // Cache DOM elements
  const tabs = document.querySelectorAll(".menu-tabs li");
  const tabContents = document.querySelectorAll(".tab-content");
  const dishItems = document.querySelectorAll(".dish-item");
  const floatingCartBtn = document.getElementById("floatingCartBtn");
  const orderDetailSidebar = document.getElementById("orderDetailSidebar");
  const cartSidebar = document.getElementById("cartSidebar");
  const orderDetailPicture = document.getElementById("orderDetailPicture");
  const orderDetailImage = document.getElementById("orderDetailImage");
  const orderDetailSource = document.getElementById("orderDetailSource");
  const addToCartBtn = document.getElementById("addToCart");
  const pictureElement = dishItemElement.querySelector("picture");
  // Initialize cart array and UI
  let cart = [];
  handleFloatingCartButton();

 // Event Listeners
 tabs.forEach((tab, tabIndex) => {
  tab.addEventListener("click", function () {
    handleTabClick(this, tabIndex);
  });
});

dishItems.forEach((item) => {
  item.addEventListener("click", function (event) {
    handleDishClick(event, this);
  });
});

addToCartBtn.addEventListener("click", function () {
  handleAddToCart(orderDetailPicture);
  toggleSidebars(cartSidebar, orderDetailSidebar);  // toggle to cartSidebar
});

floatingCartBtn.addEventListener("click", toggleCartSidebar);
window.addEventListener("resize", handleFloatingCartButton);

  function toggleCartSidebar() {
    const currentRight = cartSidebar.style.right;
    cartSidebar.style.right = currentRight === "0px" ? "-400px" : "0";
  }


  // Function Definitions
  function handleDishClick(event, dishItemElement) {
    // Transfer necessary attributes for Order Detail Sidebar
    populateOrderDetailSidebar(dishItemElement);
    toggleSidebars(orderDetailSidebar, cartSidebar);
  }

  function populateOrderDetailSidebar(dishItemElement) {
    const pictureElement = dishItemElement.querySelector("picture");
    const dataset = pictureElement.dataset;

    // Populate picture attributes
    orderDetailPicture.dataset.dish = dataset.dish;
    orderDetailPicture.dataset.price = dataset.price;
    orderDetailPicture.dataset.thumbnail = dataset.thumbnail;
    orderDetailPicture.dataset.thumbnailFallback = dataset.thumbnailFallback;

    // Populate image and source tags for WebP and fallback
    orderDetailSource.srcset = pictureElement
      .querySelector("source")
      .getAttribute("srcset");
    orderDetailImage.src = pictureElement
      .querySelector("img")
      .getAttribute("src");

    // Populate sidebar text content
    document.getElementById("orderDishName").textContent = dataset.dish;
    document.getElementById("orderDishPrice").textContent = `$${parseFloat(
      dataset.price
    ).toFixed(2)}`;
    document.getElementById("orderQuantity").innerText = "1";

    orderDetailSidebar.style.right = "0";
  }

  function toggleSidebars(showSidebar, hideSidebar) {
    showSidebar.style.right = "0";
    hideSidebar.style.right = "-400px";
  }

  function handleTabClick(tabElement, tabIndex) {
    tabs.forEach((tab) => tab.classList.remove("active"));
    tabElement.classList.add("active");

    tabContents.forEach((content, contentIndex) => {
      if (tabIndex === contentIndex) {
        content.classList.add("active");
      } else {
        content.classList.remove("active");
      }
    });
  }

  function handleAddToCart() {
    const pictureElement = dishItemElement.querySelector("picture");
    const dataset = pictureElement.dataset;
    // Fetch relevant data attributes from the order sidebar
    const dishName = document.getElementById("orderDishName").textContent;
    const dishPrice = parseFloat(
      document.getElementById("orderDishPrice").textContent.substr(1)
    );
    const dishQuantity = parseInt(
      document.getElementById("orderQuantity").innerText
    );
    const dishThumbnail = document.getElementById("orderThumbnail").src;
    const dishFallback = document
      .getElementById("orderThumbnail")
      .getAttribute("data-src-fallback");
    const dishLazy = document
      .getElementById("orderThumbnail")
      .getAttribute("loading");

    // Add to cart array
    cart.push({
      dish: dataset.dish,
      price: parseFloat(dataset.price),
      quantity: parseInt(dataset.quantity || "1"),
      thumbnail: dataset.thumbnail,
      thumbnailFallback: dataset.thumbnailFallback,
    });
  }

  // Function to open order detail sidebar and populate its content dynamically
  function openOrderDetailSidebar(event) {
    // Extract the data-attributes from the event target (clicked element)
    const dataset = event.currentTarget.querySelector("picture").dataset;

    // sidebar
    const sidebar = document.getElementById("orderDetailSidebar");

    // Get the elements to update
    const dishNameElement = document.getElementById("orderDishName");
    const dishPriceElement = document.getElementById("orderDishPrice");
    const imgElement = document.getElementById("orderThumbnail");

    // Update the dish name and price
    dishNameElement.textContent = dataset.dish;
    dishPriceElement.textContent = "$" + parseFloat(dataset.price).toFixed(2);

    // Update the image source for lazy loading
    imgElement.dataset.src = dataset.thumbnail;
    imgElement.dataset.srcFallback = dataset.thumbnailFallback;

    // Trigger lazy loading by setting the src attribute
    imgElement.src = dataset.thumbnail;

    // Initialize quantity
    document.getElementById("orderQuantity").innerText = "1";

    // Show the sidebar
    sidebar.style.right = "0";
  }

  function handleFloatingCartButton() {
    if (window.innerWidth <= 768) {
      floatingCartBtn.style.display = "block";
    } else {
      floatingCartBtn.style.display = "none";
    }
  }
});
