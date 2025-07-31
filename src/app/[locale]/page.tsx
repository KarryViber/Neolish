import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;
  const session = await getServerSession();
  
  if (session) {
    redirect(`/${locale}/dashboard`);
  } else {
    redirect(`/${locale}/login`);
  }
} 