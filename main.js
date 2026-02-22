import "./style.css";
import "./footer.js";

import products from "./api/products.json";
import { showProductContainer } from "./homeproductCards";

//Define a function named 'ShowProductContainer' that takes an array of products as input.

showProductContainer(products);

