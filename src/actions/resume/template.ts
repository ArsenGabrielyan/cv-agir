"use server"
import { getLanguageLevel } from "@/data/helpers";
import { ResumeFormType } from "@/data/types/schema";
import Handlebars from "handlebars"
import { marked } from "marked"

export async function compileHTML(html: string, data: ResumeFormType){
     Handlebars.registerHelper({
          eq: (v1, v2) => v1 === v2,
          ne: (v1, v2) => v1 !== v2,
          lt: (v1, v2) => v1 < v2,
          gt: (v1, v2) => v1 > v2,
          lte: (v1, v2) => v1 <= v2,
          gte: (v1, v2) => v1 >= v2,
          and(...args) {
               return Array.prototype.every.call(args, Boolean);
          },
          or(...args) {
               return Array.prototype.slice.call(args, 0, -1).some(Boolean);
          },
          getProficiency(value){
               const level = +value;
               return getLanguageLevel(level);
          },
          mdToHtml(content){
               const markdown = marked(content,{
                    async: false
               })
               return new Handlebars.SafeString(markdown)
          }
     })
     const htmlTemplate = Handlebars.compile<ResumeFormType>(html);
     return htmlTemplate(data)
}