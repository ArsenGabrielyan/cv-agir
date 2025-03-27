import { IResumeDynamicFields, PlaceholdersName } from "../types"

/**
 * Մասնագիտությունների ցուցակ
 */
export const JOB_NAMES: string[] = ['Բժիշկ', 'Ճարտարապետ', 'Մենեջեր', 'Քարտուղարուհի', 'Իրավաբան', 'Հաշվապահ', 'Ուսուցիչ', 'Ծրագրավորող', 'Ատամնաբույժ', 'Օգնական', 'Գրադարանավար', 'Խորհրդատու', 'Բեռնատարի վարորդ', 'Գնացքի վարորդ', 'Մսագործ', 'Շինարար', 'Ատաղձագործ', 'Էլեկտրիկ', 'Ջրմուղագործ', 'Մեխանիկ', 'Հավաքարար', 'Այգեպան', 'Բուժքույր', 'Օդաչու', 'Բորտուղեկցորդուհի', 'Մանկաբարձուհի', 'Խոհարար', 'Մատուցող', 'Դերձակ', 'Գանձապահ', 'Ընդունարանի աշխատակից', 'Օպտիկայի մասնագետ', 'Ավտոբուսի վարորդ', 'Թիկնապահ', 'Լուսանկարիչ', 'Մրցավար', 'Թղթակից', 'Դերասան', 'Պարուհի', 'Մարզիչ', 'Երգիչ', 'Նկարիչ', 'Դիզայներ']

/**
 * ԲՈՒՀ-երում գիտական աստիճանների ցուցակ
 */
export const DEGREES: string[] = ["Բակալավր","Մագիստրատուրա","Ասպիրանտուրա","Դիպլոմ"]

export const ARR_FIELD_INITIAL_VALUES: IResumeDynamicFields = {
     courses: {
          name: "",
          institution: "",
          startDate: "",
          endDate: ""
     },
     education: {
          degree: "",
          faculty: "",
          city: "",
          school: "",
          startDate: "",
          endDate: ""
     },
     experience: {
          city: "",
          job: "",
          company: "",
          jobInfo: "",
          startDate: "",
          endDate: ""
     },
     languages: {
          name: "",
          percentage: 0
     },
     links: {
          name: "",
          url: ""
     },
     references: {
          fullName: "",
          position: "",
          company: "",
          phone: "",
          email: "",
     },
     skills: {
          name: "",
          percentage: 0
     }
}

export const PLACEHOLDERS: Record<PlaceholdersName,string[]> = {
     jobName: JOB_NAMES,
     degrees: DEGREES
}