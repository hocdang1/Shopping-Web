import Header from '@/components/shared/header';
import Footer from '@/components/footer';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header /> {/* Thêm Header vào đây */}
      <main className="flex-1 wrapper">
        {children}
      </main>
      <Footer /> {/* Thêm Footer vào đây */}
    </div>
  );
}
