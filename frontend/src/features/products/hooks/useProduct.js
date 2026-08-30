import { cerateProduct, getSellerProducts, getAllProducts, getProductDetails } from "../services/product.api";
import { useDispatch } from "react-redux";
import { setSellerProducts, setProducts } from "../state/product.slice";


export const useProduct = () => {

    const dispatch = useDispatch();

    const handleCreateProduct = async (formData) => {

        const data = await cerateProduct(formData);

        return data.product;
    }

    const handleGetSellerProducts = async () => {

        const data = await getSellerProducts();
        // console.log(data);
        dispatch(setSellerProducts(data.products));

        return data.products;

    }

    const handleGetAllProducts = async () => {
        const data = await getAllProducts();
        dispatch(setProducts(data.products));
        return data.products;
    }

    const handleGetProductDetails = async (productId) => {
        const data = await getProductDetails(productId);
        return data.product;
    }

    return {
        handleCreateProduct,
        handleGetSellerProducts,
        handleGetAllProducts,
        handleGetProductDetails
    }
}