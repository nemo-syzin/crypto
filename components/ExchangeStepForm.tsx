"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/SupabaseAuthProvider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ExchangeStepForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Данные обмена
  const [fromCurrency, setFromCurrency] = useState("USDT");
  const [toCurrency, setToCurrency] = useState("RUB");
  const [fromAmount, setFromAmount] = useState("1");
  const [toAmount, setToAmount] = useState("83.21"); // подтягивается из калькулятора

  // Данные клиента
  const [network, setNetwork] = useState("trc20");
  const [wallet, setWallet] = useState("");
  const [fio, setFio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bank, setBank] = useState("");

  // Валидация формы
  const validateForm = () => {
    const errors: string[] = [];

    if (!fio.trim()) errors.push("Введите ФИО");
    if (!email.trim()) errors.push("Введите email");
    if (!email.includes("@")) errors.push("Введите корректный email");
    
    // Валидация в зависимости от типа валют
    const cryptoCurrencies = ['USDT', 'BTC', 'ETH', 'BNB', 'ADA', 'SOL'];
    
    if (cryptoCurrencies.includes(toCurrency) && !wallet.trim()) {
      errors.push("Введите адрес кошелька для получения криптовалюты");
    }
    
    if (toCurrency === 'RUB' && !bank.trim()) {
      errors.push("Введите банковские реквизиты для получения рублей");
    }

    if (cryptoCurrencies.includes(fromCurrency) && !network) {
      errors.push("Выберите сеть для отправки криптовалюты");
    }

    return errors;
  };

  const handleConfirm = async () => {
    // Валидация формы
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast({
        title: "Ошибки в форме",
        description: validationErrors.join(", "),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Подготавливаем данные для отправки
      const orderData = {
        fromCurrency,
        toCurrency,
        amountFrom: parseFloat(fromAmount),
        amountTo: parseFloat(toAmount),
        exchangeRate: parseFloat(toAmount) / parseFloat(fromAmount),
        clientEmail: email,
        clientPhone: phone || null,
        clientWalletAddress: wallet || null,
        clientBankDetails: bank || null,
        network: network || null,
      };

      console.log("Отправка заявки:", orderData);

      // Отправляем заявку на сервер
      const response = await fetch('/api/exchange-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Ошибка создания заявки');
      }

      console.log("Заявка успешно создана:", result);

      toast({
        title: "Заявка создана!",
        description: `Заявка №${result.orderId} успешно создана. Мы свяжемся с вами в ближайшее время.`,
      });

      setStep(3);
    } catch (error) {
      console.error('Ошибка создания заявки:', error);
      
      let errorMessage = 'Не удалось создать заявку. Попробуйте позже.';
      
      if (error instanceof Error) {
        if (error.message.includes('validation')) {
          errorMessage = 'Проверьте правильность заполнения всех полей';
        } else if (error.message.includes('network')) {
          errorMessage = 'Ошибка сети. Проверьте подключение к интернету';
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Ошибка создания заявки",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-10 text-center">
      {/* === Шаг 1: Калькулятор === */}
      {step === 1 && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold">Конвертер и калькулятор криптовалют</h2>
          <p className="text-gray-500">
            {fromCurrency} в {toCurrency}: 1 {fromCurrency} конвертируется в {toAmount}{" "}
            {toCurrency} по состоянию на {new Date().toLocaleString("ru-RU")}
          </p>

          {/* Поле 1 */}
          <div className="flex gap-3">
            <Input
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1 h-14 text-xl rounded-full border-gray-300"
            />
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="w-[120px] h-14 text-xl rounded-full border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Поле 2 */}
          <div className="flex gap-3">
            <Input
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              className="flex-1 h-14 text-xl rounded-full border-gray-300"
            />
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="w-[120px] h-14 text-xl rounded-full border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RUB">RUB</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="BTC">BTC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Кнопка */}
          <button
            onClick={() => setStep(2)}
            className="w-full h-14 bg-[#0052FF] hover:bg-[#0041CC] text-white text-lg font-semibold rounded-full transition"
          >
            Оставить заявку на обмен
          </button>
        </div>
      )}

      {/* === Шаг 2: Форма заявки === */}
      {step === 2 && (
        <div className="space-y-6 bg-white shadow-md rounded-2xl p-6 text-left">
          <h2 className="text-2xl font-bold text-center">Заполните заявку</h2>

          <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-1">
            <p>
              Отдаёте: <strong>{fromAmount} {fromCurrency}</strong>
            </p>
            <p>
              Получаете: <strong>{toAmount} {toCurrency}</strong>
            </p>
          </div>

          <Select value={network} onValueChange={setNetwork}>
            <SelectTrigger className="h-12 rounded-full border-gray-300">
              <SelectValue placeholder="Сеть" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trc20">TRC20</SelectItem>
              <SelectItem value="erc20">ERC20</SelectItem>
              <SelectItem value="bep20">BEP20</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="Адрес кошелька" value={wallet} onChange={(e) => setWallet(e.target.value)} className="h-12 rounded-full" />
          <Input placeholder="ФИО" value={fio} onChange={(e) => setFio(e.target.value)} className="h-12 rounded-full" />
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-full" />
          <Input placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12 rounded-full" />
          <Input placeholder="Банковские реквизиты для получения" value={bank} onChange={(e) => setBank(e.target.value)} className="h-12 rounded-full" />

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 h-12 border rounded-full"
            >
              Назад
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 h-12 bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Создание заявки..." : "Подтвердить заявку"}
            </button>
          </div>
        </div>
      )}

      {/* === Шаг 3: Подтверждение === */}
      {step === 3 && (
        <div className="text-center space-y-6 p-6 bg-green-50 rounded-2xl">
          <h2 className="text-2xl font-bold text-green-700">✅ Заявка создана!</h2>
          <p className="text-gray-700">
            Наш менеджер свяжется с вами для подтверждения деталей.
          </p>
          <button
            onClick={() => setStep(1)}
            className="px-6 py-3 bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-full"
          >
            Создать новую заявку
          </button>
        </div>
      )}
    </div>
  );
}