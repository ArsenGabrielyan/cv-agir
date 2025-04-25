import { useMediaQuery } from "@mui/material";
import { List, Datagrid, TextField, Create, SimpleForm, Edit, TextInput, required, ReferenceField, ReferenceInput, AutocompleteInput, FunctionField, Show, DateField, EditButton, DeleteButton, SimpleList, SearchInput, BooleanField, BooleanInput, TabbedShowLayout, InfiniteList } from "react-admin"
import StarIcon from "@mui/icons-material/Star"
import { QuickFilter, CodeField, ImageUrlField, TemplatesPanel } from ".";

const templateFilters = [
     <SearchInput key="search" source="name" alwaysOn/>,
     <ReferenceInput key="filter-categories" label="Կատեգորիա" source="categoryId" reference="categories" alwaysOn>
          <AutocompleteInput label="Կատեգորիա"/>
     </ReferenceInput>,
     <QuickFilter key="premium-filter" source="isPremium" label="Պրեմիում շաբլոն" defaultValue={true}/>
]

export const TemplatesList = () => {
     const isSmall = useMediaQuery(theme=>theme.breakpoints.down("md"));
     return isSmall ? (
          <InfiniteList filters={templateFilters}>
               <SimpleList
                    primaryText={record=>record.name}
                    secondaryText={record=>record.description}
                    tertiaryText={record=>new Date(record.createdAt).toLocaleDateString()}
                    leftIcon={record=>record.isPremium ? <StarIcon/> : null}
               />
          </InfiniteList>
     ) : (
          <List filters={templateFilters}>
               <Datagrid expand={<TemplatesPanel/>}>
                    <TextField source="name" label="Անուն"/>
                    <TextField source="description" label="Նկարագրություն"/>
                    <ReferenceField source="categoryId" reference="categories" label="Կատեգորիա"/>
                    <ImageUrlField source="imageName" label="Նկարի անուն"/>
                    <BooleanField source="isPremium" label="Պրեմիում շաբլոն"/>
                    <FunctionField label="HTML կոդ" render={(record)=>`${record.htmlTemplate.substring(0,50)}...`}/>
                    <FunctionField label="CSS կոդ" render={(record)=>`${record.cssStyle.substring(0,50)}...`}/>
                    <EditButton/>
                    <DeleteButton/>
               </Datagrid>
          </List>
     )
}

export const TemplatesCreate = () => (
     <Create>
          <SimpleForm>
               <TextInput validate={[required()]} source="name" label="Անուն"/>
               <TextInput validate={[required()]} source="description" label="Նկարագրություն"/>
               <TextInput validate={[required()]} source="imageName" label="Նկարի անուն"/>
               <ReferenceInput source="categoryId" reference="categories">
                    <AutocompleteInput label="Կատեգորիա"/>
               </ReferenceInput>
               <BooleanInput validate={[required()]} source="isPremium" label="Պրեմիում շաբլոն"/>
               <TextInput validate={[required()]} multiline source="htmlTemplate" label="HTML կոդ"/>
               <TextInput validate={[required()]} multiline source="cssStyle" label="CSS կոդ"/>
          </SimpleForm>
     </Create>
)

export const TemplatesEdit = () => (
     <Edit>
          <SimpleForm>
               <TextInput disabled source="id" label="Id"/>
               <TextInput validate={[required()]} source="name" label="Անուն"/>
               <TextInput validate={[required()]} source="description" label="Նկարագրություն"/>
               <TextInput validate={[required()]} source="imageName" label="Նկարի անուն"/>
               <ReferenceInput source="categoryId" reference="categories">
                    <AutocompleteInput label="Կատեգորիա"/>
               </ReferenceInput>
               <BooleanInput validate={[required()]} source="isPremium" label="Պրեմիում շաբլոն"/>
               <TextInput validate={[required()]} multiline source="htmlTemplate" label="HTML կոդ"/>
               <TextInput validate={[required()]} multiline source="cssStyle" label="CSS կոդ"/>
          </SimpleForm>
     </Edit>
)

export const TemplateShow = () => (
     <Show>
          <TabbedShowLayout>
               <TabbedShowLayout.Tab label="Տեղեկություններ">
                    <TextField source="id"/>
                    <TextField source="name" label="Անուն"/>
                    <TextField source="description" label="Նկարագրություն"/>
                    <ReferenceField source="categoryId" reference="categories" label="Կատեգորիա"/>
                    <ImageUrlField source="imageName" label="Նկարի անուն"/>
                    <BooleanField source="isPremium" label="Պրեմիում շաբլոն"/>
                    <DateField source="createdAt" label="Ստեղծվել է"/>
                    <DateField source="updatedAt" label="Թարմացվել է"/>
               </TabbedShowLayout.Tab>
               <TabbedShowLayout.Tab label="HTML կոդ">
                    <CodeField source="htmlTemplate" label="HTML կոդ" language="hbs"/>
               </TabbedShowLayout.Tab>
               <TabbedShowLayout.Tab label="CSS կոդ">
                    <CodeField source="cssStyle" label="CSS կոդ" language="css"/>
               </TabbedShowLayout.Tab>
          </TabbedShowLayout>
     </Show>
)