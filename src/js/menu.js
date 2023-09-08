document.addEventListener("DOMContentLoaded", function() {
    // Tab navigation logic
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
      let itemIndex = cart.findIndex(item => item.dish === dish);
  
      if (action === 'add') {
        if (itemIndex >= 0) {
          cart[itemIndex].quantity++;
          cart[itemIndex].price += price;
        } else {
          cart.push({ dish, price, quantity: 1 });
        }
        total += price;
        showToast('Added to cart');
      } else if (action === 'remove' && itemIndex >= 0) {
        if (cart[itemIndex].quantity > 1) {
          cart[itemIndex].quantity--;
          cart[itemIndex].price -= price;
        } else {
          cart.splice(itemIndex, 1);
        }
        total -= price;
        showToast('Removed from cart');
      }
  
      updateCart();
    }
  
    function updateCart() {
      let cartItemsDiv = document.querySelector('.cart-items');
      cartItemsDiv.innerHTML = "";
      
      cart.forEach((item, index) => {
        cartItemsDiv.innerHTML += `<div class="cart-item">${item.dish} x${item.quantity} - $${item.price.toFixed(2)}</div>`;
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
    
    addToCartButtons.forEach(button => {
      button.addEventListener("click", function() {
        addToCart(this.getAttribute("data-dish"), 12, 'add');  // Here 12 is the price
      });
    });
  
    // Increment and Decrement buttons
    const incrementButtons = document.querySelectorAll(".increment");
    const decrementButtons = document.querySelectorAll(".decrement");
    
    incrementButtons.forEach((button) => {
      button.addEventListener("click", function() {
        const input = this.parentNode.querySelector(".quantity");
        input.value = parseInt(input.value, 10) + 1;
      });
    });
  
    decrementButtons.forEach((button) => {
      button.addEventListener("click", function() {
        const input = this.parentNode.querySelector(".quantity");
        if (parseInt(input.value, 10) > 1) {
          input.value = parseInt(input.value, 10) - 1;
        }
      });
    });
  });
  