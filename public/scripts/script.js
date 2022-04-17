//mobile nav display
const toggleButton = document.getElementsByClassName('toggle-button')[0];
const mobileMenu = document.getElementsByClassName('mobile-menu')[0];

toggleButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

//cart display
const showUserCart = document.getElementById('show-cart');
const userCart = document.getElementById('user-cart');

if(showUserCart) {
    showUserCart.addEventListener('click', () => {
        userCart.style.display = 'block';
    });
}

//close user cart
const closeCart = document.getElementsByClassName("close-cart")[0];
if(closeCart) {
    closeCart.onclick = function () {
        userCart.style.display = "none";
    }
}

//expand dropdowns on mobile view
const dropdownLists = document.querySelectorAll('li.dropdown');
const dropdownContentDivs = document.querySelectorAll('div.dropdown-content');

for (let index = 0; index < dropdownLists.length; index++) {
    dropdownLists[index].addEventListener('click', () => {
        dropdownContentDivs[index].classList.toggle('active');
        console.log(dropdownContentDivs[index])
    })    
}

//add to cart functionality
const INITIAL_QUANTITY_VALUE = 1;
let quantityValue = INITIAL_QUANTITY_VALUE;
const btnAdd = document.getElementsByClassName('plus');
const btnSubtract = document.getElementsByClassName('minus');
const addToCartButton = document.querySelectorAll('button.event');
const cartModals = document.querySelectorAll('form.cart-modal');
for (let index = 0; index < cartModals.length; index++) {
    addToCartButton[index].addEventListener('click', function () {
        const inputQuantity = document.querySelectorAll("input[name='quantity'");
        inputQuantity[index].value = quantityValue;
        btnAdd[index].addEventListener('click', (event) => {
            event.preventDefault();
            inputQuantity[index].value = quantityValue++;
        })
        btnSubtract[index].addEventListener('click', (event) => {
            event.preventDefault();
            inputQuantity[index].value = quantityValue--;
            if (quantityValue === 0 || quantityValue < 0) {
                alert('smaller than zero');
                inputQuantity[index].value = INITIAL_QUANTITY_VALUE;
            }
        })

        const span = document.getElementsByClassName("close")[index];
        cartModals[index].style.display = "block";

        span.onclick = function () {
            cartModals[index].style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == cartModals[index]) {
                cartModals[index].style.display = "none";
            }
        }
    })

}
