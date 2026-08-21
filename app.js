/* ==========================================================================
   Aura Café & Artisanal Bakery - Application Logic (Vanilla JS)
   ========================================================================== */

// --- 1. MENU CATALOG DATASET ---
const MENU_DATA = [
  {
    id: "item-1",
    name: "Artisan Velvet Latte",
    category: "espresso",
    price: 5.50,
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    description: "Double shot of single-origin espresso with micro-foamed milk & organic vanilla bean syrup.",
    tags: ["gf"],
    customizable: true,
    options: { milk: true, sweetness: true, shots: true, syrups: true }
  },
  {
    id: "item-2",
    name: "Cascading Nitro Cold Brew",
    category: "cold",
    price: 6.20,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
    badge: "Signature",
    description: "Steeped for 20 hours and infused with nitrogen for a velvety stout-like crema and chocolate notes.",
    tags: ["vegan", "gf", "nutfree"],
    customizable: true,
    options: { milk: true, sweetness: true, shots: false, syrups: true }
  },
  {
    id: "item-3",
    name: "Iced Ceremonial Matcha",
    category: "tea",
    price: 6.50,
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
    badge: "Organic",
    description: "First-harvest Uji ceremonial matcha layered with oat milk and a touch of raw agave.",
    tags: ["vegan", "gf", "nutfree"],
    customizable: true,
    options: { milk: true, sweetness: true, shots: false, syrups: false }
  },
  {
    id: "item-4",
    name: "Almond Twice-Baked Croissant",
    category: "pastry",
    price: 4.80,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    badge: "Fresh Baked",
    description: "Flaky French sourdough croissant filled with frangipane cream and topped with sliced toasted almonds.",
    tags: [],
    customizable: false
  },
  {
    id: "item-5",
    name: "Poached Egg Avocado Sourdough",
    category: "brunch",
    price: 12.50,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    badge: "Chef Special",
    description: "Hass avocado mash on 36-hr sourdough, topped with organic poached eggs, microgreens, and Aleppo chili flakes.",
    tags: ["nutfree"],
    customizable: false
  },
  {
    id: "item-6",
    name: "Gold Standard Spanish Latte",
    category: "espresso",
    price: 5.80,
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80",
    badge: "Popular",
    description: "Espresso sweetened with spiced condensed milk and dusted with Ceylon cinnamon.",
    tags: ["gf", "nutfree"],
    customizable: true,
    options: { milk: true, sweetness: true, shots: true, syrups: false }
  },
  {
    id: "item-7",
    name: "Pistachio Rose Danish",
    category: "pastry",
    price: 5.20,
    image: "https://images.unsplash.com/photo-1621236378699-8597faf6a176?auto=format&fit=crop&w=800&q=80",
    badge: "Artisanal",
    description: "Crisp puff pastry layered with crushed Sicilian pistachios and a hint of organic rose water glaze.",
    tags: [],
    customizable: false
  },
  {
    id: "item-8",
    name: "Truffle Mushroom Toast",
    category: "brunch",
    price: 13.80,
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80",
    badge: "Gourmet",
    description: "Sauteed wild cremini mushrooms with black truffle butter, fresh thyme, and whipped ricotta on toasted brioche.",
    tags: ["nutfree"],
    customizable: false
  },
  {
    id: "item-9",
    name: "Hibiscus Citrus Iced Tea",
    category: "tea",
    price: 4.90,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    badge: "Refreshing",
    description: "Organic Egyptian hibiscus flowers cold-infused with blood orange slice and fresh mint.",
    tags: ["vegan", "gf", "nutfree"],
    customizable: false
  },
  {
    id: "item-10",
    name: "Dark Chocolate Mocha Frappe",
    category: "cold",
    price: 6.80,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    badge: "Decadent",
    description: "Blended double espresso with 70% Valrhona dark chocolate, crushed ice, and fresh whipped cream.",
    tags: ["gf"],
    customizable: true,
    options: { milk: true, sweetness: true, shots: true, syrups: true }
  }
];

// --- 2. GLOBAL STATE ---
let state = {
  cart: JSON.parse(localStorage.getItem('aura_cart') || '[]'),
  favorites: new Set(JSON.parse(localStorage.getItem('aura_favs') || '[]')),
  activeCategory: 'all',
  activeDiet: 'all',
  searchQuery: '',
  appliedPromo: 0, // Discount multiplier (e.g., 0.10 for 10%)
  currentCustomItem: null
};

// --- 3. DOM ELEMENTS ---
const menuGrid = document.getElementById('menu-grid');
const menuSearch = document.getElementById('menu-search');
const categoryTabs = document.getElementById('category-tabs');
const dietaryFilters = document.getElementById('dietary-filters');
const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
const cartDrawerBtn = document.getElementById('cart-drawer-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTax = document.getElementById('cart-tax');
const cartTotal = document.getElementById('cart-total');
const promoInput = document.getElementById('promo-input');
const applyPromoBtn = document.getElementById('apply-promo-btn');
const checkoutBtn = document.getElementById('checkout-btn');

// Modals
const customModal = document.getElementById('customization-modal');
const customModalBody = document.getElementById('custom-modal-body');
const closeCustomBtn = document.getElementById('close-custom-btn');

const checkoutModal = document.getElementById('checkout-modal');
const checkoutModalBody = document.getElementById('checkout-modal-body');
const closeCheckoutBtn = document.getElementById('close-checkout-btn');

const resModal = document.getElementById('reservation-modal');
const resModalBody = document.getElementById('res-modal-body');
const closeResModalBtn = document.getElementById('close-res-modal-btn');

const quizModal = document.getElementById('quiz-modal');
const quizModalBody = document.getElementById('quiz-modal-body');
const openQuizBtn = document.getElementById('open-quiz-btn');
const closeQuizBtn = document.getElementById('close-quiz-btn');

const resForm = document.getElementById('res-form');
const copyWifiBtn = document.getElementById('copy-wifi-btn');

// --- 4. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  updateCartUI();
  setupEventListeners();
  updateLiveStatus();
  setDefaultDate();
});

// --- 5. RENDER MENU ---
function renderMenu() {
  menuGrid.innerHTML = '';

  const filtered = MENU_DATA.filter(item => {
    // Category match
    const matchCategory = state.activeCategory === 'all' || item.category === state.activeCategory;
    // Diet match
    const matchDiet = state.activeDiet === 'all' || item.tags.includes(state.activeDiet);
    // Search query match
    const matchSearch = item.name.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
                        item.description.toLowerCase().includes(state.searchQuery.toLowerCase());

    return matchCategory && matchDiet && matchSearch;
  });

  if (filtered.length === 0) {
    menuGrid.innerHTML = `
      <div class="empty-menu">
        <i class="fa-solid fa-mug-saucer"></i>
        <h3>No matching coffee or treat found</h3>
        <p>Try clearing your search terms or dietary filters.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const isFav = state.favorites.has(item.id);
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <div class="card-img-holder">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ''}
        <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${item.id}" title="Toggle Favorite">
          <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
      </div>

      <div class="card-content">
        <div class="card-header">
          <h3 class="card-title">${item.name}</h3>
          <span class="card-price">$${item.price.toFixed(2)}</span>
        </div>
        <p class="card-desc">${item.description}</p>
        
        <div class="card-tags">
          ${item.tags.map(tag => `<span class="tag-mini">${formatTag(tag)}</span>`).join('')}
        </div>

        <div class="card-footer">
          ${item.customizable ? `
            <button class="btn btn-secondary customize-btn" data-id="${item.id}" style="width: 100%;">
              <i class="fa-solid fa-sliders"></i> Customize & Add
            </button>
          ` : `
            <button class="btn btn-primary quick-add-btn" data-id="${item.id}" style="width: 100%;">
              <i class="fa-solid fa-plus"></i> Add to Order
            </button>
          `}
        </div>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

function formatTag(tag) {
  if (tag === 'vegan') return '🌱 Vegan';
  if (tag === 'gf') return '🌾 Gluten-Free';
  if (tag === 'nutfree') return '🥜 Nut-Free';
  return tag;
}

// --- 6. CUSTOMIZATION MODAL ---
function openCustomizationModal(itemId) {
  const item = MENU_DATA.find(i => i.id === itemId);
  if (!item) return;

  state.currentCustomItem = {
    ...item,
    selectedMilk: 'Oat Milk',
    milkExtra: 0.50,
    selectedSweetness: '100% Sweet',
    extraShot: false,
    selectedSyrup: 'None',
    syrupExtra: 0
  };

  renderCustomizationBody();
  customModal.classList.add('active');
}

function renderCustomizationBody() {
  const item = state.currentCustomItem;
  let total = item.price + (item.selectedMilk !== 'Whole Milk' ? item.milkExtra : 0) + (item.extraShot ? 0.80 : 0) + item.syrupExtra;

  customModalBody.innerHTML = `
    <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 24px;">
      <img src="${item.image}" style="width: 90px; height: 90px; border-radius: 16px; object-fit: cover;">
      <div>
        <h2 class="font-serif">${item.name}</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Base Price: $${item.price.toFixed(2)}</p>
      </div>
    </div>

    <form id="custom-form" style="display: flex; flex-direction: column; gap: 20px;">
      ${item.options.milk ? `
        <div class="form-group">
          <label>Choose Milk / Dairy Alternative</label>
          <select id="milk-select" class="form-input">
            <option value="Oat Milk|0.50" selected>Oat Milk (+ $0.50)</option>
            <option value="Almond Milk|0.50">Almond Milk (+ $0.50)</option>
            <option value="Whole Milk|0.00">Organic Whole Milk (Included)</option>
            <option value="Coconut Milk|0.50">Coconut Milk (+ $0.50)</option>
          </select>
        </div>
      ` : ''}

      ${item.options.sweetness ? `
        <div class="form-group">
          <label>Sweetness Level</label>
          <select id="sweet-select" class="form-input">
            <option value="100% Sweet">100% Standard Sweetness</option>
            <option value="50% Less Sweet">50% Less Sweet</option>
            <option value="Unsweetened">Unsweetened (0%)</option>
          </select>
        </div>
      ` : ''}

      ${item.options.shots ? `
        <div class="form-group" style="flex-direction: row; align-items: center; gap: 12px;">
          <input type="checkbox" id="shot-check" style="width: 20px; height: 20px; accent-color: var(--color-primary);">
          <label for="shot-check" style="cursor: pointer;">Add Extra Espresso Shot (+ $0.80)</label>
        </div>
      ` : ''}

      ${item.options.syrups ? `
        <div class="form-group">
          <label>Flavored Syrup</label>
          <select id="syrup-select" class="form-input">
            <option value="None|0.00" selected>None</option>
            <option value="Organic Vanilla|0.50">Organic Madagascar Vanilla (+ $0.50)</option>
            <option value="Salted Caramel|0.50">Salted Caramel (+ $0.50)</option>
            <option value="Hazelnut|0.50">Roasted Hazelnut (+ $0.50)</option>
          </select>
        </div>
      ` : ''}

      <div class="form-group">
        <label for="custom-notes">Barista Notes (Optional)</label>
        <input type="text" id="custom-notes" class="form-input" placeholder="e.g. Extra hot, light ice...">
      </div>

      <button type="submit" class="btn btn-primary" style="margin-top: 10px;">
        Add to Cart • <span id="custom-total-btn">$${total.toFixed(2)}</span>
      </button>
    </form>
  `;

  // Attach dynamic total listeners inside modal
  const milkSelect = document.getElementById('milk-select');
  const shotCheck = document.getElementById('shot-check');
  const syrupSelect = document.getElementById('syrup-select');

  const updateCalculatedPrice = () => {
    let currentTotal = item.price;
    if (milkSelect) {
      const [mName, mCost] = milkSelect.value.split('|');
      currentTotal += parseFloat(mCost);
    }
    if (shotCheck && shotCheck.checked) {
      currentTotal += 0.80;
    }
    if (syrupSelect) {
      const [sName, sCost] = syrupSelect.value.split('|');
      currentTotal += parseFloat(sCost);
    }
    document.getElementById('custom-total-btn').textContent = `$${currentTotal.toFixed(2)}`;
  };

  if (milkSelect) milkSelect.addEventListener('change', updateCalculatedPrice);
  if (shotCheck) shotCheck.addEventListener('change', updateCalculatedPrice);
  if (syrupSelect) syrupSelect.addEventListener('change', updateCalculatedPrice);

  document.getElementById('custom-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const notes = document.getElementById('custom-notes').value;
    
    let optionsText = [];
    let extraCost = 0;

    if (milkSelect) {
      const [mName, mCost] = milkSelect.value.split('|');
      optionsText.push(mName);
      extraCost += parseFloat(mCost);
    }
    if (document.getElementById('sweet-select')) {
      optionsText.push(document.getElementById('sweet-select').value);
    }
    if (shotCheck && shotCheck.checked) {
      optionsText.push('Extra Shot');
      extraCost += 0.80;
    }
    if (syrupSelect) {
      const [sName, sCost] = syrupSelect.value.split('|');
      if (sName !== 'None') {
        optionsText.push(sName);
        extraCost += parseFloat(sCost);
      }
    }
    if (notes) optionsText.push(`Note: "${notes}"`);

    addToCart(item, optionsText.join(', '), extraCost);
    customModal.classList.remove('active');
  });
}

// --- 7. CART MANAGEMENT ---
function addToCart(item, customizationText = '', extraCost = 0) {
  const finalUnitPrice = item.price + extraCost;
  const cartItemId = `${item.id}-${customizationText}`;

  const existing = state.cart.find(ci => ci.cartItemId === cartItemId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      cartItemId: cartItemId,
      id: item.id,
      name: item.name,
      image: item.image,
      unitPrice: finalUnitPrice,
      customization: customizationText,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(`Added ${item.name} to your order!`, 'success');
}

function saveCart() {
  localStorage.setItem('aura_cart', JSON.stringify(state.cart));
}

function updateCartUI() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;
  if (totalItems > 0) {
    cartCount.classList.add('active');
  } else {
    cartCount.classList.remove('active');
  }

  // Render Items in Drawer
  if (state.cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 0; color: var(--text-muted);">
        <i class="fa-solid fa-basket-shopping" style="font-size: 2.5rem; color: var(--color-primary); margin-bottom: 12px;"></i>
        <p>Your cart is empty.</p>
        <p style="font-size: 0.85rem; margin-top: 6px;">Add drinks or pastries to get started!</p>
      </div>
    `;
    cartSubtotal.textContent = '$0.00';
    cartTax.textContent = '$0.00';
    cartTotal.textContent = '$0.00';
    return;
  }

  cartItemsContainer.innerHTML = '';
  let subtotal = 0;

  state.cart.forEach(item => {
    const itemTotal = item.unitPrice * item.qty;
    subtotal += itemTotal;

    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        ${item.customization ? `<div class="cart-item-options">${item.customization}</div>` : ''}
        <div class="cart-item-bottom">
          <span style="color: var(--color-primary); font-weight: 700;">$${itemTotal.toFixed(2)}</span>
          <div class="cart-qty">
            <button class="qty-btn" onclick="changeQty('${item.cartItemId}', -1)">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.cartItemId}', 1)">+</button>
          </div>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(el);
  });

  const tax = subtotal * 0.08;
  const discount = subtotal * state.appliedPromo;
  const total = subtotal + tax - discount;

  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  cartTax.textContent = `$${tax.toFixed(2)}`;
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

window.changeQty = function(cartItemId, delta) {
  const item = state.cart.find(ci => ci.cartItemId === cartItemId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter(ci => ci.cartItemId !== cartItemId);
  }
  saveCart();
  updateCartUI();
};

// --- 8. CHECKOUT & SIMULATED ORDER TRACKER ---
function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }

  let subtotal = state.cart.reduce((sum, i) => sum + (i.unitPrice * i.qty), 0);
  let tax = subtotal * 0.08;
  let discount = subtotal * state.appliedPromo;
  let grandTotal = subtotal + tax - discount;

  checkoutModalBody.innerHTML = `
    <h2 class="font-serif" style="margin-bottom: 8px;">Order Checkout</h2>
    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">Confirm your pickup details and payment method.</p>

    <form id="checkout-form">
      <div class="form-group" style="margin-bottom: 16px;">
        <label>Pickup Location</label>
        <div class="form-input" style="background: var(--bg-card); display: flex; align-items: center; gap: 10px;">
          <i class="fa-solid fa-location-dot" style="color: var(--color-primary);"></i>
          <span>Aura Café • 742 Velvet Artisan Way, Suite 100</span>
        </div>
      </div>

      <div class="form-group" style="margin-bottom: 16px;">
        <label for="pickup-time">Estimated Express Pickup Time</label>
        <select id="pickup-time" class="form-input">
          <option value="ASAP">ASAP (In 8-12 Minutes)</option>
          <option value="30 Mins">In 30 Minutes</option>
          <option value="1 Hour">In 1 Hour</option>
        </select>
      </div>

      <div class="form-group" style="margin-bottom: 20px;">
        <label>Payment Method</label>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          <label style="border: 1px solid var(--border-light); padding: 12px; border-radius: 8px; text-align: center; cursor: pointer;">
            <input type="radio" name="pay-method" value="Apple Pay" checked style="accent-color: var(--color-primary);">
            <div style="margin-top: 4px; font-size: 0.85rem;"><i class="fa-brands fa-apple"></i> Apple Pay</div>
          </label>
          <label style="border: 1px solid var(--border-light); padding: 12px; border-radius: 8px; text-align: center; cursor: pointer;">
            <input type="radio" name="pay-method" value="Credit Card" style="accent-color: var(--color-primary);">
            <div style="margin-top: 4px; font-size: 0.85rem;"><i class="fa-solid fa-credit-card"></i> Card</div>
          </label>
          <label style="border: 1px solid var(--border-light); padding: 12px; border-radius: 8px; text-align: center; cursor: pointer;">
            <input type="radio" name="pay-method" value="Cash on Pickup" style="accent-color: var(--color-primary);">
            <div style="margin-top: 4px; font-size: 0.85rem;"><i class="fa-solid fa-money-bill-wave"></i> Cash</div>
          </label>
        </div>
      </div>

      <div style="padding: 16px; background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-light); margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.1rem; color: var(--text-main);">
          <span>Amount to Pay</span>
          <span style="color: var(--color-primary);">$${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%;">
        <i class="fa-solid fa-lock"></i> Pay & Place Order
      </button>
    </form>
  `;

  cartDrawerOverlay.classList.remove('active');
  checkoutModal.classList.add('active');

  document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    startOrderTrackingView();
  });
}

function startOrderTrackingView() {
  const orderId = `#AURA-${Math.floor(1000 + Math.random() * 9000)}`;
  state.cart = [];
  saveCart();
  updateCartUI();

  checkoutModalBody.innerHTML = `
    <div style="text-align: center; padding: 20px 0;">
      <div class="logo-icon" style="width: 60px; height: 60px; font-size: 2rem; margin: 0 auto 16px auto;">
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <h2 class="font-serif">Order Confirmed!</h2>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 4px;">Order Code: <strong style="color: var(--color-primary);">${orderId}</strong></p>

      <div style="margin: 32px 0; text-align: left; background: var(--bg-card); padding: 24px; border-radius: 16px; border: 1px solid var(--border-light);">
        <h4 style="margin-bottom: 16px;">Live Barista Progress</h4>
        
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 14px;" id="step-1">
            <i class="fa-solid fa-circle-check" style="color: #2ecc71; font-size: 1.2rem;"></i>
            <div>
              <div style="font-weight: 600;">Order Received</div>
              <div style="font-size: 0.8rem; color: var(--text-dim);">Sent directly to Barista Display Screen</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 14px;" id="step-2">
            <i class="fa-solid fa-mug-hot" style="color: var(--color-primary); font-size: 1.2rem; animation: float 1.5s infinite alternate;"></i>
            <div>
              <div style="font-weight: 600;">Grinding & Brewing</div>
              <div style="font-size: 0.8rem; color: var(--text-dim);">Extracting single-origin espresso shots</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 14px; opacity: 0.4;" id="step-3">
            <i class="fa-solid fa-box-open" style="font-size: 1.2rem;"></i>
            <div>
              <div style="font-weight: 600;">Ready at Pickup Counter</div>
              <div style="font-size: 0.8rem; color: var(--text-dim);">Estimated in 5 minutes</div>
            </div>
          </div>
        </div>
      </div>

      <button class="btn btn-secondary" onclick="document.getElementById('checkout-modal').classList.remove('active')">
        Close Tracker & Return Home
      </button>
    </div>
  `;
}

// --- 9. EVENT LISTENERS & INTERACTION ---
function setupEventListeners() {
  // Search
  menuSearch.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderMenu();
  });

  // Category Tabs
  categoryTabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-tab')) {
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      state.activeCategory = e.target.dataset.cat;
      renderMenu();
    }
  });

  // Dietary Filters
  dietaryFilters.addEventListener('click', (e) => {
    if (e.target.classList.contains('diet-tag')) {
      document.querySelectorAll('.diet-tag').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      state.activeDiet = e.target.dataset.diet;
      renderMenu();
    }
  });

  // Delegated Menu Grid Clicks (Favs, Add, Customize)
  menuGrid.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.fav-btn');
    if (favBtn) {
      const id = favBtn.dataset.id;
      if (state.favorites.has(id)) {
        state.favorites.delete(id);
        showToast('Removed from favorites');
      } else {
        state.favorites.add(id);
        showToast('Saved to your favorites!', 'success');
      }
      localStorage.setItem('aura_favs', JSON.stringify(Array.from(state.favorites)));
      renderMenu();
      return;
    }

    const quickAddBtn = e.target.closest('.quick-add-btn');
    if (quickAddBtn) {
      const id = quickAddBtn.dataset.id;
      const item = MENU_DATA.find(i => i.id === id);
      if (item) addToCart(item);
      return;
    }

    const customBtn = e.target.closest('.customize-btn');
    if (customBtn) {
      const id = customBtn.dataset.id;
      openCustomizationModal(id);
      return;
    }
  });

  // Cart Drawer open/close
  cartDrawerBtn.addEventListener('click', () => cartDrawerOverlay.classList.add('active'));
  closeCartBtn.addEventListener('click', () => cartDrawerOverlay.classList.remove('active'));
  cartDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === cartDrawerOverlay) cartDrawerOverlay.classList.remove('active');
  });

  // Modal Closes
  closeCustomBtn.addEventListener('click', () => customModal.classList.remove('active'));
  closeCheckoutBtn.addEventListener('click', () => checkoutModal.classList.remove('active'));
  closeResModalBtn.addEventListener('click', () => resModal.classList.remove('active'));
  closeQuizBtn.addEventListener('click', () => quizModal.classList.remove('active'));

  // Checkout button
  checkoutBtn.addEventListener('click', openCheckoutModal);

  // Promo Code
  applyPromoBtn.addEventListener('click', () => {
    const code = promoInput.value.trim().toUpperCase();
    if (code === 'WELCOME10') {
      state.appliedPromo = 0.10;
      showToast('10% Welcome Discount Applied!', 'success');
      updateCartUI();
    } else if (code === 'AURA20') {
      state.appliedPromo = 0.20;
      showToast('20% VIP Discount Applied!', 'success');
      updateCartUI();
    } else {
      showToast('Invalid promo code. Try WELCOME10', 'error');
    }
  });

  // Reservation Form Submit
  resForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('res-name').value;
    const guests = document.getElementById('res-guests').value;
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;
    const zone = document.getElementById('res-zone').value;

    const ref = `#AURA-RES-${Math.floor(1000 + Math.random() * 9000)}`;

    resModalBody.innerHTML = `
      <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--color-primary-glow); color: var(--color-primary); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 16px auto;">
        <i class="fa-solid fa-calendar-check"></i>
      </div>
      <h2 class="font-serif">Reservation Confirmed!</h2>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">Reference: <strong style="color: var(--color-primary);">${ref}</strong></p>

      <div style="margin: 24px 0; padding: 20px; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-light); text-align: left;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="color: var(--text-muted);">Guest Name:</span>
          <strong>${name}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="color: var(--text-muted);">Party Size:</span>
          <strong>${guests} Guest(s)</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="color: var(--text-muted);">Date & Time:</span>
          <strong>${date} at ${time}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">Seating Area:</span>
          <strong style="color: var(--color-primary);">${zone}</strong>
        </div>
      </div>

      <p style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 20px;">We'll hold your table for 15 minutes past your time slot.</p>
      <button class="btn btn-primary" onclick="document.getElementById('reservation-modal').classList.remove('active')">Great, See You Soon!</button>
    `;

    resModal.classList.add('active');
    resForm.reset();
  });

  // Brew Quiz Modal Trigger
  openQuizBtn.addEventListener('click', openBrewQuiz);

  // Copy Wifi
  copyWifiBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('AuraBrew2026');
    showToast('Wi-Fi Password copied to clipboard!', 'success');
  });

  // Navbar Scroll background
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      document.getElementById('navbar').classList.add('scrolled');
    } else {
      document.getElementById('navbar').classList.remove('scrolled');
    }
  });
}

// --- 10. BREW FINDER QUIZ WIZARD ---
function openBrewQuiz() {
  quizModalBody.innerHTML = `
    <h2 class="font-serif" style="margin-bottom: 8px;"><i class="fa-solid fa-compass" style="color: var(--color-primary);"></i> Brew Finder Quiz</h2>
    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">Question 1 of 2: What temperature do you prefer?</p>

    <div style="display: flex; flex-direction: column; gap: 12px;">
      <button class="btn btn-secondary quiz-opt-btn" onclick="nextQuizStep('iced')" style="justify-content: flex-start;">
        <i class="fa-solid fa-snowflake" style="color: #3498db;"></i> Chilled & Refreshing Cold Brews
      </button>
      <button class="btn btn-secondary quiz-opt-btn" onclick="nextQuizStep('hot')" style="justify-content: flex-start;">
        <i class="fa-solid fa-fire" style="color: var(--color-primary);"></i> Steaming Hot Artisanal Espresso
      </button>
    </div>
  `;
  quizModal.classList.add('active');
}

window.nextQuizStep = function(tempPref) {
  quizModalBody.innerHTML = `
    <h2 class="font-serif" style="margin-bottom: 8px;"><i class="fa-solid fa-compass" style="color: var(--color-primary);"></i> Brew Finder Quiz</h2>
    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">Question 2 of 2: How do you like your flavor profile?</p>

    <div style="display: flex; flex-direction: column; gap: 12px;">
      <button class="btn btn-secondary" onclick="finishQuiz('${tempPref}', 'sweet')" style="justify-content: flex-start;">
        <i class="fa-solid fa-cookie" style="color: #e67e22;"></i> Smooth, Creamy & Sweet
      </button>
      <button class="btn btn-secondary" onclick="finishQuiz('${tempPref}', 'bold')" style="justify-content: flex-start;">
        <i class="fa-solid fa-mug-hot" style="color: var(--color-primary);"></i> Bold, Rich & High Caffeine
      </button>
    </div>
  `;
};

window.finishQuiz = function(temp, flavor) {
  let recItem;
  if (temp === 'iced' && flavor === 'sweet') {
    recItem = MENU_DATA.find(i => i.id === 'item-10'); // Dark Chocolate Mocha Frappe
  } else if (temp === 'iced' && flavor === 'bold') {
    recItem = MENU_DATA.find(i => i.id === 'item-2');  // Nitro Cold Brew
  } else if (temp === 'hot' && flavor === 'sweet') {
    recItem = MENU_DATA.find(i => i.id === 'item-6');  // Spanish Latte
  } else {
    recItem = MENU_DATA.find(i => i.id === 'item-1');  // Velvet Latte
  }

  quizModalBody.innerHTML = `
    <div style="text-align: center; padding: 10px 0;">
      <div style="color: var(--color-primary); font-size: 2rem; margin-bottom: 12px;"><i class="fa-solid fa-sparkles"></i></div>
      <h2 class="font-serif">Your Perfect Match!</h2>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">Based on your preferences, we recommend:</p>

      <div style="background: var(--bg-card); padding: 20px; border-radius: 16px; border: 1px solid var(--color-primary-glow); margin-bottom: 24px; text-align: left; display: flex; gap: 16px; align-items: center;">
        <img src="${recItem.image}" style="width: 80px; height: 80px; border-radius: 12px; object-fit: cover;">
        <div>
          <h4 class="font-serif" style="font-size: 1.2rem;">${recItem.name}</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${recItem.description}</p>
          <div style="font-weight: 700; color: var(--color-primary); margin-top: 6px;">$${recItem.price.toFixed(2)}</div>
        </div>
      </div>

      <button class="btn btn-primary" onclick="addToCartFromQuiz('${recItem.id}')" style="width: 100%;">
        <i class="fa-solid fa-plus"></i> Add Recommended Item to Order
      </button>
    </div>
  `;
};

window.addToCartFromQuiz = function(itemId) {
  const item = MENU_DATA.find(i => i.id === itemId);
  if (item) addToCart(item);
  quizModal.classList.remove('active');
};

// --- 11. UTILITY FUNCTIONS ---
function updateLiveStatus() {
  const now = new Date();
  const hour = now.getHours();
  const statusText = document.getElementById('status-text');

  if (hour >= 7 && hour < 21) {
    statusText.textContent = "Open Now • Closes at 9 PM";
  } else {
    statusText.textContent = "Closed Now • Opens at 7 AM";
  }
}

function setDefaultDate() {
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let icon = '<i class="fa-solid fa-circle-info" style="color: var(--color-primary);"></i>';
  if (type === 'success') icon = '<i class="fa-solid fa-circle-check" style="color: #2ecc71;"></i>';
  if (type === 'error') icon = '<i class="fa-solid fa-circle-xmark" style="color: #e74c3c;"></i>';

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
