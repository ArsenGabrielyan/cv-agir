import EmailTemplate from "@/components/email-template"
import {Heading, Text } from "@react-email/components"

interface TwoFactorTemplateProps{
     firstName: string,
     token: string
}
export default function TwoFactorTemplate({firstName,token}: TwoFactorTemplateProps){
     return (
          <EmailTemplate title="Երկաստիճան վավերացում">
               <Heading as="h2" className="text-xl font-semibold">Բարև {firstName},</Heading>
               <Text>Ձեր հաշվի անվտանգության ապահովելու համար մուտք գործելիս անհրաժեշտ է մուտքագրել այս հաստատման կոդը։</Text>
               <Text
                    className="text-center text-3xl font-bold tracking-widest my-4 text-blue-800 bg-blue-100 rounded-md p-4"
               >
                    {token}
               </Text>
               <div className="border-solid border-slate-300" style={{borderWidth: "1px 0"}}>
                    <Text className="text-slate-500 my-2 text-center">Այս կոդը վավեր է միայն <span className="font-semibold">5 րոպե</span>, խնդրում ենք մուտքագրել այն հնարավորինս արագ:</Text>
               </div>
               <Text className="mb-0">Եթե Դուք չեք խնդրել այս հաստատման կոդը, խնդրում ենք անտեսել այս նամակը:</Text>
          </EmailTemplate>
     )
}
TwoFactorTemplate.PreviewProps = {
     firstName: "Արսեն",
     token: "123456",
} as TwoFactorTemplateProps