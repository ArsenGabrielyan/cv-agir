import { ResumeFormProps } from "@/data/types"
import EditorFormCardWrapper from "../../wrappers/card-wrapper"
import { useForm, useWatch } from "react-hook-form"
import { ResumeOptionalDetailsType } from "@/data/types/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ResumeOptionalDetailsSchema } from "@/schemas"
import { useEffect, useMemo } from "react"
import {Form} from "@/components/ui/form"
import { useResumeDynamicField } from "@/hooks/use-resume-dynamic-field"
import { Button } from "@/components/ui/button"
import ResumeLinkField from "../dynamic-fields/link-field"
import ResumeCourseField from "../dynamic-fields/course-field"
import ReferenceField from "../dynamic-fields/reference-field"
import { closestCenter, DndContext } from "@dnd-kit/core"
import {restrictToVerticalAxis} from "@dnd-kit/modifiers"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import debounce from "lodash.debounce"

export default function ResumeOptionalDetailsForm({resumeData, setResumeData}: ResumeFormProps){
     const form = useForm<ResumeOptionalDetailsType>({
          resolver: zodResolver(ResumeOptionalDetailsSchema),
          defaultValues: {
               links: resumeData.links || [],
               courses: resumeData.courses || [],
               references: resumeData.references || []
          }
     })
     const debouncedUpdate = useMemo(()=>debounce(async (values: ResumeOptionalDetailsType) => {
          if (await form.trigger()) {
               setResumeData((prev) => ({
                    ...prev,
                    links: values.links || [],
                    courses: values.courses || [],
                    references: values.references || [],
               }));
          }
     },200),[form, setResumeData]);
     const allValues = useWatch({control: form.control})
     useEffect(()=>{
          debouncedUpdate(allValues)
          return () => {
               debouncedUpdate.cancel();
          }
     },[allValues, debouncedUpdate])

     const linksField = useResumeDynamicField(form,"links");
     const coursesField = useResumeDynamicField(form,"courses");
     const refsField = useResumeDynamicField(form,"references");
     return (
          <Form {...form}>
               <form className="space-y-4">
                    <EditorFormCardWrapper
                         title="Վեբ հղումներ"
                         description="Ավելացրեք այնքան վեբ հղում, որքան ցանկանում եք"
                         renderFooter={()=>(
                              <Button type="button" onClick={linksField.addValue}>Ավելացնել հղում</Button>
                         )}
                    >
                         <DndContext
                              collisionDetection={closestCenter}
                              modifiers={[restrictToVerticalAxis]}
                              sensors={linksField.sensors}
                              onDragEnd={linksField.handleDragEnd}
                         >
                              <SortableContext
                                   items={linksField.fields}
                                   strategy={verticalListSortingStrategy}
                              >
                                   {linksField.fields.map((field,i)=>(
                                        <ResumeLinkField
                                             key={field.id}
                                             id={field.id}
                                             form={form}
                                             remove={linksField.remove}
                                             index={i}
                                        />
                                   ))}
                              </SortableContext>
                         </DndContext>
                    </EditorFormCardWrapper>
                    <EditorFormCardWrapper
                         title="Դասընթացներ"
                         description="Ավելացրեք այնքան դասընթաց, որքան ցանկանում եք"
                         renderFooter={()=>(
                              <Button type="button" onClick={coursesField.addValue}>Ավելացնել դասընթաց</Button>
                         )}
                    >
                         <DndContext
                              collisionDetection={closestCenter}
                              modifiers={[restrictToVerticalAxis]}
                              sensors={coursesField.sensors}
                              onDragEnd={coursesField.handleDragEnd}
                         >
                              <SortableContext
                                   items={coursesField.fields}
                                   strategy={verticalListSortingStrategy}
                              >
                                   {coursesField.fields.map((field,i)=>(
                                        <ResumeCourseField
                                             key={field.id}
                                             id={field.id}
                                             form={form}
                                             remove={coursesField.remove}
                                             index={i}
                                        />
                                   ))}
                              </SortableContext>
                         </DndContext>
                         
                    </EditorFormCardWrapper>
                    <EditorFormCardWrapper
                         title="Կոնտակտային հղումներ"
                         description="Ավելացրեք այնքան կոնտակտային հղում, որքան ցանկանում եք"
                         renderFooter={()=>(
                              <Button type="button" onClick={refsField.addValue}>Ավելացնել կոնտակտային հղում</Button>
                         )}
                    >
                         <DndContext
                              collisionDetection={closestCenter}
                              modifiers={[restrictToVerticalAxis]}
                              sensors={refsField.sensors}
                              onDragEnd={refsField.handleDragEnd}
                         >
                              <SortableContext
                                   items={refsField.fields}
                                   strategy={verticalListSortingStrategy}
                              >
                                   {refsField.fields.map((field,i)=>(
                                        <ReferenceField
                                             key={field.id}
                                             id={field.id}
                                             form={form}
                                             remove={refsField.remove}
                                             index={i}
                                        />
                                   ))}
                              </SortableContext>
                         </DndContext>
                    </EditorFormCardWrapper>
               </form>
          </Form>
     )
}