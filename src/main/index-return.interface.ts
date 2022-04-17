import { Cart } from "../cart/cart.entity";
import { Category } from "../categories/category.entity";
import { Product } from "../products/product.entity";

export interface IndexReturnInterface {
    title: string;
    products: Product[];
    categories: Category[];
    cart?: Cart;
    user: any;
    error: any;
    success: any;
    order: any;
    serverError: any;
    signoutMessage: any;
    deletedItem: any;
}