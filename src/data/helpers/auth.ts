import { currentUser } from "@/lib/auth";
import { ReadonlyURLSearchParams } from "next/navigation";

const adminIds = [
     "67b47e586ab583428524d25d"
]
export const getIsAdmin = async()=>{
     const user = await currentUser();
     if(!user || !user.id){
          return false;
     }
     return adminIds.indexOf(user.id) !== -1;
}

export function getOAuthNotLinkedError(searchParams: ReadonlyURLSearchParams){
     const error = searchParams.get("error");
     if(error){
          return error.includes("OAuthAccountNotLinked") ? "Այս էլ․ փոստով արդեն կա հաշիվ, բայց այլ մուտքի մեթոդով։" : ""
     }
     return ""
}