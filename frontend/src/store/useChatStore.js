import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useChatStore = create((set)=> ({
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
    setSelectedUser: async (selectedUser)=> set({ selectedUser})

}));

