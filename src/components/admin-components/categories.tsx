import { Create, Datagrid, DateField, DeleteButton, Edit, EditButton, List, required, SearchInput, Show, SimpleForm, SimpleList, SimpleShowLayout, TextField, TextInput } from "react-admin";
import {useMediaQuery} from "@mui/material"

export const CategoryShow = () => (
     <Show>
          <SimpleShowLayout>
               <TextField source="id"/>
               <TextField source="name" label="Կատեգորիայի անուն"/>
               <DateField source="createdAt" label="Ստեղծվել է"/>
               <DateField source="updatedAt" label="Թարմացվել է"/>
          </SimpleShowLayout>
     </Show>
);

const categoriesFilter = [
     <SearchInput source="name" key="search" alwaysOn/>
]

export const CategoriesList = () => {
     const isSmall = useMediaQuery(theme=>theme.breakpoints.down("sm"));
     return (
          <List filters={categoriesFilter}>
               {isSmall ? (
                    <SimpleList
                         primaryText={record=>record.name}
                         tertiaryText={record=>new Date(record.createdAt).toLocaleDateString()}
                    />
               ) : (
                    <Datagrid>
                         <TextField source="name" label="Կատեգորիայի Անուն"/>
                         <EditButton/>
                         <DeleteButton/>
                    </Datagrid>
               )}
          </List>
     )
}

export const CategoriesCreate = () => (
     <Create>
          <SimpleForm>
               <TextInput validate={[required()]} source="name" label="Կատեգորիայի անուն"/>
          </SimpleForm>
     </Create>
)

export const CategoriesEdit = () => (
     <Edit>
          <SimpleForm>
               <TextInput source="id" label="Կատեգորիայի համար" disabled/>
               <TextInput validate={[required()]} source="name" label="Կատեգորիայի անուն"/>
          </SimpleForm>
     </Edit>
)