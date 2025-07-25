'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Check, Star, Zap, Shield, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Динамический импорт 3D-фона с отключенным SSR для улучшения производительности
const UnifiedVantaBackground = dynamic(
  () => import('@/components/shared/UnifiedVantaBackground').then(mod => ({ default: mod.UnifiedVantaBackground })),
  { 
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50" />
  }
);

const plans = [
  {
    name: 'Базовый',
    price: '0',
    period: 'навсегда',
    description: 'Идеально для начинающих трейдеров',
    features: [
      'Комиссия 0.5% за обмен',
      'Доступ к основным парам',
      'Базовая поддержка',
      'Лимит 1000$ в день',
      'Стандартная скорость обработки'
    ],
    limitations: [
      'Ограниченный выбор валют',
      'Стандартные курсы'
    ],
    popular: false,
    icon: Users,
    color: 'from-gray-500 to-gray-600'
  },
  {
    name: 'Профессиональный',
    price: '29',
    period: 'в месяц',
    description: 'Для активных трейдеров и инвесторов',
    features: [
      'Комиссия 0.3% за обмен',
      'Доступ ко всем парам',
      'Приоритетная поддержка',
      'Лимит 10,000$ в день',
      'Быстрая обработка транзакций',
      'Расширенная аналитика',
      'API доступ'
    ],
    limitations: [],
    popular: true,
    icon: TrendingUp,
    color: 'from-blue-500 to-purple-600'
  },
  {
    name: 'Корпоративный',
    price: '99',
    period: 'в месяц',
    description: 'Для бизнеса и крупных операций',
    features: [
      'Комиссия 0.1% за обмен',
      'Все доступные пары',
      'Персональный менеджер',
      'Безлимитные операции',
      'Мгновенная обработка',
      'Полная аналитика и отчеты',
      'Расширенный API',
      'Белый лейбл решения',
      'Кастомная интеграция'
    ],
    limitations: [],
    popular: false,
    icon: Shield,
    color: 'from-purple-500 to-pink-600'
  }
];

const features = [
  {
    title: 'Безопасность превыше всего',
    description: 'Многоуровневая защита и холодное хранение средств',
    icon: Shield
  },
  {
    title: 'Мгновенные операции',
    description: 'Быстрое исполнение сделок и моментальные переводы',
    icon: Zap
  },
  {
    title: 'Лучшие курсы',
    description: 'Конкурентные курсы обмена и минимальные спреды',
    icon: Star
  }
];

export function PricingPageClient() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">
            Прозрачное ценообразование
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Выберите план,
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}который подходит вам
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Начните с бесплатного плана или выберите профессиональное решение 
            для максимальной выгоды от торговли криптовалютами
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Ежемесячно
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Ежегодно
            </span>
            {billingCycle === 'yearly' && (
              <Badge className="bg-green-100 text-green-800">
                Скидка 20%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const yearlyPrice = plan.price === '0' ? '0' : Math.round(parseInt(plan.price) * 12 * 0.8).toString();
              const displayPrice = billingCycle === 'yearly' && plan.price !== '0' ? yearlyPrice : plan.price;
              const displayPeriod = billingCycle === 'yearly' && plan.price !== '0' ? 'в год' : plan.period;
              
              return (
                <Card 
                  key={index} 
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    plan.popular 
                      ? 'ring-2 ring-blue-500 shadow-xl scale-105' 
                      : 'hover:shadow-lg'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                      Самый популярный
                    </div>
                  )}
                  
                  <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-8'}`}>
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {displayPrice === '0' ? 'Бесплатно' : `$${displayPrice}`}
                      </span>
                      {displayPrice !== '0' && (
                        <span className="text-gray-600 ml-2">
                          {displayPeriod}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-6 pb-8">
                    <Button 
                      className={`w-full mb-6 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.price === '0' ? 'Начать бесплатно' : 'Выбрать план'}
                    </Button>
                    
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start gap-3 opacity-60">
                          <div className="w-5 h-5 mt-0.5 flex-shrink-0 flex items-center justify-center">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          </div>
                          <span className="text-gray-600 text-sm">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Почему выбирают KenigSwap?
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Мы предоставляем надежную платформу для обмена криптовалют 
            с лучшими условиями на рынке
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Часто задаваемые вопросы
          </h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Можно ли изменить план в любое время?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Да, вы можете повысить или понизить свой план в любое время. 
                  Изменения вступают в силу немедленно, а оплата пересчитывается пропорционально.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Есть ли скрытые комиссии?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Нет, все комиссии указаны прозрачно. Единственная комиссия - это процент за обмен, 
                  который зависит от выбранного плана.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Как работает бесплатный план?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Бесплатный план позволяет совершать обмены с комиссией 0.5% и дневным лимитом 1000$. 
                  Никаких скрытых платежей или ограничений по времени использования.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Готовы начать торговлю?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Присоединяйтесь к тысячам пользователей, которые уже выбрали KenigSwap
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Начать бесплатно
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Связаться с нами
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}