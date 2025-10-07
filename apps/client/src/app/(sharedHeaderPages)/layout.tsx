import Header from "@/components/Header/Header";

import localFont from "next/font/local";

const geistSans = localFont({
  weight: "100 900",
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  weight: "100 900",
  variable: "--font-geist-mono",
  src: "../fonts/GeistMonoVF.woff",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 px-4 to-indigo-100 ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <Header />
      <div className=" max-w-5xl w-full mx-auto font-sans py-16 pb-32">
        {children}
      </div>
    </div>
  );
}
