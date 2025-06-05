"use client"
import dynamic from "next/dynamic";
import AdminLoader from "../loaders/admin-loader";

const App = dynamic(()=>import("@/components/admin-components/admin-page"),{
     ssr: false,
     loading: AdminLoader
});

const AdminPageWrapper = () => <App/>

export default AdminPageWrapper;