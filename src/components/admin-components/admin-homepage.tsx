import { Box, Card, CardContent, Typography } from "@mui/material";
import { Link } from "@/i18n/routing";
import { useTheme } from "react-admin";
import { buttonVariants } from "@/components/ui/button";
import Logo from "../layout/logo";

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
                         <Logo width={200} height={65} isAdmin isDark={theme==="dark"}/>
                         <Typography variant="h4" component="div" gutterBottom>Բարի գալուս Ադմինիստրատորի վահանակ</Typography>
                         <Typography variant="body1" color="text.secondary">Այստեղ ադմինիստրատորները կարող են կառավարել կատեգորիաները և շաբլոնները, իսկ մոդերատորները կարող են վերահսկել այս վեբ հավելվածի բովանդակությունը՝ իրերը անվտանգ պահելու համար։</Typography>
                         <Link href="/" className={buttonVariants({variant: "link"})}>Վերադառնալ Հավելված</Link>
                    </CardContent>
               </Card>
          </Box>
     )
}