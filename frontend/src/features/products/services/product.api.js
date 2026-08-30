import axios from 'axios'

const api = axios.create({
    baseURL: "/api/products",
    withCredentials: true,
})

export const cerateProduct = async(formData) =>{
    const response = await api.post("/",formData);
    return response.data;
}

export const getSellerProducts = async() =>{
    const response = await api.get("/seller");
    return response.data;
}

export const getAllProducts = async() =>{
    const response = await api.get("/");
    return response.data;
}

export const getProductDetails = async(productId) =>{
    const response = await api.get(`/detail/${productId}`);
    return response.data;
}