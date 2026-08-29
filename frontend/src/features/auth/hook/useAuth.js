import {useDispatch} from 'react-redux'
import { getMe, login, register } from '../service/auth.api'
import { setLoading, setUser } from '../state/auth.slice'

export const useAuth = ()=>{
    const dispatch = useDispatch()

    const handleRegister = async({email,password,contact,fullname, isSeller=false})=>{

        const data = await register({email,password,contact,fullname,isSeller});
        dispatch(setUser(data.user));

        return data.user
    }
    
    const handleLogin = async({email,password})=>{

        try {
            const data = await login({email,password});
            dispatch(setUser(data.user));
            return data.user
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetMe = async ()=>{
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (err) {
            console.log(err)
        } finally {
            dispatch(setLoading(false))
        }
    }

    return{
        handleRegister,handleLogin, handleGetMe
    }
}