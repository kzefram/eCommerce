document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const appContent = document.getElementById("app-content");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const navLinks = document.querySelectorAll(".nav-link");
  const cartCountEl = document.getElementById("cart-count");

  let cart = [];

  const policyData = {
    privacy: {
      title: "Privacy Policy",
      content: `<p>Your privacy is important to us. It is CraftyBoxes' policy to respect your privacy regarding any information we may collect from you across our website. We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p><p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>`,
    },
    shipping: {
      title: "Shipping Policy",
      content: `<p>All orders are processed within 1-3 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.</p><p>Shipping charges for your order will be calculated and displayed at checkout. We offer standard shipping (5-7 business days) and express shipping (2-3 business days).</p>`,
    },
    returns: {
      title: "Return Policy",
      content: `<p>Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately, we can’t offer you a refund or exchange. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p><p>To complete your return, we require a receipt or proof of purchase. Please do not send your purchase back to the manufacturer. Once your return is received and inspected, we will send you an email to notify you that we have received your returned item.</p>`,
    },
  };

  const pages = {
    home: document.getElementById("home-page").content.cloneNode(true),
    shop: document.getElementById("shop-page").content.cloneNode(true),
    "product-1": document
      .getElementById("product-1-page")
      .content.cloneNode(true),
    "product-2": document
      .getElementById("product-2-page")
      .content.cloneNode(true),
    "product-3": document
      .getElementById("product-3-page")
      .content.cloneNode(true),
    about: document.getElementById("about-page").content.cloneNode(true),
    faq: document.getElementById("faq-page").content.cloneNode(true),
    testimonials: document
      .getElementById("testimonials-page")
      .content.cloneNode(true),
    contact: document.getElementById("contact-page").content.cloneNode(true),
    privacy: document.getElementById("policy-page").content.cloneNode(true),
    shipping: document.getElementById("policy-page").content.cloneNode(true),
    returns: document.getElementById("policy-page").content.cloneNode(true),
    cart: document.getElementById("cart-page").content.cloneNode(true),
    checkout: document.getElementById("checkout-page").content.cloneNode(true),
    account: document.getElementById("account-page").content.cloneNode(true),
  };

  function navigateTo(pageKey) {
    window.scrollTo(0, 0);

    // Clear existing content
    appContent.innerHTML = "";

    let pageContent;

    if (policyData[pageKey]) {
      pageContent = pages.privacy.cloneNode(true);
      pageContent.querySelector("#policy-title").textContent =
        policyData[pageKey].title;
      pageContent.querySelector("#policy-content").innerHTML =
        policyData[pageKey].content;
    } else {
      pageContent = pages[pageKey].cloneNode(true);
    }

    appContent.appendChild(pageContent);

    // Special rendering for cart/checkout
    if (pageKey === "cart") renderCartPage();
    if (pageKey === "checkout") renderCheckoutPage();

    // Update active nav link
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.page === pageKey);
    });

    // Close mobile menu
    mobileMenu.classList.add("hidden");

    // Add event listeners for new content
    addPageEventListeners();
  }

  function addPageEventListeners() {
    // Re-query for links inside the new content
    appContent.querySelectorAll("a[data-page]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo(e.currentTarget.dataset.page);
      });
    });

    // Add to cart buttons
    document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
      button.addEventListener("click", handleAddToCart);
    });

    // Go to checkout button
    const checkoutBtn = document.getElementById("go-to-checkout");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo("checkout");
      });
    }
  }

  function handleAddToCart(e) {
    const productOptions = e.target
      .closest("div")
      .querySelector(".product-options");
    const productId = productOptions.dataset.productId;
    const productName = productOptions.dataset.productName;

    const selectedOption = productOptions.querySelector(
      'input[type="radio"]:checked'
    );
    const size = selectedOption.value;
    const price = parseFloat(selectedOption.dataset.price);

    const existingItem = cart.find(
      (item) => item.id === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        id: productId,
        name: productName,
        size: size,
        price: price,
        quantity: 1,
        image: `https://placehold.co/100x100/${
          productId === "1" ? "a7f3d0" : productId === "2" ? "fbcfe8" : "ffffff"
        }/333333?text=Item`,
      });
    }
    updateCart();
    showToast(`${productName} (${size}) added to cart!`);
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-5 right-5 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;

    // If on cart page, re-render it
    if (appContent.querySelector('[data-page-name="cart"]')) {
      renderCartPage();
    }
  }

  function renderCartPage() {
    const container = document.getElementById("cart-items-container");
    const summaryContainer = document.getElementById("cart-summary");
    const emptyMessage = document.getElementById("cart-empty-message");

    if (cart.length === 0) {
      container.innerHTML = "";
      summaryContainer.innerHTML = "";
      emptyMessage.style.display = "block";
      container.style.display = "none";
      summaryContainer.style.display = "none";
      return;
    }

    emptyMessage.style.display = "none";
    container.style.display = "block";
    summaryContainer.style.display = "block";

    container.innerHTML = `
                <div class="hidden md:grid grid-cols-6 gap-4 font-semibold border-b pb-4 mb-4 text-gray-600">
                    <div class="col-span-2">Product</div>
                    <div>Price</div>
                    <div>Quantity</div>
                    <div>Total</div>
                    <div></div>
                </div>
            `;

    let subtotal = 0;
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const itemEl = document.createElement("div");
      itemEl.className =
        "grid grid-cols-1 md:grid-cols-6 gap-4 items-center border-b py-4";
      itemEl.innerHTML = `
                    <div class="col-span-2 flex items-center space-x-4">
                        <img src="${item.image}" alt="${
        item.name
      }" class="w-16 h-16 rounded-md object-cover">
                        <div>
                            <p class="font-bold">${item.name}</p>
                            <p class="text-sm text-gray-500">${item.size}</p>
                        </div>
                    </div>
                    <div data-label="Price">$${item.price.toFixed(2)}</div>
                    <div data-label="Quantity">
                        <input type="number" value="${
                          item.quantity
                        }" min="1" class="w-16 border rounded-md p-1 text-center quantity-input" data-index="${index}">
                    </div>
                    <div data-label="Total" class="font-semibold">$${itemTotal.toFixed(
                      2
                    )}</div>
                    <div class="text-right">
                        <button class="text-red-500 hover:text-red-700 remove-item-btn" data-index="${index}"><i data-lucide="trash-2"></i></button>
                    </div>
                `;
      container.appendChild(itemEl);
    });

    summaryContainer.innerHTML = `
                <div class="bg-gray-100 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold mb-4">Cart Summary</h3>
                    <div class="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between mb-4">
                        <span>Shipping</span>
                        <span>$5.00</span>
                    </div>
                    <div class="flex justify-between font-bold text-lg border-t pt-4">
                        <span>Total</span>
                        <span>$${(subtotal + 5.0).toFixed(2)}</span>
                    </div>
                    <button id="go-to-checkout" class="primary-btn w-full mt-6">Proceed to Checkout</button>
                </div>
            `;

    lucide.createIcons(); // Re-render icons for trash cans

    // Add event listeners for cart interactions
    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const index = e.target.dataset.index;
        const newQuantity = parseInt(e.target.value);
        if (newQuantity > 0) {
          cart[index].quantity = newQuantity;
          updateCart();
        }
      });
    });

    document.querySelectorAll(".remove-item-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.currentTarget.dataset.index;
        cart.splice(index, 1);
        updateCart();
      });
    });
  }

  function renderCheckoutPage() {
    const itemsContainer = document.getElementById("checkout-summary-items");
    const totalPriceEl = document.getElementById("checkout-total-price");

    itemsContainer.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const itemEl = document.createElement("div");
      itemEl.className = "flex justify-between items-center py-2 border-b";
      itemEl.innerHTML = `
                    <div class="flex items-center space-x-2">
                        <img src="${item.image}" alt="${
        item.name
      }" class="w-12 h-12 rounded-md object-cover">
                        <div>
                             <p class="font-semibold">${
                               item.name
                             } <span class="text-sm font-normal">x${
        item.quantity
      }</span></p>
                             <p class="text-sm text-gray-500">${item.size}</p>
                        </div>
                    </div>
                    <span class="font-semibold">$${itemTotal.toFixed(2)}</span>
                `;
      itemsContainer.appendChild(itemEl);
    });

    const total = subtotal + 5.0; // Assuming $5 shipping
    totalPriceEl.textContent = `$${total.toFixed(2)}`;
  }

  // --- Initial Setup ---

  // Mobile menu toggle
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  // Add event listeners to header/footer links
  document
    .querySelectorAll("header a[data-page], footer a[data-page]")
    .forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo(e.currentTarget.dataset.page);
      });
    });

  // Initial page load
  navigateTo("home");
});
