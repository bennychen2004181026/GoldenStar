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
  const closeOrderDetailBtn = document.getElementById("closeOrderDetailBtn");
  const mainContainer = document.getElementById("main-container");
  const cartSidebarCloseBtn = document.getElementById("cartSidebarCloseBtn");
  const closeOrderDetailBtnInSmallScreen = document.getElementById(
    "closeOrderDetailBtnInSmallScreen"
  );
  const windowWidth = window.innerWidth;
  const decrementBtn = document.getElementById("decrement");
  const incrementBtn = document.getElementById("increment");
  const orderQuantitySpan = document.getElementById("orderQuantity");
  const sidebars = document.getElementById("sidebars-container");
  const mainContentContainer = document.getElementById(
    "main-content-container"
  );
  console.log(floatingCartBtn);

  // Initialize cart array and UI
  let cart = [];
  // handleFloatingCartButton();

  // Event Listeners
  tabs.forEach((tab, tabIndex) => {
    tab.addEventListener("click", function () {
      handleTabClick(this, tabIndex);
    });
  });

  dishItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      handleDishClick(event, item);
    });
  });

  addToCartBtn.addEventListener("click", function () {
    handleAddToCart(orderDetailPicture);
    // if (windowWidth > 767.9) {
    cartSidebar.style.display = "flex";
    orderDetailSidebar.style.display = "none";}
  
  // }
  );

  closeOrderDetailBtn.addEventListener("click", function () {
    cartSidebar.style.display = "flex";
    orderDetailSidebar.style.display = "none";
  });
  closeOrderDetailBtnInSmallScreen.addEventListener("click", function () {
    sidebars.style.display = "none";
    mainContentContainer.style.display = "flex";
  });
  cartSidebarCloseBtn.addEventListener("click", function () {
    sidebars.style.display = "none";
    mainContentContainer.style.display = "flex";
    floatingCartBtn.style.display = "block";
  });


  // Logic for decrementing and increment the order quantity
  decrementBtn.addEventListener("click", function () {
    let quantity = parseInt(orderQuantitySpan.innerText);
    console.log(quantity); // Should show current quantity
    if (quantity > 1) {
      quantity--;
    }
    orderQuantitySpan.innerText = quantity;
  });

  incrementBtn.addEventListener("click", function () {
    let quantity = parseInt(orderQuantitySpan.innerText);
    quantity++;
    orderQuantitySpan.innerText = quantity;
  });

  floatingCartBtn.addEventListener("click", function () {
    // mainContainer.style.justifyContent = "center";
      mainContentContainer.style.display = "none";
      sidebars.style.display = "flex";
      orderDetailSidebar.style.display = "none";
      cartSidebar.style.display = "flex";
      closeOrderDetailBtnInSmallScreen.style.display = "flex";
      floatingCartBtn.style.display = "none";
  });

  document
  .getElementById("clearCartBtn")
  .addEventListener("click", function () {
    cart.length = 0; // Clear the cart array
    updateCartUI(); // Update the UI
    // Show toast notification
    showToast("Cart cleared!");
  });

  // Function Definitions
  function handleDishClick(event, dishItemElement) {
    // Transfer necessary attributes for Order Detail Sidebar

    if (windowWidth > 767.9) {
      populateOrderDetailSidebar(dishItemElement);
      orderDetailSidebar.style.display = "flex";
      cartSidebar.style.display = "none";
      floatingCartBtn.style.display = "none";
      showToast("Dish selected. Check out the details!");
    } else {
      populateOrderDetailSidebar(dishItemElement);
      mainContainer.style.justifyContent = "center";
      mainContentContainer.style.display = "none";
      sidebars.style.display = "flex";
      orderDetailSidebar.style.display = "flex";
      orderDetailSidebar.style.flexDirection = "column";
      cartSidebar.style.display = "none";
      closeOrderDetailBtnInSmallScreen.style.display = "flex";
      floatingCartBtn.style.display = "none";
      showToast("Dish selected. Check out the details!");
    }
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
    // Fetch relevant data attributes from the order sidebar
    const dishName = document.getElementById("orderDishName").textContent;
    const dishPrice = parseFloat(
      document.getElementById("orderDishPrice").textContent.substring(1)
    );
    const dishQuantity = parseInt(
      document.getElementById("orderQuantity").innerText
    );

    // The image information can be fetched directly from orderDetailPicture and orderDetailImage.
    const dishThumbnail = orderDetailPicture.dataset.thumbnail;
    const dishThumbnailFallback = orderDetailPicture.dataset.thumbnailFallback;
    const dishLazy = orderDetailImage.getAttribute("loading");

    // Check if dish already exists in the cart
    const existingDish = cart.find((item) => item.dish === dishName);

    if (existingDish) {
      // Add the new quantity to the existing dish in the cart
      existingDish.quantity += dishQuantity; // Changed this line to add to the existing quantity
    } else {
      // Add new dish to the cart
      cart.push({
        dish: dishName,
        price: dishPrice,
        quantity: dishQuantity,
        thumbnail: dishThumbnail,
        thumbnailFallback: dishThumbnailFallback,
        lazy: dishLazy,
      });
    }
    // Show toast notification
    showToast("Dish added to cart!");
    // Update the cart UI
    updateCartUI();
  }

  // Function to update the cart UI
  function updateCartUI() {
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const cartTotal = document.getElementById("cartTotal");
    const cartTotalItems = document.getElementById("cartTotalItems");
    const cartItemCount = document.getElementById("cartItemCount");


    // Clear existing items
    cartItemsContainer.innerHTML = "";

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach((item) => {
      // Calculate total price
      totalPrice += item.price * item.quantity;
    
      // Calculate total price
      totalItems += item.quantity;

      // Create cart item
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item"); // Add class for styling

      // Create image with fallback
      const image = document.createElement("img");
      image.src = item.thumbnail;
      image.setAttribute("loading", item.lazy);
      image.onerror = () => {
        image.src = item.thumbnailFallback;
      };

      // Create dish name element
      const dishName = document.createElement("span");
      dishName.textContent = item.dish;

      // Create dish price element
      const dishPrice = document.createElement("span");
      dishPrice.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

      // Create dish quantity element
      const dishQuantity = document.createElement("span");
      dishQuantity.textContent = `X ${item.quantity}`;

      // Append elements to cart item
      cartItem.appendChild(image);
      cartItem.appendChild(dishName);
      cartItem.appendChild(dishPrice);
      cartItem.appendChild(dishQuantity);

      // Append cart item to cart items container
      cartItemsContainer.appendChild(cartItem);
    });

    // Update the total price
    cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;

    // Update the total items
    cartTotalItems.textContent = `Total: ${Math.floor(totalItems)}`;

    // Update the total items in floating cart botton
    cartItemCount.textContent = Math.floor(totalItems);
  }

  // Function to show toast
  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.querySelector("p").textContent = message;
    toast.classList.add("toast-visible"); // Add class to make it visible

    setTimeout(() => {
      toast.classList.remove("toast-visible");
    }, 600);
  }

  // Initialize cart UI
  updateCartUI();
});
