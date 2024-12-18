document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartSubtotalElement = document.getElementById("cart-subtotal");
  
    // Function to render cart items
    function renderCartItems() {
      const storedProducts = JSON.parse(localStorage.getItem("cart")) || [];
      cartItemsContainer.innerHTML = ""; // Clear the existing cart
      let subtotal = 0;
  
      storedProducts.forEach((product, index) => {
        const { id, product_name, quantity,product_image } = product;
        const price = Number(product.price);
        
        const itemTotal = quantity * price;
        subtotal += itemTotal;
  
        const cartItemHTML = `
          <li>
            <div class="tpcart__item">
              <div class="tpcart__img">
                <img src="${product_image}" alt="${product_name}">
                <div class="tpcart__del">
                  <a href="#" onclick="removeItem(${index})"><i class="icon-x-circle"></i></a>
                </div>
              </div>
              <div class="tpcart__content">
                <span class="tpcart__content-title">${product_name}</span>
                <div class="tpcart__cart-price">
                  <span class="quantity">${quantity} x</span>
                  <span class="new-price">₹${price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </li>
        `;
        cartItemsContainer.insertAdjacentHTML("beforeend", cartItemHTML);
      });
  
      cartSubtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    }
  
    // Function to remove an item
    window.removeItem = function (index) {
      let storedProducts = JSON.parse(localStorage.getItem("cart")) || [];
      storedProducts.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(storedProducts));
  
      // Fire cartUpdated event
      const cartUpdatedEvent = new Event("cartUpdated");
      window.dispatchEvent(cartUpdatedEvent);
    };
  
    // Listen for the custom "cartUpdated" event to re-render cart
    window.addEventListener("cartUpdated", function () {
      renderCartItems();
    });
  
    // Initial render
    renderCartItems();
  });
  