import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

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
      client_email: body.clientEmail,
      client_phone: body.clientPhone || null,
      client_wallet_address: body.clientWalletAddress || null,
      client_bank_details: body.clientBankDetails || null,
      network: body.network || null,
      full_name: body.fullName || null,
    };

    console.log("📝 [API] Подготовленные данные для БД:", orderData);

    const { data, error } = await supabaseAdmin
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