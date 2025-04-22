"use server";
import bcrypt from "bcryptjs"
import { getUserByEmail, getUserById, updateUser } from "@/data/db/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { AccountSettingsType } from "@/data/types/schema";
import { checkLimiter, getIpAddress, incrementLimiter } from "@/lib/limiter";

export const applyAccountSettings = async(values: AccountSettingsType) => {
     const user = await currentUser();
     if(!user || !user.id){
          return {error: "Մուտք գործեք հաշվին"}
     }
     const dbUser = await getUserById(user.id);
     if(!dbUser){
          return {error: "Մուտք գործեք հաշվին"}
     }

     if(user.isOauth){
          values.email = undefined;
          values.password = undefined;
          values.newPassword = undefined;
          values.isTwoFactorEnabled = undefined;
     }

     const limiterKey = `settings:${user.id || await getIpAddress()}`;
     if(checkLimiter(limiterKey,5)){
          return {error: "Շատ հաճախ եք փորձում։ Խնդրում ենք փորձել ավելի ուշ"}
     }

     if(values.email && values.email!==user.email){
          const existingUser = await getUserByEmail(values.email);
          console.log(values.email,existingUser)
          if(existingUser && existingUser.id!==user.id){
               incrementLimiter(limiterKey,60_000)
               return {error: "Էլ․ հասցեն արդեն օգտագործված է"}
          }
          const verificationToken = await generateVerificationToken(values.email);

          await sendVerificationEmail(
               values.name ? values.name : user.name || "",
               verificationToken.email,
               verificationToken.token
          )
          return await updateUser(user.id,{
               ...values,
               email: verificationToken.email
          },limiterKey,"Հաստատման հղումը ուղարկվել է նոր էլ․ հասցեին։");
     }

     if(values.password && values.newPassword && dbUser.password){
          const passwordsMatch = await bcrypt.compare(
               values.password,
               dbUser.password
          )
          if(!passwordsMatch){
               incrementLimiter(limiterKey,60_000)
               return {error: "Գաղտնաբառը սխալ է"}
          }
          const hashedPassword = await bcrypt.hash(values.newPassword,10);

          values.password = hashedPassword;
          values.newPassword = undefined
     }
     return await updateUser(user.id,values,limiterKey);
}