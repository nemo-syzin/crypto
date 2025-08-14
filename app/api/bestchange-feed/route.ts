import { NextResponse } from 'next/server';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

// Вспомогательная функция для проверки рабочих часов
const isWithinWorkingHours = (workingHours: any): boolean => {
  if (!workingHours || typeof workingHours !== 'object') return true;

  const now = new Date();
  const dayOfWeek = now.toLocaleString('en-US', { weekday: 'short' }).toLowerCase();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const dayConfig = workingHours[dayOfWeek];
  if (!dayConfig || !dayConfig.start || !dayConfig.end) {
    return true;
  }

  try {
    const [startHour, startMinute] = dayConfig.start.split(':').map(Number);
    const [endHour, endMinute] = dayConfig.end.split(':').map(Number);

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      return currentTime >= startTime || currentTime <= endTime;
    }
  } catch (error) {
    console.warn('Ошибка парсинга рабочих часов:', error);
    return true;
  }
};

// Функция экранирования XML
const escapeXml = (text: string | number | null | undefined): string => {
  if (text === null || text === undefined) return '';
  let str = String(text);
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/"/g, '&quot;');
  str = str.replace(/'/g, '&apos;');
  return str;
};

export async function GET() {
  try {
    // Проверяем доступность Supabase
    if (!isSupabaseAvailable()) {
      console.error('Supabase не настроен для BestChange фида');
      return new NextResponse(
        '<?xml version="1.0" encoding="UTF-8"?>\n<error>Supabase не настроен</error>',
        {
          status: 503,
          headers: { 'Content-Type': 'application/xml; charset=utf-8' }
        }
      );
    }

    console.log('🔄 Получение данных для BestChange фида...');

    // Получаем все данные из kenig_rates
    const { data: rates, error } = await supabase
      .from('kenig_rates')
      .select(`
        source,
        base,
        quote,
        sell,
        buy,
        min_amount,
        max_amount,
        reserve,
        operational_mode,
        working_hours,
        is_active,
        conditions,
        exchange_source,
        updated_at
      `)
      .not('base', 'is', null)
      .not('quote', 'is', null)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Ошибка при получении курсов для BestChange фида:', error);
      return new NextResponse(
        '<?xml version="1.0" encoding="UTF-8"?>\n<error>Ошибка базы данных</error>',
        {
          status: 500,
          headers: { 'Content-Type': 'application/xml; charset=utf-8' }
        }
      );
    }

    if (!rates || rates.length === 0) {
      console.warn('Нет данных в таблице kenig_rates для BestChange фида');
      return new NextResponse(
        '<?xml version="1.0" encoding="UTF-8"?>\n<rates></rates>',
        {
          headers: { 'Content-Type': 'application/xml; charset=utf-8' }
        }
      );
    }

    console.log(`📊 Найдено ${rates.length} записей в kenig_rates`);

    // Фильтруем активные направления обмена
    const activeExchanges = rates.filter(rate => {
      // 1. Проверяем активность
      if (rate.is_active === false) {
        return false;
      }

      // 2. Проверяем резервы
      if (!rate.reserve || rate.reserve <= 0) {
        return false;
      }

      // 3. Проверяем валидность курсов
      if (!rate.sell || !rate.buy || rate.sell <= 0 || rate.buy <= 0) {
        return false;
      }

      // 4. Проверяем рабочие часы для ручных/полуавтоматических режимов
      if (rate.operational_mode === 'manual' || rate.operational_mode === 'semi-auto') {
        if (!isWithinWorkingHours(rate.working_hours)) {
          return false;
        }
      }

      // 5. Проверяем минимальные/максимальные суммы
      if (rate.min_amount && rate.max_amount && rate.min_amount > rate.max_amount) {
        return false;
      }

      return true;
    });

    console.log(`✅ Отфильтровано ${activeExchanges.length} активных направлений`);

    // Генерируем XML
    let xmlOutput = '<?xml version="1.0" encoding="UTF-8"?>\n<rates>\n';

    activeExchanges.forEach(rate => {
      xmlOutput += `  <item>\n`;
      xmlOutput += `    <from>${escapeXml(rate.base)}</from>\n`;
      xmlOutput += `    <to>${escapeXml(rate.quote)}</to>\n`;
      xmlOutput += `    <in>${escapeXml(rate.sell)}</in>\n`;
      xmlOutput += `    <out>${escapeXml(rate.buy)}</out>\n`;
      
      // Минимальная и максимальная суммы
      if (rate.min_amount) {
        xmlOutput += `    <min>${escapeXml(rate.min_amount)}</min>\n`;
      }
      if (rate.max_amount) {
        xmlOutput += `    <max>${escapeXml(rate.max_amount)}</max>\n`;
      }
      
      // Резерв
      xmlOutput += `    <amount>${escapeXml(rate.reserve)}</amount>\n`;

      // Режим работы
      if (rate.operational_mode === 'manual') {
        xmlOutput += `    <manual>1</manual>\n`;
      } else if (rate.operational_mode === 'semi-auto') {
        xmlOutput += `    <semi_auto>1</semi_auto>\n`;
      }

      // Условия обмена
      if (rate.conditions) {
        // Проверяем требования верификации
        if (rate.conditions.includes('KYC') || rate.conditions.includes('верификация')) {
          xmlOutput += `    <verification_required>1</verification_required>\n`;
        }

        // Извлекаем количество подтверждений
        const confirmationsMatch = rate.conditions.match(/(\d+)\s*подтверждени/);
        if (confirmationsMatch && confirmationsMatch[1]) {
          xmlOutput += `    <confirmations>${escapeXml(confirmationsMatch[1])}</confirmations>\n`;
        }

        // Проверяем на наличные
        if (rate.conditions.includes('наличные') || rate.conditions.includes('офис')) {
          xmlOutput += `    <cash>1</cash>\n`;
        }

        // Проверяем банковские переводы
        if (rate.conditions.includes('банк') || rate.conditions.includes('карта')) {
          xmlOutput += `    <bank>1</bank>\n`;
        }
      }

      // Источник курса
      if (rate.exchange_source) {
        xmlOutput += `    <exchange_source>${escapeXml(rate.exchange_source)}</exchange_source>\n`;
      }

      // Время последнего обновления
      if (rate.updated_at) {
        const lastUpdate = new Date(rate.updated_at).toISOString();
        xmlOutput += `    <last_update>${escapeXml(lastUpdate)}</last_update>\n`;
      }

      xmlOutput += `  </item>\n`;
    });

    xmlOutput += '</rates>';

    console.log(`📤 Сгенерирован XML фид с ${activeExchanges.length} направлениями`);

    // Возвращаем XML с правильными заголовками
    return new NextResponse(xmlOutput, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

  } catch (error) {
    console.error('Ошибка в BestChange фиде:', error);
    
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>Внутренняя ошибка сервера</message>
  <timestamp>${new Date().toISOString()}</timestamp>
</error>`;

    return new NextResponse(errorXml, {
      status: 500,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' }
    });
  }
}