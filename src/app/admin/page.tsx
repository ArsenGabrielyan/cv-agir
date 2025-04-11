import AdminPageWrapper from "@/components/admin-components/admin-wrapper";
import { getIsAdmin } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
     title: "Ադմինիստրատորի վահանակ"
}

export default async function AdminPage(){
     const isAdmin = await getIsAdmin();
     if(!isAdmin){
          redirect("/");
     }
     return (
          <AdminPageWrapper/>
     )
}