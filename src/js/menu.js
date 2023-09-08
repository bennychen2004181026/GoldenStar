document.addEventListener("DOMContentLoaded", function () {
  // Tab navigation logic
  const tabs = document.querySelectorAll(".menu-tabs li");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach(function (tab, tabIndex) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (innerTab) {
        innerTab.classList.remove("active");
      });
      tab.classList.add("active");

      tabContents.forEach(function (content, contentIndex) {
        if (contentIndex === tabIndex) {
          content.classList.add("active");
        } else {
          content.classList.remove("active");
        }
      });
    });
  });

  // Open and close cart logic
  function openCart() {
    console.log("Inside openCart function");
    document.getElementById("cartSidebar").style.right = "0";
    console.log(document.getElementById("cartSidebar").style.right);
  }

  function closeCart() {
    document.getElementById("cartSidebar").style.right = "-400px";
  }

  // Cart and Toast logic
  let cart = [];
  let total = 0;

  function addToCart(dish, price, action, updateUI = false) {
    console.log("Inside addToCart function");
    console.log("Initial Cart:", cart);
    console.log("Initial Total:", total);
    let itemIndex = cart.findIndex((item) => item.dish === dish);

    // Check and initialize if item doesn't exist in the cart yet
    if (itemIndex < 0) {
      cart.push({ dish, price: 0, quantity: 0 });
      itemIndex = cart.length - 1;
    }

    if (action === "add") {
      cart[itemIndex].quantity++;
      cart[itemIndex].price += price;
      total += price;
      showToast("Added to cart");
    } else if (action === "remove" && itemIndex >= 0) {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity--;
        cart[itemIndex].price -= price;
        total -= price;
        showToast("Removed from cart");
      }
    }
    // filter out items with zero quantity before updating the UI.
    if (action === "remove" && itemIndex >= 0) {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity--;
        cart[itemIndex].price -= price;
        total -= price;
        showToast("Removed from cart");
      } else if (cart[itemIndex].quantity === 1) {
        cart.splice(itemIndex, 1);
        total -= price;
        showToast("Item removed from cart");
      }
    }

    // Inside 'addToCart' function
    if (updateUI) {
      updateCart();
    }
  }

  // Attach addToCart for initial Add to Cart click
  const dishItems = document.querySelectorAll(".dish-item"); // get all dish items

  // Modify z-index on hover for each dish item
  dishItems.forEach((dishItem) => {
    dishItem.addEventListener("mouseenter", function () {
      this.querySelector(".add-to-cart").style.zIndex = "0";
    });
    dishItem.addEventListener("mouseleave", function () {
      this.querySelector(".add-to-cart").style.zIndex = "2";
    });
  });

  // Modify updateCart to filter out items with 0 quantity
  function updateCart() {
    console.log("Inside updateCart function");
    let cartItemsDiv = document.querySelector(".cart-items");
    cartItemsDiv.innerHTML = "";

    // Filter out items with zero quantity
    const filteredCart = cart.filter((item) => item.quantity > 0);

    // Update: Removed the duplicated forEach loop for cart
    // Loop only on filteredCart instead of cart
    filteredCart.forEach((item, index) => {
      cartItemsDiv.innerHTML += `<div class="cart-item" data-dish="${
        item.dish
      }">${item.dish} x<span class="cart-item-quantity">${
        item.quantity
      }</span> - $${item.price.toFixed(2)}</div>`;
    });

    // Update the quantity inputs based on cart data
    cart.forEach((item) => {
      const input = document.querySelector(`input[data-dish="${item.dish}"]`);
      if (input) {
        input.value = item.quantity;
      }
    });

    document.getElementById("cartTotal").innerText = total.toFixed(2);
    openCart();
  }

  // Toast function
  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("toast-hidden");
    toast.classList.add("toast-visible");

    setTimeout(() => {
      toast.classList.remove("toast-visible");
      toast.classList.add("toast-hidden");
    }, 500);
  }

  // Attach addToCart for initial Add to Cart click
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      console.log("Add to Cart clicked");
      addToCart(this.getAttribute("data-dish"), 12, "add", true); // Added true
    });
  });

  // Attach event listeners for quantity control buttons
  const incrementButtons = document.querySelectorAll(".increment");
  const decrementButtons = document.querySelectorAll(".decrement");

  incrementButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const dish = this.closest(".dish-item")
        .querySelector(".add-to-cart")
        .getAttribute("data-dish");
      addToCart(dish, 12, "add", true); // Here 12 is the price, and 'true' is to update the UI
    });
  });

  decrementButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const dish = this.closest(".dish-item")
        .querySelector(".add-to-cart")
        .getAttribute("data-dish");
      addToCart(dish, 12, "remove", true); // Here 12 is the price, and 'true' is to update the UI
    });
  });

  // New Code: To fix the overlay issue
  const quantityControls = document.querySelectorAll(".quantity-control");

  quantityControls.forEach((control) => {
    control.addEventListener("mouseenter", function () {
      const parentDiv = this.closest(".dish-item");
      const addToCart = parentDiv.querySelector(".add-to-cart");

      addToCart.style.zIndex = "0";
    });

    control.addEventListener("mouseleave", function () {
      const parentDiv = this.closest(".dish-item");
      const addToCart = parentDiv.querySelector(".add-to-cart");

      addToCart.style.zIndex = "2";
    });
  });
});
