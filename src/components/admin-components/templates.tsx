import { useMediaQuery, Chip } from "@mui/material";
import { ResumeTemplate } from "@prisma/client"
import { List, Datagrid, TextField, Create, SimpleForm, Edit, TextInput, required, ReferenceField, ReferenceInput, AutocompleteInput, FunctionField, useRecordContext, Show, SimpleShowLayout, TextFieldProps, DateField, EditButton, DeleteButton, SimpleList, SearchInput, BooleanField, BooleanInput } from "react-admin"
import StarIcon from "@mui/icons-material/Star"
import { getImageUrl } from "@/data/helpers/storage";
import {  } from '@mui/material';

const TemplatesPanel = () => {
     const record = useRecordContext<ResumeTemplate>();
     return record ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div>
                    <p className="text-xl font-semibold mb-3">HTML (Handlebars)</p>
                    <pre className="break-words whitespace-pre-wrap">
                         {record.htmlTemplate}
                    </pre>
               </div>
               <div>
                    <p className="text-xl font-semibold mb-3">CSS</p>
                    <pre className="break-words whitespace-pre-wrap">
                         {record.cssStyle}
                    </pre>
               </div>
          </div>
     ) : null
}

const CodeField = (props: TextFieldProps) => {
     const record = useRecordContext(props)
     return record ? (
          <pre
               style={{
                    background: '#f5f5f5',
                    padding: '1rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    fontFamily: 'monospace',
               }}
          >
               {record[props.source]}
          </pre>
     ) : null
}

const ImageUrlField = (props: TextFieldProps) => {
     const record = useRecordContext(props)
     return record ? (
          <a href={getImageUrl(`templates/${record[props.source]}`)} target="_blank" rel="noopener noreferrer">{record[props.source]}</a>
     ) : null
}

function QuickFilter<T>({
     label,
 }: {
     label: string;
     source?: string;
     defaultValue?: T;
}){
     return <Chip sx={{ marginBottom: 1 }} label={label} />;
};

const templateFilters = [
     <SearchInput key="search" source="name" alwaysOn/>,
     <ReferenceInput key="filter-categories" label="Կատեգորիա" source="categoryId" reference="categories" alwaysOn>
          <AutocompleteInput label="Կատեգորիա"/>
     </ReferenceInput>,
     <QuickFilter key="premium-filter" source="isPremium" label="Պրեմիում Շաբլոն" defaultValue={true}/>
]

export const TemplatesList = () => {
     const isSmall = useMediaQuery(theme=>theme.breakpoints.down("md"));
     return (
          <List filters={templateFilters}>
               {isSmall ? (
                    <SimpleList
                         primaryText={record=>record.name}
                         secondaryText={record=>record.description}
                         tertiaryText={record=>new Date(record.createdAt).toLocaleDateString()}
                         leftIcon={record=>record.isPremium ? <StarIcon/> : null}
                    />
               ) : (
                    <Datagrid
                         expand={<TemplatesPanel/>}
                    >
                         <TextField source="id" label="#"/>
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
               )}
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
          <SimpleShowLayout>
          <TextField source="id" label="#"/>
               <TextField source="name" label="Անուն"/>
               <TextField source="description" label="Նկարագրություն"/>
               <ReferenceField source="categoryId" reference="categories" label="Կատեգորիա"/>
               <ImageUrlField source="imageName" label="Նկարի անուն"/>
               <BooleanField source="isPremium" label="Պրեմիում շաբլոն"/>
               <CodeField source="htmlTemplate" label="HTML կոդ"/>
               <CodeField source="cssStyle" label="CSS կոդ"/>
               <DateField source="createdAt" label="Ստեղծվել է"/>
               <DateField source="updatedAt" label="Թարմացվել է"/>
          </SimpleShowLayout>
     </Show>
)