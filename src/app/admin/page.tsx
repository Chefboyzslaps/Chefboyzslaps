import type { Metadata } from "next";
import { AdminUpload } from "@/components/admin-upload";

export const metadata: Metadata = { title: "Admin · Upload songs", robots: { index: false, follow: false } };
export default function AdminPage() { return <AdminUpload />; }
