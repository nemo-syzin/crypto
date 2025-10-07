// app/api/rates/route.ts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// === Конфигурация подключения к БД ===
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials');
}

function getSupabaseClient() {
  return createClient(SUPABASE_URL!, SUPABASE_KEY!, {
    db: { schema: 'public' },
  });
}

let xmlCache = '';
let lastUpdate = 0;
const UPDATE_INTERVAL = 5000;
const CITY_CODE = 'klng';

// === Утилиты ===
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

const cryptoNetworks: Record<string, string[]> = {
  USDT: ['USDTTRC', 'USDTERC', 'USDTBEP20', 'USDTARBTM', 'USDTOPTM', 'USDTSOL', 'USDTAVAXC', 'USDTTON'],
  USDC: ['USDCTRC20', 'USDCERC20', 'USDCBEP20', 'USDCARBTM', 'USDCOPTM', 'USDCSOL', 'USDCPOLYGON'],
  ETH: ['ETH', 'ETHBEP20', 'ETHARBTM', 'ETHOPTM'],
  BNB: ['BNB', 'BNBBEP2', 'BNBBEP20'],
  AVAX: ['AVAX', 'AVAXC', 'AVAXBEP20'],
  SHIB: ['SHIBERC20', 'SHIBBEP20'],
};

async function generateXML(debug = false) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('kenig_rates')
    .select('*')
    .eq('is_active', true)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('❌ Supabase fetch error:', error);
    return `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(error.message)}</error>`;
  }

  if (!data?.length) {
    console.warn('⚠️ No active rates found.');
    return `<?xml version="1.0" encoding="UTF-8"?><error>No active rates found</error>`;
  }

  // приоритет kenig → derived
  const kenig = data.filter(r => r.source === 'kenig');
  const derived = data.filter(r => r.source === 'derived');
  const allRates = [...kenig, ...derived];

  // чтобы избежать дублей — храним только 1 вариант каждой пары
  const seenPairs = new Set<string>();
  const items: string[] = [];

  for (const row of allRates) {
    const base = (row.base || '').toUpperCase();
    const quote = (row.quote || '').toUpperCase();
    const sell = Number(row.sell);
    const reserve = Number(row.reserve);
    const min = Number(row.min_amount);
    const max = Number(row.max_amount);
    if (!base || !quote || !sell || sell <= 0 || !reserve || reserve <= 0) continue;

    let fromList = [base];
    let toList = [quote];

    // RUB → наличные
    if (base === 'RUB') fromList = ['CASHRUB'];
    if (quote === 'RUB') toList = ['CASHRUB'];

    // крипта → сети
    if (cryptoNetworks[base]) fromList = cryptoNetworks[base];
    if (cryptoNetworks[quote]) toList = cryptoNetworks[quote];

    for (const from of fromList) {
      for (const to of toList) {
        if (from === to) continue;
        const key = `${from}_${to}`;
        if (seenPairs.has(key)) continue;
        seenPairs.add(key);

        items.push(
          [
            '  <item>',
            `    <from>${from}</from>`,
            `    <to>${to}</to>`,
            `    <in>1</in>`,
            `    <out>${formatNumber(sell)}</out>`,
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

  // для отладки выводим инфо
  const usdtRub = allRates.find(r => r.base === 'USDT' && r.quote === 'RUB');
  const host = SUPABASE_URL ? new URL(SUPABASE_URL).host : 'unknown';

  const debugComment = debug
    ? [
        `<!-- DEBUG MODE -->`,
        `<!-- Supabase host: ${host} -->`,
        usdtRub
          ? `<!-- USDT/RUB: id=${usdtRub.id} sell=${usdtRub.sell} buy=${usdtRub.buy} updated_at=${usdtRub.updated_at} source=${usdtRub.source} -->`
          : `<!-- No USDT/RUB found -->`,
      ].join('\n')
    : '';

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<!-- Generated: ${new Date().toISOString()} -->`,
    debugComment,
    '<rates>',
    ...items,
    '</rates>',
  ].join('\n');
}

// === Кэш и экспорт ===
async function getXML(debug = false): Promise<string> {
  const now = Date.now();
  if (!debug && xmlCache && now - lastUpdate < UPDATE_INTERVAL) return xmlCache;

  try {
    xmlCache = await generateXML(debug);
    lastUpdate = now;
    return xmlCache;
  } catch (err) {
    console.error('XML generation failed:', err);
    return `<?xml version="1.0"?><error>${escapeXml(String(err))}</error>`;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const debug = url.searchParams.get('debug') === '1';
  const xml = await getXML(debug);

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': debug ? 'no-store' : 'public, max-age=5, must-revalidate',
    },
  });
}