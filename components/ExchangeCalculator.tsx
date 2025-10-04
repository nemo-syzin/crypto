{/* === Шаг 1: Калькулятор === */}
{step === 1 && (
  <div className="w-full max-w-3xl mx-auto">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold mb-4">Конвертер и калькулятор криптовалют</h1>
      <p className="text-gray-600">
        {fromCurrency} в {toCurrency}: 1 {fromCurrency} конвертируется в{" "}
        {rate ? rate.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"} {toCurrency}
      </p>
    </div>

    <div className="space-y-6">
      {/* Отдаёте */}
      <div className="flex items-center rounded-full border border-gray-300 px-6 py-4 h-[72px] bg-white shadow-sm">
        <Input
          type="text"
          value={fromAmount}
          onChange={(e) => {
            setFromAmount(e.target.value);
            setActiveInput("give");
          }}
          className="flex-1 border-0 shadow-none focus-visible:ring-0 text-2xl font-semibold bg-transparent rounded-full"
          placeholder="0"
          disabled={rateLoading}
        />
        <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={basesLoading}>
          <SelectTrigger className="w-[120px] border-0 focus:ring-0 text-lg font-medium bg-transparent">
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

      {/* swap button */}
      <div className="flex justify-center">
        <button
          onClick={swapCurrencies}
          disabled={rateLoading}
          className="p-3 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition disabled:opacity-50"
        >
          <ArrowLeftRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Получаете */}
      <div className="flex items-center rounded-full border border-gray-300 px-6 py-4 h-[72px] bg-white shadow-sm">
        <Input
          type="text"
          value={toAmount}
          onChange={(e) => {
            setToAmount(e.target.value);
            setActiveInput("receive");
          }}
          className="flex-1 border-0 shadow-none focus-visible:ring-0 text-2xl font-semibold bg-transparent rounded-full"
          placeholder="0"
          disabled={rateLoading}
        />
        <Select value={toCurrency} onValueChange={setToCurrency} disabled={quotesLoading}>
          <SelectTrigger className="w-[120px] border-0 focus:ring-0 text-lg font-medium bg-transparent">
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

      {/* Информация о курсе */}
      {rate && (
        <div className="bg-gray-50 p-4 rounded-xl text-center text-gray-700">
          <div className="text-lg font-medium">
            1 {fromCurrency} = {rate.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {toCurrency}
          </div>
          <div className="text-sm text-gray-500">Актуальный курс обмена</div>
        </div>
      )}

      {/* Кнопка */}
      <button
        onClick={() => setStep(2)}
        disabled={!rate || rateLoading}
        className="w-full h-14 text-lg bg-[#0052FF] hover:bg-[#0041cc] text-white font-semibold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        Оставить заявку на обмен
      </button>
    </div>
  </div>
)}