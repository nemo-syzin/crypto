export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ✅ подключение к Supabase (использует переменные окружения Netlify)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 🕒 Кэш (чтобы не дергать БД слишком часто)
let xmlCache: { xml: string; updated: number } = { xml: '', updated: 0 };

// интервал обновления (секунды)
const REFRESH_INTERVAL = 5;

// ⚙️ экранирование XML
function escapeXml(value: any) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ⚙️ форматирование чисел
function formatNumber(v: number | null | undefined) {
  if (!v || isNaN(v)) return '0';
  return Number(v).toFixed(8).replace(/\.?0+$/, '');
}

// ⚙️ генерация XML из данных
async function generateXML() {
  const { data, error } = await supabase
    .from('kenig_rates')
    .select(
      'base, quote, sell, buy, reserve, min_amount, max_amount, operational_mode, conditions, is_active'
    )
    .eq('is_active', true);

  if (error) {
    console.error('Ошибка при получении данных из Supabase:', error);
    return `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(
      error.message
    )}</error>`;
  }

  if (!data || data.length === 0) {
    return '<?xml version="1.0" encoding="UTF-8"?><rates></rates>';
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<rates>\n';

  for (const r of data) {
    // фильтруем валидные
    if (!r.base || !r.quote || !r.sell || !r.reserve) continue;

    xml += `  <item>\n`;
    xml += `    <from>${escapeXml(r.base)}</from>\n`;
    xml += `    <to>${escapeXml(r.quote)}</to>\n`;
    xml += `    <in>1</in>\n`;
    xml += `    <out>${formatNumber(r.sell)}</out>\n`;
    xml += `    <amount>${formatNumber(r.reserve)}</amount>\n`;

    if (r.min_amount) xml += `    <minamount>${formatNumber(r.min_amount)}</minamount>\n`;
    if (r.max_amount) xml += `    <maxamount>${formatNumber(r.max_amount)}</maxamount>\n`;

    // добавляем параметр manual если режим не auto
    if (r.operational_mode && r.operational_mode !== 'auto') {
      xml += `    <param>manual</param>\n`;
    }

    // определяем город (по условиям)
    const conditions = (r.conditions || '').toLowerCase();
    if (conditions.includes('калининград')) xml += `    <city>klng</city>\n`;
    else if (conditions.includes('москва')) xml += `    <city>msk</city>\n`;

    xml += `  </item>\n`;
  }

  xml += '</rates>';
  return xml;
}

// ⚙️ API-endpoint
export async function GET() {
  const now = Date.now();

  // используем кэш 5 сек
  if (xmlCache.xml && now - xmlCache.updated < REFRESH_INTERVAL * 1000) {
    return new NextResponse(xmlCache.xml, {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }

  // иначе обновляем из Supabase
  const xml = await generateXML();
  xmlCache = { xml, updated: now };

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': `public, max-age=${REFRESH_INTERVAL}`,
    },
  });
}