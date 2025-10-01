export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient, isServerSupabaseConfigured } from '@/lib/supabase/server';

interface ExchangeOrderData {
  fromCurrency: string;
  toCurrency: string;
  amountFrom: number;
  amountTo: number;
  exchangeRate: number;
  clientEmail: string;
  clientPhone?: string;
  clientWalletAddress?: string;
  clientBankDetails?: string;
  network?: string;
  fullName: string;
}

export async function POST(request: NextRequest) {
  console.log('🚀 [API] POST /api/exchange-orders - начало обработки');
  
  try {
    // Проверяем доступность Supabase
    if (!isServerSupabaseConfigured()) {
      console.error('❌ [API] Supabase не настроен');
      return NextResponse.json(
        { 
          error: 'Сервис временно недоступен',
          message: 'База данных не настроена. Обратитесь к администратору.'
        },
        { status: 503 }
      );
    }

    // Получаем данные из запроса
    const body = await request.json();
    console.log('📝 [API] Получены данные:', {
      ...body,
      clientEmail: body.clientEmail ? `${body.clientEmail.substring(0, 3)}***@${body.clientEmail.split('@')[1]}` : 'не указан'
    });

    const {
      fromCurrency,
      toCurrency,
      amountFrom,
      amountTo,
      exchangeRate,
      clientEmail,
      clientPhone,
      clientWalletAddress,
      clientBankDetails,
      network,
      fullName
    }: ExchangeOrderData = body;

    // Простая валидация как в вашем примере
    if (!clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      console.warn('⚠️ [API] Некорректный email:', clientEmail);
      return NextResponse.json({ message: "Некорректный email" }, { status: 400 });
    }
    
    if (!amountFrom || !amountTo || amountFrom <= 0 || amountTo <= 0) {
      console.warn('⚠️ [API] Некорректные суммы:', { amountFrom, amountTo });
      return NextResponse.json({ message: "Некорректные суммы" }, { status: 400 });
    }
    
    if (!fromCurrency || !toCurrency) {
      console.warn('⚠️ [API] Не выбраны валюты:', { fromCurrency, toCurrency });
      return NextResponse.json({ message: "Не выбраны валюты" }, { status: 400 });
    }

    if (!fullName || fullName.trim().length < 2) {
      console.warn('⚠️ [API] Некорректное ФИО:', fullName);
      return NextResponse.json({ message: "Введите корректное ФИО" }, { status: 400 });
    }

    // Получаем клиент Supabase
    const supabase = getServerSupabaseClient();
    console.log('🔗 [API] Supabase клиент создан');

    // Получаем текущего пользователя (если авторизован)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.warn('⚠️ [API] Ошибка получения пользователя:', userError);
    }
    console.log('👤 [API] Пользователь:', user ? `ID: ${user.id}` : 'анонимный');

    // Подготавливаем данные для вставки
    const orderData = {
      user_id: user?.id || null,
      status: 'pending',
      from_currency: fromCurrency.toUpperCase(),
      to_currency: toCurrency.toUpperCase(),
      amount_from: amountFrom,
      amount_to: amountTo,
      exchange_rate: exchangeRate,
      client_email: clientEmail.toLowerCase(),
      client_phone: clientPhone || null,
      client_wallet_address: clientWalletAddress || null,
      client_bank_details: clientBankDetails || null,
      network: network || null,
      full_name: fullName
    };

    console.log('💾 [API] Данные для вставки:', {
      ...orderData,
      client_email: orderData.client_email ? `${orderData.client_email.substring(0, 3)}***@${orderData.client_email.split('@')[1]}` : 'не указан'
    });

    // Вставляем заявку в базу данных
    console.log('💾 [API] Вставляем заявку в БД...');
    const { data: insertedOrder, error: insertError } = await supabase
      .from('exchange_orders')
      .insert([orderData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ [API] Ошибка Supabase при вставке:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
      return NextResponse.json(
        { 
          message: "Ошибка записи в БД", 
          details: insertError.message,
          code: insertError.code
        }, 
        { status: 500 }
      );
    }

    console.log('✅ [API] Заявка успешно создана:', insertedOrder.id);

    return NextResponse.json({ 
      success: true, 
      orderId: insertedOrder.id, 
      order: insertedOrder 
    });

  } catch (err: any) {
    console.error('❌ [API] Неожиданная ошибка:', err);
    return NextResponse.json(
      { 
        message: "Ошибка сервера", 
        details: err.message 
      }, 
      { status: 500 }
    );
  }
}

// GET метод для получения заявок пользователя
export async function GET(request: NextRequest) {
  try {
    if (!isServerSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Сервис временно недоступен' },
        { status: 503 }
      );
    }

    const supabase = getServerSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const { data: orders, error: ordersError } = await supabase
      .from('exchange_orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('❌ Ошибка при получении заявок:', ordersError);
      return NextResponse.json(
        { error: 'Ошибка получения заявок' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: orders || []
    });

  } catch (error) {
    console.error('❌ [API] Ошибка в GET /api/exchange-orders:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}