import { formatAuditLogData } from "@/data/helpers/audit-logs"
import { AuditLogServerData, QuickFilterType } from "@/data/types"
import { DateInput, InfiniteList, SearchInput, SimpleList } from "react-admin"
import {formatDistanceToNow} from "date-fns"
import {hy} from "date-fns/locale"
import React from "react"
import { QuickFilter } from "."
import { AUDIT_FILTER_LABELS, AUDIT_QUICK_FILTERS } from "@/data/constants"
import Error from "@mui/icons-material/Error"

const logFilters = [
     <SearchInput key="search" source="q" placeholder="Փնտրել ըստ օգտագործողի անունի կամ գործողության" alwaysOn/>,
     ...Object.entries(AUDIT_QUICK_FILTERS).map(([key,value])=>(
          <QuickFilter key={`${key}-search`} label={AUDIT_FILTER_LABELS[key as QuickFilterType]} defaultValue={value} source={`action-${key}`}/>
     )),
     <DateInput key="from" source="fromDate" label="Սկսած ամսաթվից" />,
     <DateInput key="to" source="toDate" label="Մինչև ամսաթիվ" />,
]

export const AuditLogsList = () => (
     <InfiniteList filters={logFilters}>
          <SimpleList
               leftAvatar={(record: AuditLogServerData)=>record.user ? record.user.image : ""}
               primaryText={(record: AuditLogServerData)=>{
                    const data = formatAuditLogData(record);
                    return (
                         <>{data.isError ? <Error color="error" style={{marginRight: "5px"}}/> : ""}{data.primaryText}</>
                    )
               }}
               secondaryText={(record: AuditLogServerData)=>formatAuditLogData(record).secondaryText}
               tertiaryText={(record: AuditLogServerData)=>{
                    const data = formatAuditLogData(record);
                    return data.isError ? "" : formatDistanceToNow(record.createdAt,{
                         locale: hy
                    })
               }}
          />
     </InfiniteList>
)