export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center w-full h-full gap-4">
      <div className="justify-center inline-block w-full h-full text-center">
        {children}
      </div>
    </section>
  );
}
