import "./globals.scss";
import { UserProvider } from "@/context/UserContext";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <html lang="fr">
        <body>
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </UserProvider>
  );
}
