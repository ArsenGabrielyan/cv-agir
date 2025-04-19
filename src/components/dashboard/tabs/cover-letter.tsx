"use client"
import { CoverLetter } from "@db/"
import { CreateCoverLetterButton } from "../create-buttons"
import CoverLetterCard from "../cover-letters/cl-card"

interface CoverLetterTabProps{
     canCreate: boolean,
     coverLetters: CoverLetter[]
}
export default function CoverLetterTab({coverLetters, canCreate}: CoverLetterTabProps){
     return (
          <>
               <div className="flex justify-between items-center gap-2 my-4 flex-wrap">
                    <h2 className="text-xl flex-1 sm:flex-none md:text-2xl lg:text-3xl font-semibold mb-3">Ուղեկցող նամակներ</h2>
                    <CreateCoverLetterButton className="flex-1 sm:flex-none" canCreate={canCreate}/>
               </div>
               <div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-3">
                    {coverLetters.map(letter=>(
                         <CoverLetterCard
                              key={letter.id}
                              data={letter}
                         />
                    ))}
               </div>
          </>
     )
}