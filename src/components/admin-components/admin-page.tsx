"use client"
import {Admin, Resource, TranslationMessages, bwLightTheme, bwDarkTheme} from "react-admin"
import am from "@/i18n/react-admin/am"
import simpleRestProvider from "ra-data-simple-rest"
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { TemplatesCreate, TemplatesEdit, TemplatesList, TemplateShow } from "./templates";
import { CategoriesCreate, CategoriesEdit, CategoriesList, CategoryShow } from "./categories";
import { AdminLayout } from "./admin-layout";
import DescriptionIcon from "@mui/icons-material/Description"
import CategoryIcon from "@mui/icons-material/Category"
import AdminHomePage from "./admin-homepage";

const translations: Record<string,TranslationMessages> = {am}
const dataProvider = simpleRestProvider("/api")
const i18nProvider = polyglotI18nProvider(locale=>translations[locale],"am");

export default function App(){
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
          </Admin>
     )
}