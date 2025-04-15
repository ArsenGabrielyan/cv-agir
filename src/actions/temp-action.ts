"use server"
import {sendMessage,sendPasswordResetEmail,sendTwoFactorEmail,sendVerificationEmail} from "@/lib/mail"
// This is temporary and will be deleted

export const sendTestMessage = async(type: "contact" | "verification" | "new-pass" | "two-factor") => {
     try{
          switch(type){
               case "contact":
                    await sendMessage("Արսեն","gabrielyanarsen13@gmail.com","012345678","անուն","նամակ");
                    return {success: "Նամակը ուղարկված է"}
               case "verification":
                    await sendVerificationEmail("Անուն","gabrielyanarsen13@gmail.com","123456");
                    return {success: "Նամակը ուղարկված է"}
               case "new-pass":
                    await sendPasswordResetEmail("Անուն","gabrielyanarsen13@gmail.com","123456");
                    return {success: "Նամակը ուղարկված է"}
               case "two-factor":
                    await sendTwoFactorEmail("Անուն","gabrielyanarsen13@gmail.com","123456");
                    return {success: "Նամակը ուղարկված է"}
               default:
                    return {error: "Նշված նամակ ուղարկելու տիպ չկա"}
          }
     } catch (error){
          console.error(error);
          return {error: "Շաբլոնի մեջ սխալ առաջացավ"}
     }
}