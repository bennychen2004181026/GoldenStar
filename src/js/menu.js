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
  const decrementBtn = document.getElementById("decrement");
  const incrementBtn = document.getElementById("increment");
  const orderQuantitySpan = document.getElementById("orderQuantity");
  console.log(decrementBtn);

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
    cartSidebar.style.right = "0";
    orderDetailSidebar.style.right = "-400px";
  });

  closeOrderDetailBtn.addEventListener("click", function () {
    cartSidebar.style.right = "0";
    orderDetailSidebar.style.right = "-400px";
  });

  // floatingCartBtn.addEventListener("click", toggleCartSidebar);
  // window.addEventListener("resize", handleFloatingCartButton);

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

  // Function Definitions
  function handleDishClick(event, dishItemElement) {
    // Transfer necessary attributes for Order Detail Sidebar
    populateOrderDetailSidebar(dishItemElement);
    orderDetailSidebar.style.right = "0";
    cartSidebar.style.right = "-400px";
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
      document.getElementById("orderDishPrice").textContent.substr(1)
    );
    const dishQuantity = parseInt(
      document.getElementById("orderQuantity").innerText
    );
  
    // The image information can be fetched directly from orderDetailPicture and orderDetailImage.
    const dishThumbnail = orderDetailPicture.dataset.thumbnail;
    console.log(dishThumbnail)
    console.log(1)
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
  
    // Update the cart UI
    updateCartUI();
  }
  

  // Function to update the cart UI
  function updateCartUI() {
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const cartTotal = document.getElementById("cartTotal");

    // Clear existing items
    cartItemsContainer.innerHTML = "";

    let totalPrice = 0;

    cart.forEach((item) => {
      // Calculate total price
      totalPrice += item.price * item.quantity;

      // Create cart item
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

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
      dishPrice.textContent = `Price: $${(item.price * item.quantity).toFixed(
        2
      )}`;

      // Create dish quantity element
      const dishQuantity = document.createElement("span");
      dishQuantity.textContent = `Quantity: ${item.quantity}`;

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
  }

  document
    .getElementById("clearCartBtn")
    .addEventListener("click", function () {
      cart.length = 0; // Clear the cart array
      updateCartUI(); // Update the UI
    });

  function handleFloatingCartButton() {
    if (window.innerWidth <= 768) {
      floatingCartBtn.style.display = "block";
    } else {
      floatingCartBtn.style.display = "none";
    }
  }
});
