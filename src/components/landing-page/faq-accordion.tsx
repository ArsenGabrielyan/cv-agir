import { FAQ_DATA } from "@/data/constants/landing-page";
import {
     Accordion,
     AccordionContent,
     AccordionItem,
     AccordionTrigger,
} from "@/components/ui/accordion"

export default function AccordionFAQ(){
     return (
          <Accordion type="single" collapsible className="w-full max-w-7xl bg-background text-left p-2 pb-12">
               {FAQ_DATA.map(({id,question,answer})=>(
                    <AccordionItem key={id} value={`question-${id}`}>
                         <AccordionTrigger>{question}</AccordionTrigger>
                         <AccordionContent>{answer}</AccordionContent>
                    </AccordionItem>
               ))}
          </Accordion>
     )
}