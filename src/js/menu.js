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

  //open and close the cart:
  function openCart() {
    document.getElementById("cartSidebar").style.right = "0";
  }
  
  function closeCart() {
    document.getElementById("cartSidebar").style.right = "-400px";
  }
  
  //add items to the cart:
  let cart = [];
let total = 0;

function addToCart(dish, price) {
  cart.push({ dish, price });
  total += price;
  updateCart();
}

function updateCart() {
  let cartItemsDiv = document.querySelector('.cart-items');
  cartItemsDiv.innerHTML = "";
  
  cart.forEach((item, index) => {
    cartItemsDiv.innerHTML += `<div class="cart-item">${item.dish} - $${item.price.toFixed(2)}</div>`;
  });
  
  document.getElementById("cartTotal").innerText = total.toFixed(2);
  openCart();
}
//Attach the addToCart function to your "Add to Cart" button. For this example, let's assume the seafood dish is $12.00:
document.addEventListener("DOMContentLoaded", function() {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    
    addToCartButtons.forEach(button => {
      button.addEventListener("click", function() {
        addToCart(this.getAttribute("data-dish"), 12);  // Here 12 is the price, you can dynamically populate this as needed
      });
    });
  });
  