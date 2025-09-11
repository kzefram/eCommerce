document.addEventListener("DOMContentLoaded", () => {
  // --- UTILITY FUNCTIONS ---

  /**
   * Retrieves the cart from localStorage.
   * @returns {Array} The cart items.
   */
  const getCart = () => {
    const cart = localStorage.getItem("craftyBoxesCart");
    return cart ? JSON.parse(cart) : [];
  };

  /**
   * Saves the cart to localStorage.
   * @param {Array} cart - The cart array to save.
   */
  const saveCart = (cart) => {
    localStorage.setItem("craftyBoxesCart", JSON.stringify(cart));
  };

  /**
   * Updates the cart icon count in the header.
   */
  const updateCartIcon = () => {
    const cart = getCart();
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
      // Calculate total quantity of all items
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCountElement.textContent = totalItems;
    }
  };

  // --- PRODUCT PAGE LOGIC ---

  const addToCartButton = document.getElementById("add-to-cart-btn");

  if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
      const productId = addToCartButton.dataset.productId;
      const productName = addToCartButton.dataset.productName;
      const productImage = addToCartButton.dataset.productImage;

      const selectedSizeEl = document.querySelector(
        'input[name="size-choice"]:checked'
      );
      const size = selectedSizeEl ? selectedSizeEl.value : "Standard";

      const priceText = document.getElementById("product-price").textContent;
      const price = parseFloat(priceText.replace("$", ""));

      const quantityInput = document.getElementById("quantity-input");
      const quantity = parseInt(quantityInput.value);

      // Create a unique ID for the item based on product and size
      const itemID = `${productId}_${size.toLowerCase()}`;

      let cart = getCart();

      // Check if item already exists in cart
      const existingItem = cart.find((item) => item.id === itemID);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const newItem = {
          id: itemID,
          productId: productId,
          name: productName,
          size: size,
          price: price,
          quantity: quantity,
          image: productImage,
        };
        cart.push(newItem);
      }

      saveCart(cart);
      updateCartIcon();

      // Optional: Give user feedback
      addToCartButton.textContent = "Added!";
      setTimeout(() => {
        addToCartButton.textContent = "Add to Cart";
      }, 1500);
    });
  }

  // --- CART PAGE LOGIC ---

  const renderCartPage = () => {
    const cartItemsContainer = document.getElementById("cart-items-container");
    if (!cartItemsContainer) return; // Only run on cart page

    const cart = getCart();

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="text-gray-600 col-span-full text-center py-10">Your shopping cart is empty.</p>';
      // Also clear totals
      document.getElementById("cart-subtotal").textContent = "$0.00";
      document.getElementById("cart-tax").textContent = "$0.00";
      document.getElementById("cart-total").textContent = "$0.00";
      return;
    }

    let cartHTML = "";
    let subtotal = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      cartHTML += `
                <div class="grid grid-cols-6 gap-4 items-center border-b py-4">
                    <div class="col-span-2 flex items-center space-x-4">
                        <img src="${item.image}" alt="${
        item.name
      }" class="w-20 h-20 object-cover rounded-md">
                        <div>
                            <p class="font-semibold">${item.name}</p>
                            <p class="text-sm text-gray-500">Size: ${
                              item.size
                            }</p>
                        </div>
                    </div>
                    <div class="text-center">$${item.price.toFixed(2)}</div>
                    <div class="text-center">${item.quantity}</div>
                    <div class="text-center font-semibold">$${itemTotal.toFixed(
                      2
                    )}</div>
                    <div class="text-center">
                        <button class="remove-item-btn text-red-500 hover:text-red-700" data-item-id="${
                          item.id
                        }">
                            <i data-lucide="trash-2" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
            `;
    });

    cartItemsContainer.innerHTML = cartHTML;

    // Calculate totals
    const tax = subtotal * 0.15;
    const shipping = 5.0; // Flat rate
    const total = subtotal + tax + shipping;

    document.getElementById("cart-subtotal").textContent = `$${subtotal.toFixed(
      2
    )}`;
    document.getElementById("cart-tax").textContent = `$${tax.toFixed(2)}`;
    document.getElementById("cart-total").textContent = `$${total.toFixed(2)}`;

    // Re-initialize icons and add event listeners for remove buttons
    lucide.createIcons();
    addRemoveEventListeners();
  };

  const addRemoveEventListeners = () => {
    const removeButtons = document.querySelectorAll(".remove-item-btn");
    removeButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemId = event.currentTarget.dataset.itemId;
        let cart = getCart();
        cart = cart.filter((item) => item.id !== itemId);
        saveCart(cart);
        renderCartPage(); // Re-render the cart
        updateCartIcon(); // Update the icon in the header
      });
    });
  };

  // --- INITIALIZATION ---

  // Update cart icon on every page load
  updateCartIcon();

  // If we are on the cart page, render the items
  if (window.location.pathname.endsWith("cart.html")) {
    renderCartPage();
  }
});
