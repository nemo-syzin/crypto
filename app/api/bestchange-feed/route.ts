export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSupabaseClient, isServerSupabaseConfigured } from '@/lib/supabase/server';

let xmlCache: string = '';
let lastUpdate = 0;
const UPDATE_INTERVAL = 5000;
const CITY_CODE = 'klng';

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

const cryptoNetworks: { [key: string]: string[] } = {
  USDT: ['USDTTRC', 'USDTERC', 'USDTBEP20', 'USDTARBTM', 'USDTOPTM', 'USDTSOL', 'USDTAVAXC', 'USDTTON'],
  USDC: ['USDCTRC20', 'USDCERC20', 'USDCBEP20', 'USDCARBTM', 'USDCOPTM', 'USDCSOL', 'USDCPOLYGON'],
  ETH: ['ETH', 'ETHBEP20', 'ETHARBTM', 'ETHOPTM'],
  BNB: ['BNB', 'BNBBEP2', 'BNBBEP20'],
  AVAX: ['AVAX', 'AVAXC', 'AVAXBEP20'],
  SHIB: ['SHIBERC20', 'SHIBBEP20'],
};

async function generateXML() {
  if (!isServerSupabaseConfigured()) {
    console.error('❌ Supabase not configured');
    return `<?xml version="1.0" encoding="UTF-8"?><error>Database not configured</error>`;
  }

  try {
    const supabase = getServerSupabaseClient();

    const { data, error } = await supabase
      .from('kenig_rates')
      .select('*')
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
            ].join('\n'),
          );
        }
      }
    }

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      `<!-- Generated: ${new Date().toISOString()} -->`,
      '<rates>',
      ...items,
      '</rates>',
    ].join('\n');
  } catch (err) {
    console.error('❌ XML generation failed:', err);
    return `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(String(err))}</error>`;
  }
}

async function getXML(): Promise<string> {
  const now = Date.now();
  if (xmlCache && now - lastUpdate < UPDATE_INTERVAL) return xmlCache;

  try {
    xmlCache = await generateXML();
    lastUpdate = now;
    return xmlCache;
  } catch (err) {
    console.error('XML fetch failed:', err);
    return `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(String(err))}</error>`;
  }
}

export async function GET() {
  const xml = await getXML();
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=5, must-revalidate',
    },
  });
}
