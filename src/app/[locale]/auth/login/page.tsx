import LoginForm from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Մուտք"
}

export default function LoginPage(){
     return (
          <LoginForm/>
     )
}