import { Navbar } from '../components/Navbar';

export function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1F2937]">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
