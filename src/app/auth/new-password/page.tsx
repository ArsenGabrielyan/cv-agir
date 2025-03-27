import NewPasswordForm from "@/components/auth/new-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Ստեղծել նոր գաղտնաբառ | CV-ագիր"
}

export default function NewPasswordPage(){
     return (
          <NewPasswordForm />
     )
}