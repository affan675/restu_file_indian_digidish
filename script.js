// --- Menu Data (Still useful for cart, even if not rendering HTML directly) ---
// Prices are in INR (Indian Rupees)
const menuItems = [
    { id: 1, name: "Misal Pav", price: 119.00 },
    { id: 2, name: "Vada Pav", price: 59.00 },
    { id: 3, name: "Chicken Biryani", price: 209.00 },
    { id: 4, name: "Pav Bhaji", price: 179.00 },
    { id: 5, name: "Chiken Kathi Roll", price: 179.00 },
    { id: 6, name: "Samosa (10 pcs)", price: 79.00 },
    { id: 7, name: "Pani Puri", price: 49.00 },
    { id: 8, name: "Tandoori Chicken (full)", price: 269.00 },
    { id: 9, name: "Butter Chicken and Naan", price: 389.00 },
    { id: 10, name: "Momos (Non-Veg)", price: 119.00 },
    { id: 11, name: "French Fries", price: 119.00 },
    { id: 12, name: "Burger", price: 149.00 },
    { id: 13, name: "Pasta", price: 179.00 },
    { id: 14, name: "Pizza", price: 199.00 },
    { id: 15, name: "Milkshake", price: 119.00 },
    { id: 16, name: "Masala Chai", price: 15.00 },
    { id: 17, name: "Cold Coffee", price: 49.00 },
    { id: 18, name: "Cappuccino", price: 119.00 }
]

// --- Global Variables for Cart and DOM Elements ---
let cart = []; // Stores items currently in the cart

const menuContainer = document.getElementById('menu-items-container');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');

// --- Functions ---

// Since HTML elements are now directly in index.html, we just need to attach event listeners
/**
 * Attaches event listeners to all "Add to Cart" buttons on the menu.
 */
function setupMenuListeners() {
    document.querySelectorAll('.menu-item button').forEach(button => {
        button.addEventListener('click', (event) => {
            // Get the ID from the parent .menu-item's data-id attribute
            const itemId = parseInt(event.target.closest('.menu-item').dataset.id);
            addItemToCart(itemId);
        });
    });
}

/**
 * Adds an item to the cart or increments its quantity if already present.
 * @param {number} itemId - The ID of the item to add.
 */
function addItemToCart(itemId) {
    const itemToAdd = menuItems.find(item => item.id === itemId);
    if (!itemToAdd) {
        console.error("Item not found:", itemId);
        return;
    }

    const existingCartItem = cart.find(cartItem => cartItem.id === itemId);

    if (existingCartItem) {
        existingCartItem.quantity++;
    } else {
        // Create a new cart item by spreading properties from menuItems and adding quantity
        cart.push({ ...itemToAdd, quantity: 1 });
    }
    renderCart();
}

/**
 * Removes an item from the cart or decrements its quantity.
 * @param {number} itemId - The ID of the item to remove.
 */
function removeItemFromCart(itemId) {
    const existingCartItemIndex = cart.findIndex(cartItem => cartItem.id === itemId);

    if (existingCartItemIndex > -1) {
        if (cart[existingCartItemIndex].quantity > 1) {
            cart[existingCartItemIndex].quantity--;
        } else {
            // Remove item entirely if quantity is 1
            cart.splice(existingCartItemIndex, 1);
        }
    }
    renderCart();
}

/**
 * Renders the current state of the cart.
 */
function renderCart() {
    cartItemsContainer.innerHTML = ''; // Clear existing cart content
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        checkoutButton.disabled = true; // Disable checkout if cart is empty
    } else {
        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            const itemTotalPrice = item.price * item.quantity;
            total += itemTotalPrice;

            cartItemDiv.innerHTML = `
                <div class="item-details">
                    <p>${item.name} (₹${item.price.toFixed(2)})</p>
                </div>
                <div class="item-quantity">
                    <button class="remove-from-cart" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="add-more-to-cart" data-id="${item.id}">+</button>
                </div>
                <div class="item-price">
                    ₹${itemTotalPrice.toFixed(2)}
                </div>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });
        checkoutButton.disabled = false; // Enable checkout if cart has items
    }

    cartTotalSpan.textContent = total.toFixed(2);

    // Add event listeners for quantity adjustment buttons in the cart
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const itemId = parseInt(event.target.dataset.id);
            removeItemFromCart(itemId);
        });
    });

    document.querySelectorAll('.add-more-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const itemId = parseInt(event.target.dataset.id);
            addItemToCart(itemId);
        });
    });
}

/**
 * Handles the checkout process (for now, just an alert).
 */
function handleCheckout() {
    if (cart.length > 0) {
        alert(`Order placed successfully! Total: ₹${cartTotalSpan.textContent}\nThank you for your purchase from DigiDish! Product will come soon.`);
        // In a real application, this would send the order to the backend
        cart = []; // Clear cart after "checkout"
        renderCart(); // Re-render to show empty cart
    } else {
        alert("Your cart is empty. Please add items before checking out.");
    }
}

// --- Event Listeners and Initial Renders ---
document.addEventListener('DOMContentLoaded', () => {
    setupMenuListeners(); // Attach listeners to the HTML menu items
    renderCart();      // Display the empty cart initially
    renderReviews();   // Display initial reviews
});

checkoutButton.addEventListener('click', handleCheckout);


// --- Review System ---
const reviewForm = document.getElementById('review-form');
const reviewsContainer = document.getElementById('reviews-container');

// Sample reviews (will be loaded from a backend later)
let reviews = [
    { name: "Priya S.", text: "The French Fries was divine! So rich and flavorful. Definitely coming back for more.", rating: 4, date: "2025-05-28" },
    { name: "Affan A.", text: "Authentic Pani Puri. Loved the spices and texture. Great experience overall.", rating: 5, date: "2025-05-29" },
    { name: "Anjali M.", text: "The Chicken Biryani hit the spot. A huge portion and incredibly aromatic. Highly recommend!", rating: 5, date: "2025-05-30" },
   
];

function renderReviews() {
    reviewsContainer.innerHTML = '';
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to leave one!</p>';
    } else {
        reviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.classList.add('review-item');
            reviewDiv.innerHTML = `
                <div class="reviewer-info">${review.name} <span class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span></div>
                <p>"${review.text}"</p>
                <small>Reviewed on: ${review.date}</small>
            `;
            reviewsContainer.appendChild(reviewDiv);
        });
    }
}

reviewForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const reviewerName = document.getElementById('reviewer-name').value;
    const reviewText = document.getElementById('review-text').value;
    const rating = parseInt(document.getElementById('rating').value);
    const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

    if (reviewerName && reviewText && rating) {
        const newReview = {
            name: reviewerName,
            text: reviewText,
            rating: rating,
            date: currentDate
        };

        reviews.unshift(newReview); // Add to the beginning of the array so new reviews appear first
        renderReviews(); // Re-render reviews to show the new one

        // Clear the form
        reviewForm.reset();
        alert("Thank you for your review! It has been submitted.");
    } else {
        alert("Please fill in all review fields.");
    }
});