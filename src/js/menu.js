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

  function addToCart(
    dish,
    price,
    action,
    thumbnail,
    thumbnailFallback,
    updateUI = false
  ) {
    let itemIndex = cart.findIndex((item) => item.dish === dish);

    if (itemIndex === -1 && action === "add") {
      cart.push({ dish, price: 0, quantity: 0, thumbnail, thumbnailFallback });
      itemIndex = cart.length - 1;
    }

    if (action === "add") {
      cart[itemIndex].quantity++;
      cart[itemIndex].price += price;
      total += price;
      showToast(`${dish} has been added to the cart`);
    } else if (action === "remove") {
      if (itemIndex === -1) {
        showToast(`There are no items to remove`);
        return;
      }
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity--;
        cart[itemIndex].price -= price;
        total -= price;
        showToast(`${dish} has been removed from the cart`);
      } else if (cart[itemIndex].quantity === 1) {
        cart.splice(itemIndex, 1);
        total -= price;
        showToast(`${dish} has been removed from the cart`);
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
    filteredCart.forEach((item) => {
      const thumbnail = item.thumbnail || "./assets/images/default.jpg";
      const thumbnailFallback =
        item.thumbnailFallback || "./assets/images/default-fallback.jpg";
      cartItemsDiv.innerHTML += `
        <div class="cart-item" data-dish="${item.dish}">
          <img src="${thumbnail}" onerror="this.src='${thumbnailFallback}'" alt="${
        item.dish
      }" width="50">
          ${item.dish} x<span class="cart-item-quantity">${
        item.quantity
      }</span> - $${item.price.toFixed(2)}
        </div>`;
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
      const dish = this.getAttribute("data-dish");
      const thumbnail = this.getAttribute("data-thumbnail");
      const thumbnailFallback = this.getAttribute("data-thumbnail-fallback");
      addToCart(dish, 12, "add", thumbnail, thumbnailFallback, true);
    });
  });

  // Increment and Decrement buttons
  const incrementButtons = document.querySelectorAll(".increment");
  const decrementButtons = document.querySelectorAll(".decrement");

  incrementButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const parentDishItem =
        this.closest(".dish-item").querySelector(".add-to-cart");
      const dish = parentDishItem.getAttribute("data-dish");
      const thumbnail = parentDishItem.getAttribute("data-thumbnail");
      const thumbnailFallback = parentDishItem.getAttribute(
        "data-thumbnail-fallback"
      );
      addToCart(dish, 12, "add", thumbnail, thumbnailFallback, true);
    });
  });

  decrementButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const parentDishItem =
        this.closest(".dish-item").querySelector(".add-to-cart");
      const dish = parentDishItem.getAttribute("data-dish");
      const thumbnail = parentDishItem.getAttribute("data-thumbnail");
      const thumbnailFallback = parentDishItem.getAttribute(
        "data-thumbnail-fallback"
      );
      addToCart(dish, 12, "remove", thumbnail, thumbnailFallback, true);
    });
  });

  // Function to simulate proceeding to checkout
  function proceedToCheckout() {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    clearCart();
    alert("Thank you for your purchase!");
  }

  // Attach event listener to the "Clear Cart" button
  document.getElementById("clear-cart").addEventListener("click", function () {
    clearCart();
  });

  // Attach event listener to the "Proceed to Checkout" button
  document
    .getElementById("proceed-to-checkout")
    .addEventListener("click", function () {
      proceedToCheckout();
    });

  // Clear Cart function
  function clearCart() {
    cart = [];
    total = 0;
    updateCart();
    showToast("Your cart has been cleared");
  }

  // Close cart sidebar
  document.getElementById("closeCartBtn").addEventListener("click", closeCart);
});
