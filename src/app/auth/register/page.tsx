import RegisterForm from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Ստեղծել հաշիվ | CV-ագիր"
}

export default function RegisterPage(){
     return (
          <RegisterForm/>
     )
}