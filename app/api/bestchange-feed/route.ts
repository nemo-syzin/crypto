export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

// Кэш для XML фида с автоматическим обновлением каждые 5 секунд
let xmlCache: {
  xml: string;
  lastUpdate: Date;
  isUpdating: boolean;
  lastError: Error | null;
} = {
  xml: '',
  lastUpdate: new Date(0),
  isUpdating: false,
  lastError: null
};

// Интервал обновления в миллисекундах (5 секунд)
const UPDATE_INTERVAL = 5000;

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

// Функция для получения кода валюты Exnode
const getExnodeCurrencyCode = (base: string, quote: string, conditions: string): string => {
  const currency = base || quote;
  const conditionsLower = (conditions || '').toLowerCase();
  
  // Определяем сеть для криптовалют на основе условий
  if (currency === 'USDT') {
    if (conditionsLower.includes('trc20') || conditionsLower.includes('tron')) return 'USDTTRC';
    if (conditionsLower.includes('erc20') || conditionsLower.includes('ethereum')) return 'USDTERC';
    if (conditionsLower.includes('bep20') || conditionsLower.includes('bsc')) return 'USDTBEP20';
    if (conditionsLower.includes('polygon')) return 'USDTPOLYGON';
    if (conditionsLower.includes('arbitrum')) return 'USDTARBTM';
    if (conditionsLower.includes('optimism')) return 'USDTOPTM';
    if (conditionsLower.includes('solana') || conditionsLower.includes('sol')) return 'USDTSOL';
    if (conditionsLower.includes('avalanche') || conditionsLower.includes('avax')) return 'USDTAVAXC';
    if (conditionsLower.includes('ton')) return 'USDTTON';
    if (conditionsLower.includes('algorand')) return 'USDTALGO';
    return 'USDTTRC'; // По умолчанию TRC20
  }
  
  if (currency === 'USDC') {
    if (conditionsLower.includes('trc20') || conditionsLower.includes('tron')) return 'USDCTRC20';
    if (conditionsLower.includes('erc20') || conditionsLower.includes('ethereum')) return 'USDCERC20';
    if (conditionsLower.includes('bep20') || conditionsLower.includes('bsc')) return 'USDCBEP20';
    if (conditionsLower.includes('polygon')) return 'USDCPOLYGON';
    if (conditionsLower.includes('arbitrum')) return 'USDCARBTM';
    if (conditionsLower.includes('optimism')) return 'USDCOPTM';
    if (conditionsLower.includes('solana') || conditionsLower.includes('sol')) return 'USDCSOL';
    return 'USDCERC20'; // По умолчанию ERC20
  }
  
  if (currency === 'ETH') {
    if (conditionsLower.includes('bep20') || conditionsLower.includes('bsc')) return 'ETHBEP20';
    if (conditionsLower.includes('arbitrum')) return 'ETHARBTM';
    if (conditionsLower.includes('optimism')) return 'ETHOPTM';
    return 'ETH'; // Основная сеть Ethereum
  }
  
  if (currency === 'BNB') {
    if (conditionsLower.includes('bep2')) return 'BNBBEP2';
    if (conditionsLower.includes('bep20')) return 'BNBBEP20';
    return 'BNB'; // По умолчанию
  }
  
  if (currency === 'SHIB') {
    if (conditionsLower.includes('bep20') || conditionsLower.includes('bsc')) return 'SHIBBEP20';
    return 'SHIBERC20'; // По умолчанию ERC20
  }
  
  if (currency === 'AVAX') {
    if (conditionsLower.includes('bep20') || conditionsLower.includes('bsc')) return 'AVAXBEP20';
    return 'AVAXC'; // C-Chain
  }
  
  if (currency === 'BTCB' || (currency === 'BTC' && conditionsLower.includes('bep20'))) {
    return 'BTCBEP20';
  }
  
  // Определяем тип фиатной валюты для RUB
  if (currency === 'RUB') {
    if (conditionsLower.includes('наличные') || conditionsLower.includes('cash')) return 'CASHRUB';
    if (conditionsLower.includes('сбербанк') || conditionsLower.includes('sber')) return 'SBERRUB';
    if (conditionsLower.includes('тинькофф') || conditionsLower.includes('tinkoff') || conditionsLower.includes('т-банк')) return 'TCSBRUB';
    if (conditionsLower.includes('альфа') || conditionsLower.includes('alfa')) return 'ACRUB';
    if (conditionsLower.includes('втб')) return 'TBRUB';
    if (conditionsLower.includes('райффайзен')) return 'RFBRUB';
    if (conditionsLower.includes('яндекс') || conditionsLower.includes('yandex') || conditionsLower.includes('юmoney')) return 'YAMRUB';
    if (conditionsLower.includes('qr') && conditionsLower.includes('сбер')) return 'SBERQRUB';
    if (conditionsLower.includes('qr') && conditionsLower.includes('тинь')) return 'TCSBQRUB';
    if (conditionsLower.includes('сбп')) return 'SBPRUB';
    if (conditionsLower.includes('visa') || conditionsLower.includes('mastercard') || conditionsLower.includes('карта')) return 'CARDRUB';
    if (conditionsLower.includes('банковский счет') || conditionsLower.includes('wire')) return 'WIRERUB';
    if (conditionsLower.includes('компания') || conditionsLower.includes('corp')) return 'CORPRUB';
    return 'CARDRUB'; // По умолчанию банковская карта
  }
  
  // Определяем тип для других фиатных валют
  if (currency === 'USD') {
    if (conditionsLower.includes('наличные') || conditionsLower.includes('cash')) return 'CASHUSD';
    if (conditionsLower.includes('paypal')) return 'PPUSD';
    if (conditionsLower.includes('visa') || conditionsLower.includes('mastercard') || conditionsLower.includes('карта')) return 'CARDUSD';
    if (conditionsLower.includes('банковский счет') || conditionsLower.includes('wire')) return 'WIREUSD';
    if (conditionsLower.includes('компания') || conditionsLower.includes('corp')) return 'CORPUSD';
    return 'CARDUSD'; // По умолчанию банковская карта
  }
  
  if (currency === 'EUR') {
    if (conditionsLower.includes('наличные') || conditionsLower.includes('cash')) return 'CASHEUR';
    if (conditionsLower.includes('paypal')) return 'PPEUR';
    if (conditionsLower.includes('visa') || conditionsLower.includes('mastercard') || conditionsLower.includes('карта')) return 'CARDEUR';
    if (conditionsLower.includes('банковский счет') || conditionsLower.includes('wire')) return 'WIREEUR';
    if (conditionsLower.includes('компания') || conditionsLower.includes('corp')) return 'CORPEUR';
    return 'CARDEUR'; // По умолчанию банковская карта
  }
  
  // Для остальных криптовалют возвращаем как есть
  return currency.toUpperCase();
};

// Функция для получения параметров Exnode
const getExnodeParams = (operationalMode: string, conditions: string): string => {
  const params: string[] = [];
  const conditionsLower = (conditions || '').toLowerCase();
  
  // Добавляем manual для ручного режима
  if (operationalMode === 'manual' || operationalMode === 'semi-auto') {
    params.push('manual');
  }
  
  // Добавляем veryfying если требуется верификация
  if (conditionsLower.includes('kyc') || conditionsLower.includes('верификация') || conditionsLower.includes('документы')) {
    params.push('veryfying');
  }
  
  // Добавляем cardverify если требуется верификация карты
  if (conditionsLower.includes('верификация карты') || conditionsLower.includes('cardverify')) {
    params.push('cardverify');
  }
  
  // Добавляем reg если требуется регистрация
  if (conditionsLower.includes('регистрация') || conditionsLower.includes('аккаунт')) {
    params.push('reg');
  }
  
  // Добавляем juridical для переводов с юр.лица
  if (conditionsLower.includes('юридическое лицо') || conditionsLower.includes('ип') || conditionsLower.includes('juridical')) {
    params.push('juridical');
  }
  
  // Добавляем anonim если не требуются личные данные
  if (conditionsLower.includes('анонимно') || conditionsLower.includes('без документов') || conditionsLower.includes('anonim')) {
    params.push('anonim');
  }
  
  return params.join(',');
};

// Функция для получения города Exnode
const getExnodeCity = (conditions: string): string => {
  const conditionsLower = (conditions || '').toLowerCase();
  
  // Маппинг городов из условий в коды Exnode
  const cityMapping: { [key: string]: string } = {
    'москва': 'msk',
    'санкт-петербург': 'spb',
    'петербург': 'spb',
    'спб': 'spb',
    'калининград': 'klng',
    'екатеринбург': 'ekb',
    'новосибирск': 'nsk',
    'казань': 'kzn',
    'нижний новгород': 'nnov',
    'челябинск': 'chel',
    'омск': 'omsk',
    'самара': 'smr',
    'ростов-на-дону': 'rsnd',
    'уфа': 'ufa',
    'красноярск': 'krsk',
    'воронеж': 'voron',
    'пермь': 'perm',
    'волгоград': 'vlgd',
    'краснодар': 'krasn',
    'саратов': 'srt',
    'тюмень': 'tyum',
    'тольятти': 'tltt',
    'ижевск': 'izhv',
    'барнаул': 'brnl',
    'ульяновск': 'ulya',
    'иркутск': 'irk',
    'владивосток': 'vvo',
    'ярославль': 'yars',
    'хабаровск': 'khab',
    'махачкала': 'mhkl',
    'томск': 'tmsk',
    'оренбург': 'oren',
    'кемерово': 'kem',
    'рязань': 'rzn',
    'астрахань': 'astra',
    'пенза': 'penza',
    'липецк': 'lpt'
  };
  
  // Ищем город в условиях
  for (const [cityName, cityCode] of Object.entries(cityMapping)) {
    if (conditionsLower.includes(cityName)) {
      return cityCode;
    }
  }
  
  return '';
};

// Функция для форматирования числовых значений
const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(Number(value))) return '0';
  
  // Преобразуем в число и форматируем с точкой как разделителем
  const num = Number(value);
  
  // Избегаем научной нотации для больших и малых чисел
  if (num === 0) return '0';
  if (num >= 1e-8 && num < 1e15) {
    return num.toFixed(8).replace(/\.?0+$/, ''); // Убираем лишние нули
  }
  
  return num.toString();
};

// Функция для генерации XML фида
async function generateXML(): Promise<string> {
  // Проверяем доступность Supabase
  if (!isSupabaseAvailable()) {
    console.error('Supabase не настроен для Exnode фида');
    return '<?xml version="1.0" encoding="UTF-8"?>\n<error>Supabase не настроен</error>';
  }

  console.log('🔄 Генерация XML фида...');

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
    console.error('Ошибка при получении курсов для Exnode фида:', error);
    return '<?xml version="1.0" encoding="UTF-8"?>\n<error>Ошибка базы данных</error>';
  }

  if (!rates || rates.length === 0) {
    console.warn('Нет данных в таблице kenig_rates для Exnode фида');
    return '<?xml version="1.0" encoding="UTF-8"?>\n<rates></rates>';
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

  // Генерируем XML в формате Exnode
  const timestamp = new Date().toISOString();
  let xmlOutput = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Generated: ${timestamp} | Update interval: 5s -->\n<rates>\n`;

  activeExchanges.forEach(rate => {
    // Получаем коды валют для Exnode
    const fromCode = getExnodeCurrencyCode(rate.base, '', rate.conditions || '');
    const toCode = getExnodeCurrencyCode(rate.quote, '', rate.conditions || '');

    xmlOutput += `    <item>\n`;
    xmlOutput += `        <from>${escapeXml(fromCode)}</from>\n`;
    xmlOutput += `        <to>${escapeXml(toCode)}</to>\n`;

    // Курс обмена: in - сколько клиент отдает, out - сколько получает
    // Для направления BASE/QUOTE: клиент отдает 1 BASE, получает rate.sell QUOTE
    xmlOutput += `        <in>1</in>\n`;
    xmlOutput += `        <out>${formatNumber(rate.sell)}</out>\n`;

    // Резерв валюты to (которую получает клиент)
    xmlOutput += `        <amount>${formatNumber(rate.reserve)}</amount>\n`;

    // Минимальная и максимальная суммы в валюте from
    if (rate.min_amount && rate.min_amount > 0) {
      xmlOutput += `        <minamount>${formatNumber(rate.min_amount)}</minamount>\n`;
    }
    if (rate.max_amount && rate.max_amount > 0) {
      xmlOutput += `        <maxamount>${formatNumber(rate.max_amount)}</maxamount>\n`;
    }

    // Параметры (метки)
    const params = getExnodeParams(rate.operational_mode || '', rate.conditions || '');
    if (params) {
      xmlOutput += `        <param>${escapeXml(params)}</param>\n`;
    }

    // Город для наличных операций
    const city = getExnodeCity(rate.conditions || '');
    if (city) {
      xmlOutput += `        <city>${escapeXml(city)}</city>\n`;
    }

    xmlOutput += `    </item>\n`;
  });

  xmlOutput += '</rates>';

  console.log(`📤 Сгенерирован Exnode XML фид с ${activeExchanges.length} направлениями`);

  return xmlOutput;
}

// Функция для обновления кэша
async function updateCache() {
  // Если уже обновляется, пропускаем
  if (xmlCache.isUpdating) {
    console.log('⏭️ Пропускаем обновление: предыдущее еще выполняется');
    return;
  }

  try {
    xmlCache.isUpdating = true;
    const xml = await generateXML();

    // Проверяем результат генерации
    if (xml && !xml.includes('<error>')) {
      // Успешная генерация
      xmlCache.xml = xml;
      xmlCache.lastUpdate = new Date();
      xmlCache.lastError = null;
      console.log(`✅ Кэш обновлен: ${xmlCache.lastUpdate.toISOString()}`);
    } else {
      // Ошибка генерации - сохраняем ошибку и очищаем кэш
      const errorMessage = xml.includes('<error>')
        ? 'Ошибка генерации XML из базы данных'
        : 'Получен пустой XML';
      xmlCache.lastError = new Error(errorMessage);
      xmlCache.xml = ''; // Очищаем кэш
      console.error(`❌ ${errorMessage}`);
    }
  } catch (error) {
    console.error('❌ Ошибка при обновлении кэша:', error);
    xmlCache.lastError = error instanceof Error ? error : new Error(String(error));
    xmlCache.xml = ''; // Очищаем кэш при ошибке
  } finally {
    xmlCache.isUpdating = false;
  }
}

// Запускаем периодическое обновление кэша
let updateIntervalId: NodeJS.Timeout | null = null;

// Функция для инициализации автоматического обновления
function initializeAutoUpdate() {
  if (updateIntervalId) {
    return; // Уже запущено
  }

  console.log('🚀 Запуск автоматического обновления XML фида (каждые 5 секунд)');

  // Первое обновление сразу
  updateCache();

  // Затем каждые 5 секунд
  updateIntervalId = setInterval(() => {
    updateCache();
  }, UPDATE_INTERVAL);
}

// Инициализируем при загрузке модуля
initializeAutoUpdate();

export async function GET() {
  try {
    // Если кэш пустой, генерируем XML сразу (первый запрос)
    if (!xmlCache.xml) {
      console.log('📭 Кэш пустой, генерируем XML...');
      await updateCache();
    }

    // Если кэш все еще пустой после попытки генерации, возвращаем ошибку
    if (!xmlCache.xml) {
      const errorMessage = xmlCache.lastError
        ? xmlCache.lastError.message
        : 'Не удалось сгенерировать XML фид';

      const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>${escapeXml(errorMessage)}</message>
  <timestamp>${new Date().toISOString()}</timestamp>
</error>`;

      return new NextResponse(errorXml, {
        status: 503,
        headers: { 'Content-Type': 'application/xml; charset=utf-8' }
      });
    }

    // Возвращаем закэшированный XML с информацией об обновлении
    const timeSinceUpdate = Math.floor((Date.now() - xmlCache.lastUpdate.getTime()) / 1000);

    return new NextResponse(xmlCache.xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=5, must-revalidate',
        'Last-Modified': xmlCache.lastUpdate.toUTCString(),
        'X-Update-Interval': '5',
        'X-Time-Since-Update': timeSinceUpdate.toString()
      },
    });

  } catch (error) {
    console.error('❌ Ошибка в Exnode фиде:', error);

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