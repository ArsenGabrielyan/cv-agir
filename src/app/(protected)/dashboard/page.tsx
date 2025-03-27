import PageLayout from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
     title: "Վահանակ"
}

export default function DashboardPage(){
     return (
          <PageLayout sidebarMode>
               <div className="flex justify-between items-center gap-5 my-4">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-3">Վահանակ</h1>
                    <Button asChild>
                         <Link href="/editor"><PlusCircle/> Ստեղծել Ռեզյումե</Link>
                    </Button>
               </div>
          </PageLayout>
     )
}