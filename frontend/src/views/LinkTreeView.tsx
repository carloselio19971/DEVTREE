import { useEffect, useState } from "react"
import { social } from "../data/social"
import { DevTreeInput } from "../components/DevTreeInput";
import { isValidUrl } from "../utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/DevTreeApi";
import { SocialNetwork, User } from "../types";


export const LinkTreeView = () => {

  const [devTreeLinks, setdevTreeLinks] = useState(social);

  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData(['user'])!

  const {mutate} = useMutation({
      mutationFn:updateProfile,
      onError:(error)=>{
         toast.error(error.message);
      },
      onSuccess:()=>{
        toast.success("Actualizado Correctamente");
      }
  })

  useEffect(()=>{
    const updatedData= devTreeLinks.map(item => {
        const userlink=JSON.parse(user.links).find((link:SocialNetwork) => link.name=== item.name)
        if(userlink){
          return {
            ...item, url:userlink.url, enabled: userlink.enabled
          }
        }
        return item
    })
        setdevTreeLinks(updatedData);
  },[]);

  const handleUrlChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const updatedLinks = devTreeLinks.map(link=>link.name === e.target.name ?
    {...link, url:e.target.value}  : link)
    setdevTreeLinks(updatedLinks);

    queryClient.setQueryData(['user'],(prevData:User)=>{
      return {
        ...prevData,
        links:JSON.stringify(updatedLinks)
      }
  })

  }
  
  const handleEnableLink = (socialNetwork:string) => {
    const updatedLink=devTreeLinks.map(link =>
      {
        if(link.name===socialNetwork){
          if(isValidUrl(link.url)){
            return {...link, enabled:!link.enabled}
          }
          else {
            toast.error('URL No valida');
          }
        } 
          console.log("Link",link);
          return link;
      } 

    )
      setdevTreeLinks(updatedLink);

      queryClient.setQueryData(['user'],(prevData:User)=>{
          return {
            ...prevData,
            links:JSON.stringify(updatedLink)
          }
      })
  }

  return (
    <div className="space-y-5">
        {devTreeLinks.map(item=>(
            <DevTreeInput
                        key={item.name}
                        item={item}
                        handleUrlChange={handleUrlChange}
                        handleEnableLink={handleEnableLink}
            
            />
        ))}
        <button
          className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded font-bold"
          onClick={()=> mutate(user)}
        >Guardar Cambios</button>


    </div>
  )
}
