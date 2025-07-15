import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/check-auth");
            console.log("response:", res);
            
            set({ authUser: res.data})
        } catch (error) {
          console.log("Error in check auth", error);
          set({ authUser: null})  
        } finally {
            set({ isCheckingAuth: false})
        }
    },

    login: async(data)=> {
        try {
            const res = await axiosInstance.get("/auth/login")
        } catch (error) {
        toast.error(error.response.data.message);    
        }
    }
}))