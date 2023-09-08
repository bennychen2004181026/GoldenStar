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

  function addToCart(dish, price, action, updateUI = false) {
    let itemIndex = cart.findIndex((item) => item.dish === dish);
    if (itemIndex === -1) {
      cart.push({ dish, price: 0, quantity: 0 });
      itemIndex = cart.length - 1;
    }

    if (action === "add") {
      cart[itemIndex].quantity++;
      cart[itemIndex].price += price;
      total += price;
    } else if (action === "remove" && itemIndex !== -1) {
      // Changed this line
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity--;
        cart[itemIndex].price -= price;
        total -= price;
      } else if (cart[itemIndex].quantity === 1) {
        cart.splice(itemIndex, 1);
        total -= price;
      }
    }

    if (updateUI) {
      updateCart();
    }
  }

  // Update cart UI
  function updateCart() {
    let cartItemsDiv = document.querySelector(".cart-items");
    cartItemsDiv.innerHTML = "";

    const filteredCart = cart.filter((item) => item.quantity > 0);
    filteredCart.forEach((item, index) => {
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

  // Add to Cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      addToCart(this.getAttribute("data-dish"), 12, "add", true);
    });
  });

  // Increment and Decrement buttons
  const incrementButtons = document.querySelectorAll(".increment");
  const decrementButtons = document.querySelectorAll(".decrement");

  incrementButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const dish = this.closest(".dish-item")
        .querySelector(".add-to-cart")
        .getAttribute("data-dish");
      addToCart(dish, 12, "add", true);
    });
  });

  decrementButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const dish = this.closest(".dish-item")
        .querySelector(".add-to-cart")
        .getAttribute("data-dish");
      addToCart(dish, 12, "remove", true); // Ensure this line is working as expected
    });
  });

  // Close cart sidebar
  document.getElementById("closeCartBtn").addEventListener("click", closeCart);
});
