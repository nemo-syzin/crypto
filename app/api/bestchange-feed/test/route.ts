export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

// Тестовый API для проверки данных BestChange фида в JSON формате
export async function GET() {
  try {
    console.log('🔧 Тестовый эндпоинт BestChange фида');
    console.log('📊 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('🔑 Supabase Key присутствует:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    console.log('✅ Supabase доступен');
    console.log('🔄 Тестирование данных для BestChange фида...');

    const supabase = supabaseServer();

    // Получаем все данные из kenig_rates
    const { data: rates, error } = await supabase
      .from('kenig_rates')
      .select(`
        source,
        from_currency,
        to_currency,
        sell,
        buy,
        minamount,
        maxamount,
        reserve,
        operational_mode,
        working_hours,
        is_active,
        conditions,
        exchange_source,
        updated_at
      `)
      .not('from_currency', 'is', null)
      .not('to_currency', 'is', null)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Ошибка запроса к базе данных:', error);
      return NextResponse.json({
        error: 'Ошибка базы данных',
        details: error.message,
        code: error.code,
        hint: error.hint,
        help: 'Проверьте, что таблица kenig_rates существует в базе данных'
      }, { status: 500 });
    }

    if (!rates || rates.length === 0) {
      console.warn('⚠️ Таблица kenig_rates пуста');
      return NextResponse.json({
        message: 'Нет данных в таблице kenig_rates',
        total_records: 0,
        active_records: 0,
        help: 'Добавьте данные в таблицу kenig_rates через панель администратора или API'
      });
    }

    console.log(`✅ Найдено ${rates.length} записей`);

    // Применяем ту же логику фильтрации, что и в основном фиде
    const activeExchanges = rates.filter(rate => {
      if (rate.is_active === false) return false;
      if (!rate.reserve || rate.reserve <= 0) return false;
      if (!rate.sell || rate.sell <= 0) return false;
      return true;
    });

    // Группируем данные для анализа
    const summary = {
      total_records: rates.length,
      active_records: activeExchanges.length,
      inactive_records: rates.length - activeExchanges.length,
      sources: [...new Set(rates.map(r => r.source))],
      currencies: {
        from: [...new Set(rates.map(r => r.from_currency))],
        to: [...new Set(rates.map(r => r.to_currency))]
      },
      operational_modes: [...new Set(rates.map(r => r.operational_mode))],
      sample_active_exchanges: activeExchanges.slice(0, 5).map(rate => ({
        pair: `${rate.from_currency}/${rate.to_currency}`,
        source: rate.source,
        from_currency: rate.from_currency,
        to_currency: rate.to_currency,
        sell: rate.sell,
        buy: rate.buy,
        minamount: rate.minamount,
        maxamount: rate.maxamount,
        reserve: rate.reserve,
        operational_mode: rate.operational_mode,
        is_active: rate.is_active,
        conditions: rate.conditions
      }))
    };

    console.log('✅ Тест завершен успешно');

    return NextResponse.json({
      status: 'success',
      message: 'Данные для BestChange фида получены успешно',
      summary,
      xml_feed_url: '/api/bestchange-feed',
      instructions: [
        '1. Проверьте данные выше',
        '2. Откройте /api/bestchange-feed для просмотра XML',
        '3. Убедитесь, что XML валиден',
        '4. Предоставьте URL BestChange после развертывания'
      ]
    });

  } catch (error) {
    console.error('Ошибка в тестовом API BestChange фида:', error);
    return NextResponse.json({ 
      error: 'Внутренняя ошибка сервера',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 });
  }
}