import { cerateProduct,getAllProducts } from "../services/product.api";
import { useDispatch } from "react-redux";


export const useProduct = () => {

    const dispatch = useDispatch();

    const handleCreateProduct = async (formData) =>{

        const data = await cerateProduct(formData);
        return data.product;

    }

    const handleGetAllProducts = async () =>{

        const data = await getAllProducts();
        dispatch(setSellerProducts(data.products));

        return data.products;

    }

    return{
        handleCreateProduct,
        handleGetAllProducts
    }
}