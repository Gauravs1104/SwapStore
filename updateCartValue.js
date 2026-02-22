const cartValue = document.querySelector("#cartValue");

export const updateCartValue = (cartProduct) => {
    return (cartValue.innerHTML = `<i class="fa-solid fa-cart-shopping"> ${cartProduct.length} </i>` );
};