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
    document.getElementById("cartSidebar").style.right = "0";
  }

  function closeCart() {
    document.getElementById("cartSidebar").style.right = "-400px";
  }

  // Cart and Toast logic
  let cart = [];
  let total = 0;

  function addToCart(dish, price, action) {
    let itemIndex = cart.findIndex((item) => item.dish === dish);
  
    if (action === "add") {
      if (itemIndex >= 0) {
        cart[itemIndex].quantity++;
        cart[itemIndex].price += price;
      } else {
        cart.push({ dish, price, quantity: 1 });
      }
      total += price;
      showToast("Added to cart");
    } else if (action === "remove" && itemIndex >= 0) {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity--;
        cart[itemIndex].price -= price;
      } else {
        cart.splice(itemIndex, 1);
      }
      total -= price;
      showToast("Removed from cart");
    }
  
    updateCart();
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

  // Modify updateCart to include quantity
  function updateCart() {
    let cartItemsDiv = document.querySelector(".cart-items");
    cartItemsDiv.innerHTML = "";

    cart.forEach((item, index) => {
      cartItemsDiv.innerHTML += `<div class="cart-item" data-dish="${
        item.dish
      }">${item.dish} x<span class="cart-item-quantity">${
        item.quantity
      }</span> - $${item.price.toFixed(2)}</div>`;
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
      addToCart(this.getAttribute("data-dish"), 12, "add"); // Here 12 is the price
    });
  });

  // Attach event listeners for quantity control buttons
  const incrementButtons = document.querySelectorAll(".increment");
  const decrementButtons = document.querySelectorAll(".decrement");

  incrementButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.parentNode.querySelector(".quantity");
      console.log("Increment button clicked");
      console.log(input);
      input.value = parseInt(input.value, 10) + 1;
      console.log(input);
      const dish = this.closest(".dish-item")
        .querySelector(".add-to-cart")
        .getAttribute("data-dish");
      const cartItemQuantity = document.querySelector(
        `.cart-item[data-dish="${dish}"] .cart-item-quantity`
      );

      if (cartItemQuantity) {
        cartItemQuantity.textContent =
          parseInt(cartItemQuantity.textContent, 10) + 1;
      }
    });
  });

  decrementButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.parentNode.querySelector(".quantity");
      const currentVal = parseInt(input.value, 10);
  
      if (currentVal > 1) {
        input.value = currentVal - 1;
      }
  
      const dish = this.closest(".dish-item")
        .querySelector(".add-to-cart")
        .getAttribute("data-dish");
  
      // Call the addToCart function with the "remove" action
      addToCart(dish, 12, "remove");  // Here 12 is the price
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
