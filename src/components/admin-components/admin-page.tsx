"use client"
import {Admin, Resource, TranslationMessages, bwLightTheme, bwDarkTheme} from "react-admin"
import am from "@/i18n/react-admin/hy"
import en from '@/i18n/react-admin/en';
import simpleRestProvider from "ra-data-simple-rest"
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { TemplatesCreate, TemplatesEdit, TemplatesList, TemplateShow } from "./templates";
import { CategoriesCreate, CategoriesEdit, CategoriesList, CategoryShow } from "./categories";
import { AdminLayout } from "./admin-layout";
import DescriptionIcon from "@mui/icons-material/Description"
import CategoryIcon from "@mui/icons-material/Category"
import AdminHomePage from "./admin-homepage";
import FactCheckIcon from "@mui/icons-material/FactCheck"
import { AuditLogsList } from "./logs";
import { LangCodeType } from "@/i18n/types";

const translations: Record<string,TranslationMessages> = {am, en}
const dataProvider = simpleRestProvider("/api")
const getI18nProvider = (locale: LangCodeType) => polyglotI18nProvider(
     locale=>translations[locale],
     locale,
     [
          {locale: "en", name: "English"},
          {locale: "hy", name: "Հայերեն"}
     ]
);

interface Props{
     locale: LangCodeType
}
export default function App({locale}: Props){
     const i18nProvider = getI18nProvider(locale);
     return (
          <Admin
               i18nProvider={i18nProvider}
               dataProvider={dataProvider}
               theme={bwLightTheme}
               darkTheme={bwDarkTheme}
               layout={AdminLayout}
               dashboard={AdminHomePage}
          >
               <Resource
                    name="categories"
                    list={CategoriesList}
                    edit={CategoriesEdit}
                    create={CategoriesCreate}
                    show={CategoryShow}
                    icon={CategoryIcon}
                    options={{label: "Կատեգորիաներ"}}
               />
               <Resource
                    name="templates"
                    list={TemplatesList}
                    edit={TemplatesEdit}
                    create={TemplatesCreate}
                    show={TemplateShow}
                    icon={DescriptionIcon}
                    options={{label: "Շաբլոններ"}}
               />
               <Resource
                    name="logs"
                    list={()=>AuditLogsList({locale})}
                    icon={FactCheckIcon}
                    options={{label: "Ակտիվություն"}}
               />
          </Admin>
     )
}