"use server";
import bcrypt from "bcryptjs"
import { db } from "@/lib/db";
import { getUserByEmail, getUserById } from "@/data/db/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { AccountSettingsType, ResumeSettingsType } from "@/schemas/types";

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

     if(values.email && values.email!==user.email){
          const existingUser = await getUserByEmail(values.email);
          if(existingUser && existingUser.id!==user.id){
               return {error: "Էլ․ հասցեն արդեն օգտագործված է"}
          }
          const verificationToken = await generateVerificationToken(values.email);

          await sendVerificationEmail(
               values.name ? values.name : user.name || "",
               verificationToken.email,
               verificationToken.token
          )

          values.email = verificationToken.email;
          await db.user.update({
               where: {
                    id: user.id
               },
               data: {
                    ...values
               }
          })
          return {success: "Հաստատեք Ձեր էլ․ հասցեն"}
     }

     if(values.password && values.newPassword && dbUser.password){
          const passwordsMatch = bcrypt.compare(
               values.password,
               dbUser.password
          )
          if(!passwordsMatch){
               return {error: "Գաղտնաբառը սխալ է"}
          }
          const hashedPassword = await bcrypt.hash(values.newPassword,10);

          values.password = hashedPassword;
          values.newPassword = undefined
     }

     await db.user.update({
          where: {
               id: dbUser.id
          },
          data: {
               ...values
          }
     })
     return {success: "Կարգավորումները թարմացված են"}
}

export const applyResumeDefaultsSettings = async(values: ResumeSettingsType) => {
     const user = await currentUser();
     if(!user || !user.id){
          return {error: "Մուտք գործեք հաշվին"}
     }
     const dbUser = await getUserById(user.id);
     if(!dbUser){
          return {error: "Մուտք գործեք հաշվին"}
     }

     await db.user.update({
          where: {
               id: dbUser.id
          },
          data: {
               ...values
          }
     })
     return {success: "Կարգավորումները թարմացված են"}
}