// Fetch product data from JSON file
const response = await fetch('./data.json');
const data = await response.json();

// Initialize empty cart array
const cart = []

// Initial render
renderPageGrid(data);
renderCart(cart)
attachAddToCartListeners();

// Attaches click handlers to all "Add to Cart" buttons
function attachAddToCartListeners() {
    const addToCartButtons = document.querySelectorAll(".js-add-but");
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            let existingproduct = false;

            // Check if product already exists in cart
            cart.forEach(pro => {
                if (button.dataset.name === pro.name) {
                    pro.quantity++;
                    existingproduct = true;
                }
            });

            // Add new product to cart if it doesn't exist
            if (!existingproduct) {
                const product = {
                    name: button.dataset.name,
                    quantity: 1,
                    price: parseFloat(button.dataset.price),
                    image: button.dataset.image
                };
                cart.push(product);
            }

            // Re-render UI and reattach all listeners
            updateUI()
        });
    });
}

// Handles quantity increment actions
function attachIncrementListeners() {
    const incrementButtons = document.querySelectorAll('.js-increment-button')
    incrementButtons.forEach(button => {
        button.addEventListener('click', () => {
            cart.forEach(pro => {
                if (button.dataset.name === pro.name) {
                    pro.quantity++;
                }
            });

            // Re-render UI and reattach all listeners
            updateUI()
        });
    });
}

// Handles quantity decrement actions
function attachDecrementListeners() {
    const decrementButtons = document.querySelectorAll('.js-decrement-button')
    decrementButtons.forEach(button => {
        button.addEventListener('click', () => {
            cart.forEach(pro => {
                if (button.dataset.name === pro.name && pro.quantity ===1) {
                    const filtered = cart.filter(item => item.name !== button.dataset.name);
                    cart.length = 0;
                    cart.push(...filtered);
                } else if (button.dataset.name === pro.name){
                    pro.quantity--;                    
                }
            });

            // Re-render UI and reattach all listeners
            updateUI()
        });
    });
}

// Handles product removal from cart
function attachRemoveListeners() {
    const removeButtons = document.querySelectorAll('.js-remove-button')
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            cart.forEach(pro => {
                if (button.dataset.name === pro.name) {
                    const filtered = cart.filter(item => item.name !== button.dataset.name);
                    cart.length = 0;
                    cart.push(...filtered);
                }
            });

            // Re-render UI and reattach all listeners
            updateUI()
        });
    });
}

// Renders the main product grid
function renderPageGrid(mydata) {
    let pageHTML = "";
    mydata.forEach(element => {
        // Check if product is already in cart
        let addedToCart = false;
        cart.forEach(pro => {
            if (pro.name === element.name) {
                addedToCart = true;
            }
        });

        pageHTML += `
            <div class="main-con">
                <div class="just-position"> 
                    <picture>
                        <source media="(max-width: 800px)" srcset="${element.image.mobile}">
                        <source media="(min-width: 801px)" srcset="${element.image.desktop}">
                        <img src="${element.image.desktop}" class="image-des ${addedToCart? "border-red" : ""}" alt="">
                    </picture>
                    ${addedToCart ?
                        `<div class='added-div'>
                            <button class="edit-icon js-decrement-button" data-name="${element.name}">
                                <img src="assets/images/icon-decrement-quantity.svg" alt="">
                            </button>
                            <p>${getQuantity(element)}</p>
                            <button class="edit-icon js-increment-button" data-name="${element.name}">
                                <img src="assets/images/icon-increment-quantity.svg" alt="">
                            </button>
                        </div>` :
                        `<button class='add-but js-add-but' data-name="${element.name}" data-price="${element.price}" data-image="${element.image.desktop}">
                            <img src="assets/images/icon-add-to-cart.svg" alt="">
                            <p>Add to Cart</p>
                        </button>`
                    }
                </div>
                <p class="cate-para">${element.category}</p>
                <p class="name-para">${element.name}</p>
                <p class="price-para">$${(element.price).toFixed(2)}</p>
            </div>`;
    });

    document.querySelector(".js-main-grid").innerHTML = pageHTML;
}

// Renders the shopping cart
function renderCart (cart) {
    let pageHTML = "";
    if (cart.length === 0) {
        pageHTML +=`<p class="cart-headline">
                        Your Cart (0)
                    </p>
                    <img src="assets/images/illustration-empty-cart.svg" alt="">
                    <p class="confirm-para">
                        Your added items will appear here
                    </p>`
    } else {
        const totalItems = calculateTotalItems(cart)
        const totalPrice = calculateTotalPrice(cart)
        pageHTML +=`<p class="cart-headline">
                            Your Cart (${totalItems})
                    </p>`;
        cart.forEach(element => {
            pageHTML += `  <div class="product-div">
                                <div class="right-con">
                                    <p class="pro-name">
                                        ${element.name}
                                    </p>
                                    <div class="stats-div">
                                        <p class="quantity-para">${element.quantity}x</p>
                                        <p class="price-cart-para">@ $${(element.price).toFixed(2)}</p>
                                        <p class="total-para">$${(element.price*element.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                                <button class="remove-but js-remove-button" data-name="${element.name}">
                                    <img src="assets/images/icon-remove-item.svg" class="remove-icon" alt="">
                                </button>
                            </div>`;
        })
        pageHTML += `<div class="total-wuan-div">
                        <p class="order-total-para">Order Total</p>
                        <p class="totla-price-para">$${(totalPrice).toFixed(2)}</p>
                    </div>
                    <div class="carbon-div">
                        <img src="assets/images/icon-carbon-neutral.svg" alt="">
                        <p class="carbon-para">This is a <b>carbon-neutral</b> delivery</p>
                    </div>
                    <button class="confirm-but js-confirm-button">
                        Confirm Order
                    </button>`
    };
    document.querySelector(".js-cart-div").innerHTML = pageHTML;
}

function attachConfirmListener() {
    const totalPrice = calculateTotalPrice(cart)
    document.querySelector(".js-confirm-button").addEventListener ("click", ()=> {
        let pageHTML = `
        <div class="overlay"></div>
        <div class="confirm-div">
            <img src="assets/images/icon-order-confirmed.svg" class="confirm-icon" alt="">
            <p class="oredr-confirmed-para">
                Order Confirmed
            </p>
            <p class="we-para">
                We hope you enjoy your food!
                </p>
                <div class="border-div">
        `;
        cart.forEach(product => {
            pageHTML +=
            `
              <div class="product-div-1">
                <div class="right-con-1">
                  <img src=${product.image} class="pro-img" alt="">
                  <div>
                    <p class="pro-name-1">
                        ${product.name}
                    </p>
                    <div  class="name-quan-div">
                      <p class="quantity-para-1">${product.quantity}x</p>
                      <p class="price-cart-para-1">@ $${(product.price).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <p class="total-para-1">$${(product.price*product.quantity).toFixed(2)}</p>
              </div>
            `
        })
        pageHTML +=
        `
          <div class="total-div">
            <p class="order-total">
              Order Total
            </p>
            <p class="total-due">
              $${(totalPrice).toFixed(2)}
            </p>
          </div>
        </div>
        <button class="start-but js-start-but">
          Start new order
        </button>
      </div>`
      document.body.classList.add('no-scroll');
      document.querySelector(".js-checkout-div").innerHTML = pageHTML
      attachStartListener();
    })
}

function attachStartListener() {
    document.querySelector(".js-start-but").addEventListener("click" , () => {
        cart.length = 0;
        document.querySelector(".js-checkout-div").innerHTML = ""
        document.body.classList.remove('no-scroll');
        renderPageGrid(data)
        renderCart(cart)
        attachAddToCartListeners();        
    })
    
}

// Helper function to update all UI elements
function updateUI() {
    renderPageGrid(data);
    renderCart(cart);
    attachAddToCartListeners();
    attachIncrementListeners();
    attachDecrementListeners();
    attachRemoveListeners();
    attachConfirmListener();
}

// Calculates total number of items in cart
function calculateTotalItems (cart) {
    let totalItems = 0
    cart.forEach(element => {
         totalItems+=element.quantity;
    });
    return totalItems
}

// Calculates total price of items in cart
function calculateTotalPrice (cart) {
    let totalPrice = 0
    cart.forEach(element => {
         totalPrice+=element.quantity*element.price;
    });
    return totalPrice
}

// Gets quantity of specific product in cart
function getQuantity(element) {
    const foundProduct = cart.find(product => product.name === element.name);
    return foundProduct ? foundProduct.quantity : 0;
}