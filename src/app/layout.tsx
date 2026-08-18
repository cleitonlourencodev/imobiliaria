import type { Metadata } from 'next';
import './globals.css';
import { RealEstateProvider } from '@/context/RealEstateContext';

export const metadata: Metadata = {
  title: 'Prime Imóveis & Negócios | Portal Imobiliário de Alto Padrão',
  description: 'Portal completo da Prime Imóveis & Negócios para venda, locação e avaliação de imóveis de alto padrão, com atendimento VIP, mapa interativo, simulador de financiamento e ferramentas modernas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden">
        <RealEstateProvider>
          {children}
        </RealEstateProvider>
      </body>
    </html>
  );
}
