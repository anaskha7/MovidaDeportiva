import { getLocale } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <div>
      <div className="container" style={{ padding: "0 24px" }}>
        <Navbar locale={locale} />
        {children}
      </div>
      <Footer locale={locale} />
    </div>
  );
}
