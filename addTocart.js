import { getcartProductFromLS } from "./getCartProducts";
import { showToast } from "./showToast";
import { updateCartValue } from "./updateCartValue";

// -----------------------------------------------------
// to get the cart data from localStorage
// to update the cart value and also to get the data always ready from localStorage
// --------------------------------------------------------
getcartProductFromLS();

// -----------------------------------------------------
// to add the data into localStorage
// -----------------------------------------------------


export const addTocart = (event, id, stock) => {

    let arrLocalStorageProduct = getcartProductFromLS();

    const currentProdElem = document.querySelector(`#card${id}`);
    let quantity = currentProdElem.querySelector(".productQuantity").innerText;
    let price = currentProdElem.querySelector(".productPrice").innerText;

    price = price.replace("₹", "");

    let existingProd = arrLocalStorageProduct.find(
        (curProd) => curProd.id === id
    );

    if (existingProd && quantity > 1) {
        quantity = Number(existingProd.quantity) + Number(quantity);
        price = Number(price * quantity);

        let updatedCart = { id, quantity, price };

        let updatedcart = arrLocalStorageProduct.map((curProd) => {
            return curProd.id === id ? updatedCart : curProd;
        });

        localStorage.setItem("cartProductLS", JSON.stringify(updatedcart));
        //show toast when product added to the cart
           showToast("add", id);
       // updateCartValue(updatedcart);
       // return;
    }

    if (existingProd) {
        return false;
    }

    price = Number(price * quantity);
    quantity = Number(quantity);

    arrLocalStorageProduct.push({ id, quantity, price });
    localStorage.setItem("cartProductLS", JSON.stringify(arrLocalStorageProduct));

   

    updateCartValue(arrLocalStorageProduct);

     //show toast when product added to the cart
       showToast("add", id);
};
