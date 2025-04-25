"use client"
import { CardWrapper } from "./card-wrapper"
import { GridLoader } from "react-spinners"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { newVerification } from "@/actions/auth/new-verification"
import { FormError } from "@/components/form/form-error"
import { FormSuccess } from "@/components/form/form-success"
import { ERROR_MESSAGES } from "@/data/constants"

export const NewVerificationForm = () => {
     const [error, setError] = useState<string | undefined>("");
     const [success, setSuccess] = useState<string | undefined>("");

     const searchParams = useSearchParams();
     const token = searchParams.get("token");
     
     const onSubmit = useCallback(()=>{
          if(success || error) return;
          if(!token) {
               setError(ERROR_MESSAGES.auth.missingVerificationToken);
               return;
          }
          newVerification(token)
          .then(data=>{
               setSuccess(data.success);
               setError(data.error)
          })
          .catch(()=>setError(ERROR_MESSAGES.unknownError))
     },[token, success, error])

     useEffect(()=>{
          onSubmit()
     },[onSubmit])

     return (
          <CardWrapper
               headerLabel="Հաստատում ենք Ձեր էլ․ փոստը"
               backButtonHref="/auth/login"
               backButtonLabel="Վերադառնալ մուտք"
          >
               <div className="flex items-center justify-center w-full">
                    {!success && !error && (
                         <GridLoader color="hsl(var(--primary))"/>
                    )}
                    <FormSuccess message={success}/>
                    {!success && (
                         <FormError message={error}/>
                    )}
               </div>
          </CardWrapper>
     )
}