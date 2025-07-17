import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set, get)=> ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    

    getUsers: async ()=>{
        set({ isUsersLoading: true});
        try {
            const res = await axiosInstance.get("/message/sidebar-users")
            set({ users: res.data})
        } catch (error) {
          toast.error(error.response.data.message)  
        } finally {
            set({ isUsersLoading: false})
        }
    },
    getMessages: async (userId)=>{
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/message/${userId}`)
            set({ messages: res?.data})
        } catch (error) {
          toast.error(error.response.data.message)  
        } finally {
            set({ isMessagesLoading: false})
        }
    },
    sendMessage: async (messageData)=>{
     try {
        const { selectedUser, messages } = useChatStore.getState();

        if (!selectedUser?._id) {
          toast.error("No user selected.");
          return;
        }
     
        const res = await axiosInstance.post(`message/send/${selectedUser._id}`, messageData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        set({messages: [...messages, res?.data]})
     } catch (error) {
        console.error("sendMessage error:", error);
       toast.error(error.response.data.message)  
     }
    },
        // todo: optimize this one later

    subscribeToMessages: ()=>{
    const { selectedUser } = get()
    if(!selectedUser) return
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage)=>{
      if(newMessage.senderId !== selectedUser._id) return
      
      set({
        messages: [...get().messages, newMessage]
      })
    })
    },
    unsubscribeFromMessages: ()=>{
    const socket = useAuthStore.getState().socket;

    socket.off("newMessage")
    },
    // todo: optimize this one later
    setSelectedUser: async (selectedUser)=> set({ selectedUser})

}));

