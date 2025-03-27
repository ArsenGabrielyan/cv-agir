import { supabase } from "@/lib/supabase"

export const getImageUrl = (url: string) => {
     const {data} = supabase.storage.from("cv-agir-main").getPublicUrl(url)
     return data.publicUrl
}