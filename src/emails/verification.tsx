import { Mail } from "lucide-react"
import EmailTemplate from "@/components/email-template"
import {Button, Heading, Text, Link } from "@react-email/components"

interface VerificationTemplateProps{
     firstName: string,
     confirmLink: string,
}

export default function VerificationTemplate({firstName,confirmLink}: VerificationTemplateProps){
     return (
          <EmailTemplate title="Հաստատեք Ձեր էլ․ հասցեն" Icon={Mail}>
               <Heading className="text-xl font-semibold">Բարև {firstName},</Heading>
               <Text>Շնորհակալություն մեր հարթակում գրանցվելու համար։ Ձեր հաշիվը ակտիվացնելու համար, խնդրում ենք հաստատել Ձեր էլ․ փոստի հասցեն՝ սեղմելով ներքևի կոճակը։</Text>
               <Text className="mx-auto">
                    <Button href={`${confirmLink}`} className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium bg-blue-500 text-white shadow p-4" style={{width: "calc(100% - 32px)"}}>Հաստատել էլ․ փոստը</Button>
               </Text>
               <div className="border-solid border-slate-300" style={{borderWidth: "1px 0"}}>
                    <Text className="text-slate-500 my-2">Կամ պատճենեք այս հղումը և տեղադրեք Ձեր վեբ դիտարկիչում՝ <Link href={`${confirmLink}`}>{confirmLink}</Link></Text>
               </div>
               <Text className="mb-0">Եթե Դուք չեք գրանցվել մեր կայքում, ապա կարող եք անտեսել այս նամակը։</Text>
          </EmailTemplate>
     )
}
VerificationTemplate.PreviewProps = {
     firstName: "Արսեն",
     confirmLink: "https://arsentech.github.io",
} as VerificationTemplateProps