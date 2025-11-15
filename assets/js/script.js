'use strict';



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const menuToggleBtn = document.querySelector("[data-menu-toggle-btn]");

menuToggleBtn.addEventListener("click", function () {
  navbar.classList.toggle("active");
  this.classList.toggle("active");
});

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    menuToggleBtn.classList.toggle("active");
  });
}



/**
 * header sticky & back to top
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

// Initialize food menu filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const foodMenuItems = document.querySelectorAll('.food-menu-list li');

// Set active class on filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    btn.classList.add('active');
    
    const category = btn.textContent.toLowerCase().trim();
    
    foodMenuItems.forEach(item => {
      const itemCategory = item.querySelector('.category').textContent.toLowerCase();
      if (category === 'all' || category === itemCategory) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Initialize food menu buttons
document.querySelectorAll('.food-menu-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const productData = JSON.parse(btn.dataset.product || '{}');
    if (productData.id) {
      addToCart(productData);
      // Show some feedback
      cartContainer.classList.add("active");
      document.body.classList.add("active");
    }
  });
});



/**
 * search box toggle
 */

const searchBtn = document.querySelector("[data-search-btn]");
const searchContainer = document.querySelector("[data-search-container]");
const searchSubmitBtn = document.querySelector("[data-search-submit-btn]");
const searchCloseBtn = document.querySelector("[data-search-close-btn]");

const searchBoxElems = [searchBtn, searchSubmitBtn, searchCloseBtn];

for (let i = 0; i < searchBoxElems.length; i++) {
  searchBoxElems[i].addEventListener("click", function () {
    searchContainer.classList.toggle("active");
    document.body.classList.toggle("active");
  });
}

/**
 * cart functionality
 */

const cartBtn = document.querySelector("[data-cart-btn]");
const cartContainer = document.querySelector("[data-cart-container]");
const cartCloseBtn = document.querySelector("[data-cart-close-btn]");
const cartItems = document.querySelector("[data-cart-items]");
const cartCount = document.querySelector(".cart-count");
const totalAmount = document.querySelector(".total-amount");

let cart = [];

// Toggle cart
cartBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  cartContainer.classList.add("active");
  document.body.classList.add("active");
});

// Only close cart when explicitly clicking close button
cartCloseBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  cartContainer.classList.remove("active");
  document.body.classList.remove("active");
});

// Close cart when clicking the overlay (background)
document.addEventListener("click", (e) => {
  if (cartContainer.classList.contains("active") && 
      !e.target.closest(".cart-box") && 
      !e.target.closest("[data-cart-btn]")) {
    cartContainer.classList.remove("active");
    document.body.classList.remove("active");
  }
});

// Close cart when clicking outside
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("cart-overlay")) {
    cartContainer.classList.remove("active");
    document.body.classList.remove("active");
  }
});

//Add to cart function
function addToCart(product) {
  console.log('Adding to cart:', product);
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
    updateCartItem(existingItem);
  } else {
    const cartItem = { 
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
      quantity: 1 
    };
    cart.push(cartItem);
    createCartItemElement(cartItem);
  }
  
  updateCartCount();
  updateTotalAmount();
  console.log('Current cart:', cart);
  
  // Show cart after adding item
  cartContainer.classList.add("active");
  document.body.classList.add("active");
}

// Update cart item display
function updateCartItem(item) {
  const element = cartItems.querySelector(`[data-id="${item.id}"]`);
  if (!element) return;
  
  const quantityElement = element.querySelector(".quantity");
  const priceElement = element.querySelector(".item-price");
  
  if (quantityElement) {
    quantityElement.textContent = item.quantity;
  }
  if (priceElement) {
    priceElement.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
  }
}

// Update cart count
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Update total amount
function updateTotalAmount() {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalAmount.textContent = `$${total.toFixed(2)}`;
}

// Create cart item element
function createCartItemElement(item) {
  const div = document.createElement("div");
  div.classList.add("cart-item");
  div.dataset.id = item.id;
  
  div.innerHTML = `
    <div class="item-content">
      <div class="item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="item-details">
        <h4 class="item-name">${item.name}</h4>
        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        <div class="item-quantity">
          <button type="button" class="quantity-btn minus" aria-label="Decrease quantity">
            <ion-icon name="remove-outline"></ion-icon>
          </button>
          <span class="quantity">${item.quantity}</span>
          <button type="button" class="quantity-btn plus" aria-label="Increase quantity">
            <ion-icon name="add-outline"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  `;

  cartItems.appendChild(div);

  // Set up quantity controls after the element is added to DOM
  const plusBtn = div.querySelector(".plus");
  const minusBtn = div.querySelector(".minus");
  
  plusBtn.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('Plus clicked for item:', item.id);
    updateItemQuantity(item.id, 1);
  });

  minusBtn.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('Minus clicked for item:', item.id);
    updateItemQuantity(item.id, -1);
  });

  // Add animation after setup
  requestAnimationFrame(() => {
    div.style.opacity = '1';
    div.style.transform = 'translateX(0)';
  });
}

// Update item quantity
function updateItemQuantity(id, change) {
  console.log('Updating quantity for item:', id, 'change:', change);
  const itemIndex = cart.findIndex(item => item.id === id);
  if (itemIndex === -1) return;
  
  const item = cart[itemIndex];
  const newQuantity = item.quantity + change;
  console.log('New quantity will be:', newQuantity);
  
  if (newQuantity <= 0) {
    // Remove item from cart
    cart.splice(itemIndex, 1);
    const element = cartItems.querySelector(`[data-id="${id}"]`);
    if (element) {
      element.remove();
      updateCartCount();
      updateTotalAmount();
    }
  } else {
    // Update quantity
    item.quantity = newQuantity;
    cart[itemIndex] = item;
    const element = cartItems.querySelector(`[data-id="${id}"]`);
    if (element) {
      const quantityEl = element.querySelector('.quantity');
      const priceEl = element.querySelector('.item-price');
      if (quantityEl) quantityEl.textContent = newQuantity;
      if (priceEl) priceEl.textContent = `$${(item.price * newQuantity).toFixed(2)}`;
    }
    updateCartCount();
    updateTotalAmount();
  }
  console.log('Cart after update:', cart);
}






/**
 * move cycle on scroll
 */

const deliveryBoy = document.querySelector("[data-delivery-boy]");

let deliveryBoyMove = -80;
let lastScrollPos = 0;

window.addEventListener("scroll", function () {

  let deliveryBoyTopPos = deliveryBoy.getBoundingClientRect().top;

  if (deliveryBoyTopPos < 500 && deliveryBoyTopPos > -250) {
    let activeScrollPos = window.scrollY;

    if (lastScrollPos < activeScrollPos) {
      deliveryBoyMove += 1;
    } else {
      deliveryBoyMove -= 1;
    }

    lastScrollPos = activeScrollPos;
    deliveryBoy.style.transform = `translateX(${deliveryBoyMove}px)`;
  }

});

// Handle checkout process
function handleCheckout() {
  console.log('Checkout clicked');
  
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  console.log('Showing thank you popup');
  
  // Show thank you popup
  thankYouPopup.style.visibility = 'visible';
  thankYouPopup.style.opacity = '1';

  // Clear the cart
  cart = [];
  cartItems.innerHTML = '';
  updateCartCount();
  updateTotalAmount();

  // Close the cart
  cartContainer.classList.remove('active');
  document.body.classList.remove('active');

  // Close popup after 3 seconds
  setTimeout(() => {
    thankYouPopup.style.visibility = 'hidden';
    thankYouPopup.style.opacity = '0';
  }, 3000);
}

// Initialize checkout functionality
const checkoutBtn = document.querySelector('[data-checkout-btn]');
const thankYouPopup = document.querySelector('[data-thank-you-popup]');
const popupCloseBtn = document.querySelector('[data-popup-close]');

// Add event listener for checkout button
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    handleCheckout();
  });
}

// Add event listener for popup close button
if (popupCloseBtn) {
  popupCloseBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    thankYouPopup.style.visibility = 'hidden';
    thankYouPopup.style.opacity = '0';
  });
}

// Close popup when clicking overlay
thankYouPopup.addEventListener('click', function(e) {
  if (e.target === thankYouPopup || e.target.classList.contains('popup-overlay')) {
    thankYouPopup.style.visibility = 'hidden';
    thankYouPopup.style.opacity = '0';
  }
});