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

// Валидация email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Валидация номера телефона (базовая)
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Валидация криптовалютного адреса (базовая)
const isValidCryptoAddress = (address: string, currency: string): boolean => {
  if (!address || address.length < 10) return false;
  
  // Базовая валидация для разных криптовалют
  switch (currency.toUpperCase()) {
    case 'BTC':
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/.test(address);
    case 'ETH':
    case 'USDT':
    case 'USDC':
    case 'BNB':
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    case 'XRP':
      return /^r[0-9a-zA-Z]{24,34}$/.test(address);
    case 'ADA':
      return /^addr1[a-z0-9]{98}$|^[A-Za-z0-9]{59}$/.test(address);
    default:
      return address.length >= 10 && address.length <= 100;
  }
};

export async function POST(request: NextRequest) {
  try {
    // Проверяем доступность Supabase
    if (!isServerSupabaseConfigured()) {
      console.error('❌ Supabase не настроен для создания заявок');
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

    console.log('📝 [API] Получена заявка на обмен:', {
      fromCurrency,
      toCurrency,
      amountFrom,
      amountTo,
      exchangeRate,
      clientEmail: clientEmail ? `${clientEmail.substring(0, 3)}***@${clientEmail.split('@')[1]}` : 'не указан',
      clientPhone: clientPhone ? 'указан' : 'не указан',
      network,
      clientWalletAddress: clientWalletAddress ? 'указан' : 'не указан',
      clientBankDetails: clientBankDetails ? 'указаны' : 'не указаны',
      fullName: fullName ? 'указано' : 'не указано'
    });

    // Валидация обязательных полей
    const errors: string[] = [];

    if (!fromCurrency || typeof fromCurrency !== 'string') {
      errors.push('Не указана валюта отправления');
    }

    if (!toCurrency || typeof toCurrency !== 'string') {
      errors.push('Не указана валюта получения');
    }

    if (!amountFrom || typeof amountFrom !== 'number' || amountFrom <= 0) {
      errors.push('Некорректная сумма отправления');
    }

    if (!amountTo || typeof amountTo !== 'number' || amountTo <= 0) {
      errors.push('Некорректная сумма получения');
    }

    if (!exchangeRate || typeof exchangeRate !== 'number' || exchangeRate <= 0) {
      errors.push('Некорректный курс обмена');
    }

    if (!clientEmail || !isValidEmail(clientEmail)) {
      errors.push('Некорректный email адрес');
    }
    
    if (!fullName || fullName.trim().length < 2) {
      errors.push('Введите корректное ФИО (минимум 2 символа)');
    }

    // Валидация номера телефона (если указан)
    if (clientPhone && !isValidPhone(clientPhone)) {
      errors.push('Некорректный номер телефона');
    }

    // Валидация адреса кошелька (если получаем криптовалюту)
    const cryptoCurrencies = ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'ADA', 'DOT', 'SOL', 'XRP', 'DOGE', 'SHIB', 'LTC', 'LINK', 'UNI', 'ATOM', 'XLM', 'TRX', 'FIL', 'NEAR'];
    if (cryptoCurrencies.includes(toCurrency.toUpperCase())) {
      if (!clientWalletAddress || !isValidCryptoAddress(clientWalletAddress, toCurrency)) {
        errors.push(`Некорректный адрес кошелька для ${toCurrency}`);
      }
      
      if (!network || !['ERC20', 'TRC20', 'BEP20'].includes(network.toUpperCase())) {
        errors.push('Выберите корректную сеть (ERC20, TRC20 или BEP20)');
      }
    }

    // Валидация банковских реквизитов (если получаем фиат)
    if (toCurrency.toUpperCase() === 'RUB') {
      if (!clientBankDetails || clientBankDetails.length < 10) {
        errors.push('Укажите банковские реквизиты для получения рублей');
      }
    }

    // Проверяем минимальные суммы
    const minAmounts: { [key: string]: number } = {
      'USDT': 100,
      'BTC': 0.001,
      'ETH': 0.01,
      'RUB': 10000
    };

    const minAmount = minAmounts[fromCurrency.toUpperCase()] || 10;
    if (amountFrom < minAmount) {
      errors.push(`Минимальная сумма для ${fromCurrency}: ${minAmount}`);
    }

    if (errors.length > 0) {
      console.warn('⚠️ [API] Ошибки валидации заявки:', errors);
      return NextResponse.json(
        { 
          error: 'Ошибки валидации',
          details: errors
        },
        { status: 400 }
      );
    }

    // Получаем текущего пользователя (если авторизован)
    const supabase = getServerSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.warn('⚠️ [API] Ошибка получения пользователя:', userError);
    }

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
      full_name: fullName,
      network: network || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('💾 [API] Данные для вставки в БД:', {
      ...orderData,
      client_email: orderData.client_email ? `${orderData.client_email.substring(0, 3)}***@${orderData.client_email.split('@')[1]}` : 'не указан'
    });

    console.log('💾 [API] Сохранение заявки в базу данных...');

    // Вставляем заявку в базу данных
    const { data: insertedOrder, error: insertError } = await supabase
      .from('exchange_orders')
      .insert([orderData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ [API] Ошибка при сохранении заявки:', insertError);
      console.error('❌ [API] Детали ошибки Supabase:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
      return NextResponse.json(
        { 
          error: 'Ошибка сохранения заявки',
          message: `Ошибка базы данных: ${insertError.message}`,
          details: insertError.message,
          code: insertError.code
        },
        { status: 500 }
      );
    }

    console.log('✅ [API] Заявка успешно создана:', insertedOrder.id);

    // Возвращаем успешный ответ
    return NextResponse.json({
      success: true,
      message: 'Заявка успешно создана',
      orderId: insertedOrder.id,
      order: {
        id: insertedOrder.id,
        fromCurrency: insertedOrder.from_currency,
        toCurrency: insertedOrder.to_currency,
        amountFrom: insertedOrder.amount_from,
        amountTo: insertedOrder.amount_to,
        status: insertedOrder.status,
        createdAt: insertedOrder.created_at
      }
    });

  } catch (error) {
    console.error('❌ [API] Неожиданная ошибка в API заявок:', error);
    
    return NextResponse.json(
      { 
        error: 'Внутренняя ошибка сервера',
        message: 'Произошла неожиданная ошибка. Попробуйте позже.'
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

    // Получаем текущего пользователя
    const supabase = getServerSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    // Получаем заявки пользователя
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