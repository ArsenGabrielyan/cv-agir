"use client"

import dynamic from "next/dynamic";

const App = dynamic(()=>import("@/components/admin-components/admin-page"),{ssr: false});

const AdminPageWrapper = () => <App/>

export default AdminPageWrapper;