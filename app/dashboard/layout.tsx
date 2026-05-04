import Header from "../_components/Header";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="pt-16 flex-1">{children}</div>
    </main>
  );
}

export default DashboardLayout;
