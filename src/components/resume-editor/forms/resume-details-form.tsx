import { ResumeFormProps } from "@/data/types"
import ResumeFormCardWrapper from "../wrappers/card-wrapper"
import { useForm } from "react-hook-form"
import { ResumeDetailsType } from "@/schemas/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { ResumeDetailsSchema } from "@/schemas"
import { useEffect } from "react"
import {Form} from "@/components/ui/form"
import { useResumeDynamicField } from "@/hooks/use-resume-dynamic-field"
import { Button } from "@/components/ui/button"
import WorkExperienceField from "../dynamic-fields/work-experience-field"
import EducationField from "../dynamic-fields/education-field"
import SkillField from "../dynamic-fields/skill-field"
import LanguageField from "../dynamic-fields/language-field"
import { closestCenter, DndContext } from "@dnd-kit/core"
import {restrictToVerticalAxis} from "@dnd-kit/modifiers"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

export default function ResumeDetailsForm({resumeData, setResumeData}: ResumeFormProps){
     const form = useForm<ResumeDetailsType>({
          resolver: zodResolver(ResumeDetailsSchema),
          defaultValues: {
               experience: resumeData.experience || [],
               education: resumeData.education || [],
               skills: resumeData.skills || [],
               languages: resumeData.languages || []
          }
     })
     useEffect(()=>{
          const {unsubscribe} = form.watch(async(values)=>{
               const isValid = await form.trigger()
               if(!isValid) return;
               setResumeData({
                    ...resumeData,
                    experience: values.experience?.filter(exp=>exp!==undefined),
                    education: values.education?.filter(edu=>edu!==undefined),
                    skills: values.skills?.filter(skill=>skill!==undefined),
                    languages: values.languages?.filter(lang=>lang!==undefined),
               })
          })
          return () => unsubscribe()
     },[form, resumeData, setResumeData])

     const experienceField = useResumeDynamicField(form,"experience");
     const educationField = useResumeDynamicField(form,"education");
     const skillsField = useResumeDynamicField(form,"skills");
     const languagesField = useResumeDynamicField(form,"languages");
     return (
          <Form {...form}>
               <form className="space-y-4">
                    <ResumeFormCardWrapper
                         title="Աշխատանքային փորձ"
                         description="Ավելացրեք այնքան աշխատանքային փորձ, որքան ցանկանում եք"
                         renderFooter={()=>(
                              <Button type="button" onClick={experienceField.addValue}>Ավելացնել աշխատանքային փորձ</Button>
                         )}
                    >
                         <DndContext
                              sensors={experienceField.sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={experienceField.handleDragEnd}
                              modifiers={[restrictToVerticalAxis]}
                         >
                              <SortableContext
                                   items={experienceField.fields}
                                   strategy={verticalListSortingStrategy}
                              >
                                   {experienceField.fields.map((field,i)=>(
                                        <WorkExperienceField
                                             key={field.id}
                                             id={field.id}
                                             form={form}
                                             remove={experienceField.remove}
                                             index={i}
                                        />
                                   ))}       
                              </SortableContext>   
                         </DndContext>
                    </ResumeFormCardWrapper>
                    <ResumeFormCardWrapper
                         title="Ուսումնական հաստատություններ"
                         description="Ավելացրեք այնքան ուս․ հաստատություն, որքան ցանկանում եք"
                         renderFooter={()=>(
                              <Button type="button" onClick={educationField.addValue}>Ավելացնել ուս. հաստատություն</Button>
                         )}
                    >
                         <DndContext
                              sensors={educationField.sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={educationField.handleDragEnd}
                              modifiers={[restrictToVerticalAxis]}
                         >
                              <SortableContext
                                   items={educationField.fields}
                                   strategy={verticalListSortingStrategy}
                              >
                                   {educationField.fields.map((field,i)=>(
                                        <EducationField
                                             key={field.id}
                                             id={field.id}
                                             form={form}
                                             remove={educationField.remove}
                                             index={i}
                                        />
                                   ))}
                              </SortableContext>
                         </DndContext>
                    </ResumeFormCardWrapper>
                    <ResumeFormCardWrapper
                         title="Հմտություններ"
                         description="Ինչո՞վ եք հմուտ։"
                         renderFooter={()=>(
                              <Button type="button" onClick={skillsField.addValue}>Ավելացնել հմտություն</Button>
                         )}
                    >
                         <DndContext
                              collisionDetection={closestCenter}
                              modifiers={[restrictToVerticalAxis]}
                              sensors={skillsField.sensors}
                              onDragEnd={skillsField.handleDragEnd}
                         >
                              <SortableContext
                                   items={skillsField.fields}
                                   strategy={verticalListSortingStrategy}
                              >
                                   {skillsField.fields.map((field,i)=>(
                                        <SkillField
                                             key={field.id}
                                             id={field.id}
                                             form={form}
                                             remove={skillsField.remove}
                                             index={i}
                                        />
                                   ))}
                              </SortableContext>
                         </DndContext>
                    </ResumeFormCardWrapper>
                    <ResumeFormCardWrapper
                         title="Լեզուներ"
                         description="Քանի՞ լեզու գիտեք։"
                         renderFooter={()=>(
                              <Button type="button" onClick={languagesField.addValue}>Ավելացնել հմտություն</Button>
                         )}
                    >
                         <DndContext
                              collisionDetection={closestCenter}
                              modifiers={[restrictToVerticalAxis]}
                              sensors={languagesField.sensors}
                              onDragEnd={languagesField.handleDragEnd}
                         >
                              <SortableContext
                                   items={languagesField.fields}
                                   strategy={verticalListSortingStrategy}
                              >
                                   {languagesField.fields.map((field,i)=>(
                                        <LanguageField
                                             key={field.id}
                                             id={field.id}
                                             form={form}
                                             remove={languagesField.remove}
                                             index={i}
                                        />
                                   ))}
                              </SortableContext>
                         </DndContext>
                         
                    </ResumeFormCardWrapper>
               </form>
          </Form>
     )
}