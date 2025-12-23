import { Navbar as EditorNavbar } from '@/components/Editor/Navbar';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen flex-col">
      <EditorNavbar />
      <main className="h-full w-full flex-grow">{children}</main>
    </div>
  );
}
