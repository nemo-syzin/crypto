"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useBaseAssets, useQuoteAssets } from "@/hooks/useAssets";

export default function ExchangeStepForm() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [fromAmount, setFromAmount] = useState("1");
  const [toAmount, setToAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USDT");
  const [toCurrency, setToCurrency] = useState("RUB");
  const [activeInput, setActiveInput] = useState<"give" | "receive">("give");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Данные клиента
  const [network, setNetwork] = useState("trc20");
  const [wallet, setWallet] = useState("");
  const [fio, setFio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bank, setBank] = useState("");

  // Хуки для получения данных
  const { bases, loading: basesLoading, error: basesError } = useBaseAssets();
  const { quotes, loading: quotesLoading, error: quotesError } = useQuoteAssets(fromCurrency);
  const { rate, source, lastUpdated, loading: rateLoading, error: rateError, refetch } = useExchangeRate(fromCurrency, toCurrency);

  // Пересчёт при изменении курса или сумм
  useEffect(() => {
    if (!rate || rate <= 0) {
      if (activeInput === "give") {
        setToAmount("");
      } else {
        setFromAmount("");
      }
      return;
    }

    if (activeInput === "give" && fromAmount) {
      const numAmount = parseFloat(fromAmount);
      if (!isNaN(numAmount) && numAmount > 0) {
        const result = numAmount * rate;
        setToAmount(result.toFixed(2));
      } else {
        setToAmount("");
      }
    } else if (activeInput === "receive" && toAmount) {
      const numAmount = parseFloat(toAmount);
      if (!isNaN(numAmount) && numAmount > 0) {
        const result = numAmount / rate;
        setFromAmount(result.toFixed(6));
      } else {
        setFromAmount("");
      }
    }
  }, [rate, fromAmount, toAmount, activeInput]);

  // Смена направления обмена
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setActiveInput(activeInput === "give" ? "receive" : "give");
  };

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

  // Обработка отправки заявки
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

    if (!fromAmount || !toAmount || !rate) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля для создания заявки",
        variant: "destructive",
      });
      return;
    }

    const numFromAmount = parseFloat(fromAmount);
    const numToAmount = parseFloat(toAmount);

    if (isNaN(numFromAmount) || isNaN(numToAmount) || numFromAmount <= 0 || numToAmount <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректные суммы для обмена",
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
        amountFrom: numFromAmount,
        amountTo: numToAmount,
        exchangeRate: rate,
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

  // Обработка ошибок загрузки
  useEffect(() => {
    if (basesError) {
      toast({
        title: "Ошибка загрузки валют",
        description: basesError,
        variant: "destructive",
      });
    }
    if (quotesError) {
      toast({
        title: "Ошибка загрузки валют",
        description: quotesError,
        variant: "destructive",
      });
    }
    if (rateError) {
      toast({
        title: "Ошибка загрузки курса",
        description: rateError,
        variant: "destructive",
      });
    }
  }, [basesError, quotesError, rateError, toast]);

  return (
    <div className="w-full max-w-2xl mx-auto py-10 text-center">
      {/* === Шаг 1: Калькулятор === */}
      {step === 1 && (
        <div className="space-y-8">
          <h2 className="text-3xl font-bold">Конвертер и калькулятор криптовалют</h2>
          <p className="text-gray-500">
            {fromCurrency} в {toCurrency}: 1 {fromCurrency} конвертируется в{" "}
            {rate ? rate.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}{" "}
            {toCurrency} по состоянию на{" "}
            {lastUpdated ? lastUpdated.toLocaleString("ru-RU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
          </p>

          {/* Основной контейнер */}
          <div className="flex items-center gap-4 w-full max-w-2xl mx-auto">
            {/* Отдаёте */}
            <div className="flex flex-1 border border-gray-300 rounded-full px-6 py-3 items-center h-[60px]">
              <Input
                type="text"
                value={fromAmount}
                onChange={(e) => {
                  setFromAmount(e.target.value);
                  setActiveInput("give");
                }}
                className="flex-1 border-0 shadow-none focus-visible:ring-0 text-2xl font-medium bg-transparent rounded-full px-6"
                placeholder="0"
                disabled={rateLoading}
              />
              <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={basesLoading}>
                <SelectTrigger className="w-[100px] border-0 focus:ring-0 font-medium text-lg bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bases.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Кнопка swap */}
            <button
              onClick={swapCurrencies}
              disabled={rateLoading}
              className="p-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition disabled:opacity-50"
            >
              <ArrowLeftRight className="w-5 h-5 text-gray-600" />
            </button>

            {/* Получаете */}
            <div className="flex flex-1 border border-gray-300 rounded-full px-6 py-3 items-center h-[60px]">
              <Input
                type="text"
                value={toAmount}
                onChange={(e) => {
                  setToAmount(e.target.value);
                  setActiveInput("receive");
                }}
                className="flex-1 border-0 shadow-none focus-visible:ring-0 text-2xl font-medium bg-transparent rounded-full px-6"
                placeholder="0"
                disabled={rateLoading}
              />
              <Select value={toCurrency} onValueChange={setToCurrency} disabled={quotesLoading}>
                <SelectTrigger className="w-[100px] border-0 focus:ring-0 font-medium text-lg bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {quotes.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Кнопка создания заявки */}
          <button
            onClick={() => setStep(2)}
            disabled={!rate || rateLoading}
            className="w-full h-14 bg-[#0052FF] hover:bg-[#0041CC] text-white text-lg font-semibold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
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