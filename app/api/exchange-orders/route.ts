import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 [API] Получены данные заявки:", body);

    const orderData = {
      from_currency: body.fromCurrency,
      to_currency: body.toCurrency,
      amount_from: body.amountFrom,
      amount_to: body.amountTo,
      exchange_rate: body.exchangeRate,
      full_name: body.fullName,
      client_email: body.clientEmail,
      client_phone: body.clientPhone,
      client_telegram: body.clientTelegram,
      client_wallet_address: body.clientWalletAddress || null,
      network: body.network || null,
    };

    console.log("📝 [API] Подготовленные данные для БД:", orderData);

    const { data, error } = await supabaseServer()
      .from('exchange_orders')
      .insert([orderData])
      .select('id')
      .single();

    if (error) {
      console.error('❌ [API] Ошибка вставки:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("✅ [API] Заявка сохранена с ID:", data.id);
    return NextResponse.json({ success: true, orderId: data.id });
  } catch (err: any) {
    console.error("❌ [API] Общая ошибка:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}