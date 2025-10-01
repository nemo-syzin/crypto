import { NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 [API] Получены данные заявки:", body);

    const supabase = getServerSupabaseClient({ useServiceRole: true });

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

    const { data, error } = await supabase
      .from("exchange_orders")
      .insert([orderData])
      .select("id")
      .single();

    if (error) {
      console.error("❌ [API] Ошибка вставки:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    console.log("✅ [API] Заявка сохранена:", data);
    return NextResponse.json({ success: true, orderId: data.id });
  } catch (err: any) {
    console.error("❌ [API] Общая ошибка:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal error" },
      { status: 500 }
    );
  }
}