import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="app-layout">
        <Sidebar />
        <div className="main-area">
          <Header />
          <main className="page-content">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
