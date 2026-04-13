import { redirect } from "next/navigation";

export default function PrivateServicesRedirectPage() {
  redirect("/servicios/contacto");
}
