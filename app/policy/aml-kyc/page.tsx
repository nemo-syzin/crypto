import { Metadata } from 'next';
import { AmlKycPolicyClient } from './AmlKycPolicyClient';

export const metadata: Metadata = {
  title: 'Политика AML/CTF и KYC – KenigSwap',
  description: 'Политика противодействия отмыванию денег (AML), финансированию терроризма (CTF) и политика «Знай своего клиента» (KYC) сервиса Kenigswap.',
  keywords: ['AML', 'CTF', 'KYC', 'политика', 'противодействие отмыванию денег', 'финансирование терроризма', 'знай своего клиента', 'безопасность'],
  openGraph: {
    title: 'Политика AML/CTF и KYC – KenigSwap',
    description: 'Политика безопасности и соответствия требованиям законодательства',
    type: 'website',
    locale: 'ru_RU',
    images: [
      {
        url: '/og-policy.png',
        width: 1200,
        height: 630,
        alt: 'KenigSwap AML/KYC Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Политика AML/CTF и KYC – KenigSwap',
    description: 'Политика безопасности и соответствия требованиям законодательства',
    images: ['/og-policy.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/policy/aml-kyc',
  },
};

export default function AmlKycPolicyPage() {
  return <AmlKycPolicyClient />;
}