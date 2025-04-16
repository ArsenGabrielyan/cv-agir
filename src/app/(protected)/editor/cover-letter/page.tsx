import { getSubscriptionLevel } from "@/actions/subscription-system";
import PageLayout from "@/components/layout/page-layout";
import { currentUser } from "@/lib/auth";
import { getAvailableFeatures } from "@/lib/permission";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCoverLetterById } from "@/data/db/cover-letters";
import dynamic from "next/dynamic";
import DocEditorLoader from "@/components/loaders/doc-editor";

export const metadata: Metadata = {
     title: "Գրել ուղեկցող նամակ"
}
const CoverLetterEditor = dynamic(()=>import("./cl-editor"),{
     loading: DocEditorLoader
})
export default async function CoverLetterEditorPage({
     searchParams
}: {
     searchParams: Promise<{ coverLetterId?: string}>
}){
     const {coverLetterId} = await searchParams
     const user = await currentUser();
     if(!user || !user.id){
          redirect("/auth/login")
     }
     const subscriptionLevel = await getSubscriptionLevel(user.id);
     const {canCreateCoverLetters} = getAvailableFeatures(subscriptionLevel);
     if(!canCreateCoverLetters){
          redirect("/pricing");
     }

     const letter = coverLetterId ? await getCoverLetterById(coverLetterId) : null
     return (
          <PageLayout editorPage>
               <CoverLetterEditor letterToEdit={letter}/>
          </PageLayout>
     )
}