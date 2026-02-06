
import type { Metadata } from "next";
import DashboardClientLayout from "./DashboardClientLayout";

export const metadata: Metadata = {
    title: "Gardigital Dashboard",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Gardigital Dashboard",
    },
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
