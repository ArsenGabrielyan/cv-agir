import EmailTemplate from "@/components/email-template"
import { Heading, Text, Markdown, Hr, Link } from "@react-email/components"

interface MessageTemplateProps{
     name: string,
     email: string,
     phone: string,
     subject: string,
     message: string
}
export default function MessageTemplate({name,email,phone,subject,message}: MessageTemplateProps){
     return (
          <EmailTemplate title="Նոր Հաղորդագրություն">
               <Text className="text-base mb-1">
                    <span className="font-semibold">Անուն:</span> {name}
               </Text>
               <Text className="text-base mb-1">
                    <span className="font-semibold">Էլ․ հասցե:</span>{' '}
                    <Link href={`mailto:${email}`} className="text-blue-600 underline">
                         {email}
                    </Link>
               </Text>
               {phone && (
                    <Text className="text-base mb-1">
                         <span className="font-semibold">Հեռախոսահամար:</span> {phone}
                    </Text>
               )}
               <Text className="text-base mb-4">
                    <span className="font-semibold">Թեմա:</span> {subject}
               </Text>
               <Hr className="border-t border-gray-300 my-4" />
               <Heading as="h2" className="text-lg font-semibold mt-4 mb-2">
                    Հաղորդագրություն:
               </Heading>
               <div className="text-base bg-gray-50 p-4 rounded border border-solid border-slate-300">
                    <Markdown>
                         {message}
                    </Markdown>
               </div>
               <Text className="mt-6 text-sm text-slate-500 italic">
                    Այս հաղորդագրությունն ուղարկվել է CV-ագիր կայքի միջոցով։
               </Text>
          </EmailTemplate>
     )
}
MessageTemplate.PreviewProps = {
     name: "Արսեն Գաբրիելյան",
     email: "arsen@example.com",
     phone: "012345678",
     subject: "Հաղորդագրություն",
     message: "Բարև բոլորին։ Մաղթում ենք բարի օր։"
} as MessageTemplateProps