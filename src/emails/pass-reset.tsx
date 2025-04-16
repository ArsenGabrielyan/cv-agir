import EmailTemplate from "@/components/email-template"
import {Button, Heading, Text, Link } from "@react-email/components"

interface PassResetTemplateProps{
     firstName: string,
     resetLink: string,
}
export default function PassResetTemplate({firstName,resetLink}: PassResetTemplateProps){
     return (
          <EmailTemplate title="Գաղտնաբառի վերականգնում">
               <Heading as="h2" className="text-xl font-semibold">Բարև {firstName},</Heading>
               <Text>Դուք խնդրել եք վերականգնել Ձեր գաղտնաբառը։ Խնդրում ենք սեղմել ներքևի կոճակը՝ նոր գաղտնաբառ սահմանելու համար։</Text>
               <Text className="text-center">
                    <Button
                         href={`${resetLink}`}
                         className="inline-block rounded-md text-sm font-medium bg-blue-500 text-white shadow px-4 py-3"
                         style={{
                              textAlign: "center",
                              minWidth: "200px",
                         }}
                    >
                         Վերականգնել գաղտնաբառը
                    </Button>
               </Text>
               <div className="border-solid border-slate-300" style={{borderWidth: "1px 0"}}>
                    <Text className="text-slate-500 my-2 text-center">Կամ պատճենեք այս հղումը և տեղադրեք Ձեր վեբ դիտարկիչում՝ <Link href={`${resetLink}`}>{resetLink}</Link></Text>
               </div>
               <Text className="mb-0">Եթե Դուք չեք խնդրել գաղտնաբառի վերականգնում, կարող եք անտեսել այս նամակը։</Text>
          </EmailTemplate>
     )
}
PassResetTemplate.PreviewProps = {
     firstName: "Արսեն",
     resetLink: "https://example.com",
} as PassResetTemplateProps