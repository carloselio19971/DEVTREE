import { isAxiosError } from "axios";
import API from "../config/axios";
import {User } from "../types";



export async function getUser(){
    try {
        const {data}= await API<User>('/user')
        return data;
      } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)

        }
      }
}


export async function updateProfile(formData: User){
  try {
      const {data}= await API.patch<string>('/user', formData)
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
          throw new Error(error.response.data.error)

      }
    }
}

export async function updloadImage(file: File) {
      let formData=new FormData();
      formData.append('file', file)
  try {
     const {data: {image}}:{data:{image:string}} = await API.post('/user/image', formData)
     return image;
    
  } catch (error) {
    
  }
}