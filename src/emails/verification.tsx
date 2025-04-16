import EmailTemplate from "@/components/email-template"
import {Button, Heading, Text, Link } from "@react-email/components"

interface VerificationTemplateProps{
     firstName: string,
     confirmLink: string,
}
export default function VerificationTemplate({firstName,confirmLink}: VerificationTemplateProps){
     return (
          <EmailTemplate title="Հաստատեք Ձեր էլ․ հասցեն">
               <Heading as="h2" className="text-xl font-semibold">Բարև {firstName},</Heading>
               <Text>Շնորհակալություն մեր հարթակում գրանցվելու համար։ Ձեր հաշիվը ակտիվացնելու համար, խնդրում ենք հաստատել Ձեր էլ․ փոստի հասցեն՝ սեղմելով ներքևի կոճակը։</Text>
               <Text className="text-center">
                    <Button
                         href={`${confirmLink}`}
                         className="inline-block rounded-md text-sm font-medium bg-blue-500 text-white shadow px-4 py-3"
                         style={{
                              textAlign: "center",
                              minWidth: "200px",
                         }}
                    >
                         Հաստատել էլ․ փոստը
                    </Button>
               </Text>
               <div className="border-solid border-slate-300" style={{borderWidth: "1px 0"}}>
                    <Text className="text-slate-500 my-2 text-center">Կամ պատճենեք այս հղումը և տեղադրեք Ձեր վեբ դիտարկիչում՝ <Link href={`${confirmLink}`}>{confirmLink}</Link></Text>
               </div>
               <Text className="mb-0">Եթե Դուք չեք գրանցվել մեր կայքում, ապա կարող եք անտեսել այս նամակը։</Text>
          </EmailTemplate>
     )
}
VerificationTemplate.PreviewProps = {
     firstName: "Արսեն",
     confirmLink: "https://example.com",
} as VerificationTemplateProps