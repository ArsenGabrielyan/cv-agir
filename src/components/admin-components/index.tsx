import { Chip } from "@mui/material";
import { ResumeTemplate } from "@db"
import { useRecordContext, TextFieldProps } from "react-admin"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark as style } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function QuickFilter<T>({label,}: {
     label: string;
     source?: string;
     defaultValue?: T;
}){
     return <Chip sx={{ marginBottom: 1 }} label={label} />;
};

export const TemplatesPanel = () => {
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

export const CodeField = (props: TextFieldProps<ResumeTemplate> & { language: string }) => {
     const record = useRecordContext(props)
     return record ? (
          <div className="w-full rounded-md overflow-hidden shadow">
               <SyntaxHighlighter style={style} language={props.language} wrapLongLines={true} customStyle={{width: "100%", borderRadius: "0"}}>
                    {(record[props.source] as string).trim()}
               </SyntaxHighlighter>
          </div>
     ) : null
}

export const ImageUrlField = (props: TextFieldProps<ResumeTemplate>) => {
     const record = useRecordContext(props)
     return record ? (
          <a href={`templates/${record.imageName}`} target="_blank" rel="noopener noreferrer">{record.imageName}</a>
     ) : null
}