import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const BASE_URL = "http://localhost:5000"
export const useAuthStore = create((set, get)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/check-auth");            
            set({ authUser: res.data})
            get().connectSocket()
        } catch (error) {
          console.log("Error in check auth", error);
          set({ authUser: null})  
        } finally {
            set({ isCheckingAuth: false})
        }
    },

    login: async(data)=> {
        try {
            
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data})
            toast.success(`Welcome ${res.data.fullName}`)
            get().connectSocket()
        } catch (error) {
        toast.error(error.response.data.message);    
        }
    },
    signup: async (data)=>{
        try {
           const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data}) 
            toast.success(`Account created successfully`) 
            get().connectSocket()
        } catch (error) {
        toast.error(error.response.data.message);    
        }
    },
    logout: async ()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null});
            toast.success("Logged out successfully")
            get().disConnectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    connectSocket: async ()=>{
      const { authUser } = get()
      if(!authUser || get().socket?.connected()) return
      const socket = io(BASE_URL, {
        query: {userId: authUser?._id}
      })
      socket.connect()
      set({ socket: socket})
      socket.on("getOnlineUsers", (userIds)=>{
        console.log("User Ids", userIds);
       set({ onlineUsers: userIds })
      })
      
    },
    disConnectSocket: async ()=>{
      if(get().socket?.connected) get().socket?.disconnect()
    },
    updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {        
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}))