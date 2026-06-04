import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/NavBar";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
