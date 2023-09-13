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

  // Function to open order detail sidebar and populate its content dynamically
function openOrderDetailSidebar(dish, price, thumbnail, thumbnailFallback) {
  // Get the elements to update
  const dishNameElement = document.getElementById('orderDishName');
  const dishPriceElement = document.getElementById('orderDishPrice');
  const imgElement = document.getElementById('orderThumbnail');

  // Update the dish name and price
  dishNameElement.textContent = dish;
  dishPriceElement.textContent = '$' + price.toFixed(2);

  // Update the image source for lazy loading
  imgElement.dataset.src = thumbnail;
  imgElement.dataset.srcFallback = thumbnailFallback;

  // Trigger lazy loading by setting the src attribute
  imgElement.src = thumbnail;

  // Additional code to open the sidebar, if needed
  // For example, changing CSS classes or styles to make the sidebar visible
}

  // New Function to Close Ordering Sidebar
  function closeOrderDetailSidebar() {
    document.getElementById("orderDetailSidebar").style.right = "-400px";
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
    console.log(`Trying to load thumbnail from ${thumbnail}`);
    let img = new Image();
    img.src = thumbnail;
    img.onerror = function () {
      console.error("Error loading thumbnail: ", thumbnail);
    };
    if (itemIndex === -1 && action === "add") {
      cart.push({ dish, price: 0, quantity: 0, thumbnail, thumbnailFallback });
      itemIndex = cart.length - 1;
      console.log("Thumbnail path: ", thumbnail);
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
      console.log("Thumbnail from cart item: ", item.thumbnail);
      // Use data-src and data-srcset for lazy loading
      // onerror will change the source to the fallback image if loading fails
      cartItemsDiv.innerHTML += `
        <div class="cart-item" data-dish="${item.dish}">
          <img 
            data-src="${item.thumbnail}" 
            data-src-fallback="${item.thumbnailFallback}" 
            alt="${item.dish}" 
            width="50"
            loading="lazy"
            onerror="this.src=this.getAttribute('data-src-fallback')"
          >
          ${item.dish} x<span class="cart-item-quantity">${
        item.quantity
      }</span> - $${item.price.toFixed(2)}
        </div>`;
    });

    document.getElementById("cartTotal").innerText = total.toFixed(2);
    openCart();

    // Lazy loading logic
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.src = img.getAttribute("data-src");
    });
  }

  // This function can be reused for showing toast messages
  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("toast-visible");

    setTimeout(() => {
      toast.classList.remove("toast-visible");
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

  // Increment and Decrement buttons inside Ordering Sidebar
  document
    .querySelector(".quantity-controls .increment")
    .addEventListener("click", function () {
      // Your increment logic here.
      // Update #orderQuantity
    });

  document
    .querySelector(".quantity-controls .decrement")
    .addEventListener("click", function () {
      // Your decrement logic here.
      // Update #orderQuantity
    });

  // Add to cart button
  document.getElementById("addToOrder").addEventListener("click", function () {
    // Logic to add to cart
    // Update the cart and close the order detail sidebar
    closeOrderDetailSidebar();
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

//to listen for clicks on each dish image
const dishImages = document.querySelectorAll(".dish-item img");
dishImages.forEach((image) => {
  image.addEventListener("click", function () {
    const dish = image.getAttribute("data-dish");
    const price = parseFloat(image.getAttribute("data-price"));
    const thumbnail = image.src;
    openOrderDetailSidebar(dish, price, thumbnail);
  });
});
