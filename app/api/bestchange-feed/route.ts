// app/api/rates/route.ts
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSupabaseClient, isServerSupabaseConfigured } from '@/lib/supabase/server';

// ===== КЭШ XML =====
let xmlCache: {
  xml: string;
  lastUpdate: Date;
  isUpdating: boolean;
} = {
  xml: '',
  lastUpdate: new Date(0),
  isUpdating: false,
};

const UPDATE_INTERVAL = 5000; // 5 секунд
const CITY_CODE = 'klng'; // всегда Калининград

// ===== ВСПОМОГАТЕЛЬНЫЕ =====
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

// ===== ГЕНЕРАЦИЯ КОДОВ СЕТЕЙ ДЛЯ КРИПТЫ =====
const cryptoNetworks = {
  USDT: ['USDTTRC', 'USDTERC', 'USDTBEP20', 'USDTARBTM', 'USDTOPTM', 'USDTSOL', 'USDTAVAXC', 'USDTTON'],
  USDC: ['USDCTRC20', 'USDCERC20', 'USDCBEP20', 'USDCARBTM', 'USDCOPTM', 'USDCSOL', 'USDCPOLYGON'],
  ETH: ['ETH', 'ETHBEP20', 'ETHARBTM', 'ETHOPTM'],
  BNB: ['BNB', 'BNBBEP2', 'BNBBEP20'],
  AVAX: ['AVAX', 'AVAXC', 'AVAXBEP20'],
  SHIB: ['SHIBERC20', 'SHIBBEP20'],
};

// ===== ГЕНЕРАЦИЯ XML =====
async function generateXML(): Promise<string> {
  if (!isServerSupabaseConfigured()) {
    return `<?xml version="1.0" encoding="UTF-8"?><error>Supabase not configured</error>`;
  }

  const supabase = getServerSupabaseClient();

  const { data, error } = await supabase
    .from('kenig_rates')
    .select('*')
    .eq('is_active', true)
    .order('updated_at', { ascending: false });

  if (error || !data) {
    return `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(
      error?.message || 'Database error',
    )}</error>`;
  }

  const items: string[] = [];
  const seen = new Set<string>();

  for (const row of data) {
    const base = (row.base || '').toUpperCase();
    const quote = (row.quote || '').toUpperCase();
    const out = Number(row.sell);
    const reserve = Number(row.reserve);
    const min = Number(row.min_amount);
    const max = Number(row.max_amount);
    const isCrypto = ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'AVAX', 'SHIB'].includes(base);
    const isRub = quote === 'RUB' || base === 'RUB';

    if (!base || !quote || !out || out <= 0 || !reserve || reserve <= 0) continue;

    // ===== определяем from / to =====
    let fromList: string[] = [base];
    let toList: string[] = [quote];

    // RUB всегда наличные
    if (base === 'RUB') fromList = ['CASHRUB'];
    if (quote === 'RUB') toList = ['CASHRUB'];

    // Крипта: генерим все сети
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
            `    <param>manual${row.conditions?.toLowerCase().includes('verify') ? ',veryfying' : ''}</param>`,
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
}

// ===== ОБНОВЛЕНИЕ КЭША =====
async function updateCache() {
  if (xmlCache.isUpdating) return;
  xmlCache.isUpdating = true;
  try {
    const xml = await generateXML();
    xmlCache.xml = xml;
    xmlCache.lastUpdate = new Date();
  } catch (err) {
    console.error('XML generation error:', err);
  } finally {
    xmlCache.isUpdating = false;
  }
}

// ===== АВТО-ОБНОВЛЕНИЕ =====
setInterval(updateCache, UPDATE_INTERVAL);
updateCache();

// ===== API ENDPOINT =====
export async function GET() {
  try {
    if (!xmlCache.xml) await updateCache();

    return new NextResponse(xmlCache.xml || '<?xml version="1.0"?><rates></rates>', {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=5, must-revalidate',
      },
    });
  } catch (err) {
    console.error('Error in /api/rates:', err);
    return new NextResponse(`<?xml version="1.0"?>
<error>${escapeXml(String(err))}</error>`, {
      status: 500,
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}