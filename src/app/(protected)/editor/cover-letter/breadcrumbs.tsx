import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { steps } from "./steps";
import React from "react";

interface BreadcrumbsProps{
     currStep: string;
     setCurrStep: (step: string) => void;
}
export default function Breadcrumbs({currStep,setCurrStep}: BreadcrumbsProps){
     return (
          <div className="flex justify-center items-center">
               <Breadcrumb>
                    <BreadcrumbList>
                         {steps.map(step=>(
                              <React.Fragment key={step.key}>
                                   <BreadcrumbItem>
                                        {step.key===currStep ? (
                                             <BreadcrumbPage>{step.title}</BreadcrumbPage>
                                        ) : (
                                             <BreadcrumbLink asChild>
                                                  <button onClick={()=>setCurrStep(step.key)}>
                                                       {step.title}
                                                  </button>
                                             </BreadcrumbLink>
                                        )}
                                   </BreadcrumbItem>
                                   <BreadcrumbSeparator className="last:hidden"/>
                              </React.Fragment>
                         ))} 
                    </BreadcrumbList>
               </Breadcrumb>
          </div>
     )
}