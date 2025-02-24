import '../globals.css';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { locales } from '@/i18n.config';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'דף הבית | מערכת מכירות טלקום',
    template: '%s | מערכת מכירות טלקום'
  },
  description: 'מערכת ניהול מכירות טלקום - ניהול הזמנות, לקוחות ומוצרים במקום אחד',
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} dir="rtl">
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 