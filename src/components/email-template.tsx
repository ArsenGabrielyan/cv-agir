import { LucideProps } from "lucide-react";
import {Body, Font, Head, Heading, Html, Img, Preview, Section, Tailwind, Text} from "@react-email/components"
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { env } from "@/lib/env";

interface TemplateLayoutProps{
     title: string,
     Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
     children: React.ReactNode,
}

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export default function EmailTemplate({title, Icon, children}: TemplateLayoutProps){
     const year = new Date().getFullYear();
     return (
          <Html>
               <Head>
                    <Font
                         fontFamily="Segoe UI"
                         fallbackFontFamily="sans-serif"
                    />
               </Head>
               <Preview>{title}</Preview>
               <Tailwind>
                    <Body className="bg-blue-100">
                         <div className="w-full flex items-center justify-center flex-col gap-4 p-4">
                              <Img
                                   src={`${baseUrl}/static/logo.png`}
                                   alt="logo"
                                   width={200}
                                   height={70}
                              />
                              <Section className="bg-white text-black border shadow rounded-xl p-6 w-full max-w-3xl space-y-4">
                                   <Heading className="scroll-m-20 border-solid border-slate-300 pb-2 text-3xl font-semibold tracking-tight first:mt-0 flex items-center gap-4 m-0" style={{borderWidth: 0, borderBottomWidth: "1px"}}><Icon className="size-8 text-primary"/> {title}</Heading>
                                   {children}
                              </Section>
                              <Text className="m-0 text-center">&copy; {year} CV-ագիր։ Բոլոր իրավունքները պաշտպանված են։</Text>
                         </div>
                    </Body>
               </Tailwind>
          </Html>
     )
}