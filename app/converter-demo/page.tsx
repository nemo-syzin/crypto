import ProfessionalConverter from "@/components/home/ProfessionalConverter";

export const metadata = {
  title: "Конвертер Криптовалют - KenigSwap",
  description: "Профессиональный конвертер и калькулятор криптовалют с актуальными курсами обмена",
};

export default function ConverterDemoPage() {
  return (
    <main className="min-h-screen">
      <ProfessionalConverter />
    </main>
  );
}
