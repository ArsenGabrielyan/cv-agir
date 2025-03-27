import { Box, Theme, useMediaQuery } from "@mui/material";
import Image from "next/image";
import React from "react";
import { AppBar, Layout, TitlePortal } from "react-admin";

const AdminAppBar = () => {
     const isLargeEnough = useMediaQuery<Theme>(theme=>theme.breakpoints.up("md"));
     return (
          <AppBar color="secondary">
               <TitlePortal/>
               {isLargeEnough && <Image src="/logo-white.svg" alt="logo" width={200} height={40}/>}
               {isLargeEnough && <Box component="span" sx={{flex: 1}}/>}
          </AppBar>
     )
}

export const AdminLayout = ({children}: {children: React.ReactNode}) => (
     <Layout appBar={AdminAppBar}>
          {children}
     </Layout>
)