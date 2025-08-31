import { Link } from "@heroui/link";
import { Navbar } from "@/components/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="container flex-grow px-6 pt-10 mx-auto max-w-7xl">
        {children}
      </main>
    </>
  );
}
