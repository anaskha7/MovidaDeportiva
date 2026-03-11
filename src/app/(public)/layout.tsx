import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="container" style={{ padding: "0 24px" }}>
        <Navbar />
        {children}
      </div>
      <Footer />
    </div>
  );
}
