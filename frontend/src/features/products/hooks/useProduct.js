import { cerateProduct,getAllProducts } from "../services/product.api";
import { useDispatch } from "react-redux";
import { setSellerProducts } from "../state/product.slice";


export const useProduct = () => {

    const dispatch = useDispatch();

    const handleCreateProduct = async (formData) =>{

        const data = await cerateProduct(formData);
        
        return data.product;
    }

    const handleGetSellerProducts = async () =>{

        const data = await getAllProducts();
        // console.log(data);
        dispatch(setSellerProducts(data.products));

        return data.products;

    }

    return{
        handleCreateProduct,
        handleGetSellerProducts
    }
}