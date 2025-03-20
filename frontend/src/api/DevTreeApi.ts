import { isAxiosError } from "axios";
import API from "../config/axios";
import { ProfileForm, User } from "../types";



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


export async function updateProfile(formData: ProfileForm){
  try {
      const {data}= await API.patch<string>('/user', formData)
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
          throw new Error(error.response.data.error)

      }
    }
}