export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// === Настройки ===
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CITY_CODE = 'klng';
const DEBUG = true;

// === Инициализация клиента ===
function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase configuration missing');
  return createClient(SUPABASE_URL, SUPABASE_KEY, { db: { schema: 'public' } });
}

// === Вспомогательные ===
const escapeXml = (text: any): string =>
  text == null
    ? ''
    : String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

const formatNumber = (n: any): string => {
  const v = Number(n);
  if (!isFinite(v)) return '0';
  return v % 1 === 0 ? v.toString() : v.toFixed(8).replace(/\.?0+$/, '');
};

// === Сети крипты ===
const cryptoNetworks: Record<string, string[]> = {
  USDT: ['USDTTRC', 'USDTERC', 'USDTBEP20', 'USDTARBTM', 'USDTOPTM', 'USDTSOL', 'USDTAVAXC', 'USDTTON'],
  USDC: ['USDCTRC20', 'USDCERC20', 'USDCBEP20', 'USDCARBTM', 'USDCOPTM', 'USDCSOL', 'USDCPOLYGON'],
  ETH: ['ETH', 'ETHBEP20', 'ETHARBTM', 'ETHOPTM'],
  BNB: ['BNB', 'BNBBEP2', 'BNBBEP20'],
  AVAX: ['AVAX', 'AVAXC', 'AVAXBEP20'],
  SHIB: ['SHIBERC20', 'SHIBBEP20'],
};

// === Генерация XML ===
async function generateXML() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('kenig_rates')
    .select('*', { head: false })
    .eq('is_active', true)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('❌ Supabase fetch error:', error);
    return `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(error.message)}</error>`;
  }

  const kenig = (data || []).filter(r => r.source === 'kenig');
  const derived = (data || []).filter(r => r.source === 'derived');
  const allRates = [...kenig, ...derived];

  const items: string[] = [];
  const seen = new Set<string>();

  for (const row of allRates) {
    const base = (row.base || '').toUpperCase();
    const quote = (row.quote || '').toUpperCase();
    const out = Number(row.sell);
    const reserve = Number(row.reserve);
    const min = Number(row.min_amount);
    const max = Number(row.max_amount);
    if (!base || !quote || !out || out <= 0 || !reserve || reserve <= 0) continue;

    let fromList: string[] = [base];
    let toList: string[] = [quote];

    if (base === 'RUB') fromList = ['CASHRUB'];
    if (quote === 'RUB') toList = ['CASHRUB'];
    if (cryptoNetworks[base]) fromList = cryptoNetworks[base];
    if (cryptoNetworks[quote]) toList = cryptoNetworks[quote];

    for (const from of fromList) {
      for (const to of toList) {
        const key = `${from}_${to}`;
        if (seen.has(key) || from === to) continue;
        seen.add(key);

        items.push(
          [
            '  <item>',
            `    <from>${from}</from>`,
            `    <to>${to}</to>`,
            `    <in>1</in>`,
            `    <out>${formatNumber(out)}</out>`,
            `    <amount>${formatNumber(reserve)}</amount>`,
            `    <minamount>${formatNumber(min || 100)}</minamount>`,
            `    <maxamount>${formatNumber(max || reserve)}</maxamount>`,
            `    <param>manual</param>`,
            `    <city>${CITY_CODE}</city>`,
            '  </item>',
          ].join('\n')
        );
      }
    }
  }

  const debug = DEBUG
    ? [
        `<!--   Generated: ${new Date().toISOString()}   -->`,
        `<!--   DEBUG MODE ENABLED   -->`,
        `<!--   Supabase host: ${SUPABASE_URL}   -->`,
        `<!--   Rows fetched: ${data?.length ?? 0}   -->`,
      ].join('\n')
    : '';

  return [`<?xml version="1.0" encoding="UTF-8"?>`, debug, '<rates>', ...items, '</rates>'].join('\n');
}

// === Обработчик GET ===
export async function GET() {
  try {
    const xml = await generateXML();
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Netlify-CDN-Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    console.error('❌ XML generation failed:', err);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(String(err))}</error>`,
      { status: 500, headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
    );
  }
}