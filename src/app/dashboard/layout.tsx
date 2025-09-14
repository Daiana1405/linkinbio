import Nav from "@/components/Nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full bg-stone-50 min-h-screen">
      <Nav />
      {children}
    </section>
  );
}
