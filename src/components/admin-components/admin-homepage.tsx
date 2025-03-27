import { Box, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "react-admin";
import { buttonVariants } from "@/components/ui/button";

export default function AdminHomePage(){
     const [theme] = useTheme();
     return (
          <Box sx={{
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
               height: "100dvh"
          }}>
               <Card sx={{maxWidth: 400, padding: 2, textAlign: "center"}}>
                    <CardContent sx={{
                         display: "flex",
                         justifyContent: "center",
                         alignItems: "center",
                         flexDirection: "column",
                         rowGap: 1
                    }}>
                         <Image src={theme==="dark" ? "/logo-white.svg" : "/logo.svg"} alt="logo" width={200} height={40}/>
                         <Typography variant="h4" component="div" gutterBottom>Բարի գալուս Ադմինիստրատորի վահանակ</Typography>
                         <Typography variant="body1" color="text.secondary">Այստեղ ադմինիստրատորները կարող են կառավարել կատեգորիաները և շաբլոնները, իսկ մոդերատորները կարող են վերահսկել այս վեբ հավելվածի բովանդակությունը՝ իրերը անվտանգ պահելու համար։</Typography>
                         <Link href="/" className={buttonVariants({variant: "link"})}>Վերադառնալ Հավելված</Link>
                    </CardContent>
               </Card>
          </Box>
     )
}