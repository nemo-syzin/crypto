"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { 
  Shield,
  FileText,
  Users,
  Eye,
  AlertTriangle,
  CheckCircle,
  Globe,
  Building2,
  Scale,
  Lock,
  Search,
  BookOpen,
  Gavel,
  UserCheck,
  Activity,
  Database,
  AlertCircle,
  Settings,
  Target,
  Zap
} from 'lucide-react';
import { UnifiedVantaBackground } from '@/components/shared/UnifiedVantaBackground';

export function AmlKycPolicyClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Мемоизируем содержание для оптимизации
  const tableOfContentsItems = useMemo(() => [
    { id: 'introduction', title: 'Цели политики и общие положения', icon: <Target className="h-4 w-4" /> },
    { id: 'definitions', title: 'Определения противоправных действий', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'compliance', title: 'Выполнение требований законодательства', icon: <Scale className="h-4 w-4" /> },
    { id: 'internal-control', title: 'Система внутреннего контроля', icon: <Settings className="h-4 w-4" /> },
    { id: 'compliance-officer', title: 'Сотрудник по соблюдению требований', icon: <UserCheck className="h-4 w-4" /> },
    { id: 'training', title: 'Обучение и информирование персонала', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'kyc-procedures', title: 'Процедуры проверки клиентов (KYC)', icon: <Users className="h-4 w-4" /> },
    { id: 'monitoring', title: 'Мониторинг транзакций', icon: <Activity className="h-4 w-4" /> },
    { id: 'reporting', title: 'Отчётность и хранение данных', icon: <Database className="h-4 w-4" /> },
    { id: 'audit', title: 'Внутренний аудит AML/CTF', icon: <Search className="h-4 w-4" /> },
    { id: 'due-diligence', title: 'Применение мер due diligence', icon: <Eye className="h-4 w-4" /> },
    { id: 'violations', title: 'Меры при выявлении нарушений', icon: <AlertCircle className="h-4 w-4" /> }
  ], []);

  // Упрощенные варианты анимации для лучшей производительности
  const fadeInVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const slideUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Упрощенный фон для лучшей производительности */}
      <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/5 to-blue-100/10">
        <div className="absolute inset-0 opacity-10">
          <UnifiedVantaBackground 
            type="dots"
            color={0x94bdff}
            backgroundColor={0xffffff}
            size={1}
            spacing={30}
            showLines={false}
            mouseControls={false}
            touchControls={false}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            
            {/* Упрощенный заголовок */}
            <motion.div
              variants={fadeInVariant}
              initial="hidden"
              animate="visible"
              className="text-center mb-12"
            >
              <Badge className="bg-[#001D8D]/10 text-[#001D8D] border-[#001D8D]/20 px-6 py-2 text-lg mb-6">
                <Shield className="h-5 w-5 mr-2" />
                Политика AML/CTF и KYC
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#001D8D]">
                Политика противодействия отмыванию денег и финансированию терроризма
              </h1>
              <p className="text-xl text-[#001D8D]/80 max-w-4xl mx-auto leading-relaxed">
                Сервис KenigSwap строго соблюдает международные стандарты и требования российского законодательства 
                по противодействию финансовым преступлениям
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Содержание - фиксированное */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <TableOfContents 
                    items={tableOfContentsItems}
                    activeItem={activeSection}
                    onItemClick={setActiveSection}
                  />
                </div>
              </div>

              {/* Основной контент */}
              <div className="lg:col-span-3 space-y-12">
                
                {/* Введение */}
                <motion.section
                  id="introduction"
                  variants={slideUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Target className="h-6 w-6" />
                        Цели политики и общие положения
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none">
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Политика противодействия отмыванию денег (AML, Anti-Money Laundering), финансированию терроризма (CTF, Counter-Terrorism Financing) 
                        и политика «Знай своего клиента» (KYC, Know Your Customer) сервиса Kenigswap разработана для защиты бизнеса и клиентов от незаконной деятельности.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                            <span className="font-semibold text-blue-900">AML</span>
                          </div>
                          <p className="text-sm text-blue-800">
                            Комплекс мер и процедур, предотвращающих легализацию преступных доходов посредством финансовых операций
                          </p>
                        </div>
                        
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <span className="font-semibold text-red-900">CTF</span>
                          </div>
                          <p className="text-sm text-red-800">
                            Меры, направленные на недопущение финансирования террористических организаций и террористической деятельности
                          </p>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-5 w-5 text-green-600" />
                            <span className="font-semibold text-green-900">KYC</span>
                          </div>
                          <p className="text-sm text-green-800">
                            Процедуры проверки личности клиента и сбора информации о нём с целью убедиться в его благонадежности
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Определения */}
                <motion.section
                  id="definitions"
                  variants={slideUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6" />
                        Определения противоправных действий
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="border-l-4 border-red-500 pl-4">
                          <h4 className="font-bold text-[#001D8D] mb-2">Отмывание денег</h4>
                          <p className="text-[#001D8D]/80 leading-relaxed">
                            Придание законного вида владению, пользованию или распоряжению денежными средствами или имуществом, 
                            полученными преступным путём. В официальных документах РФ это называется «легализация доходов, полученных преступным путем».
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-orange-500 pl-4">
                          <h4 className="font-bold text-[#001D8D] mb-2">Финансирование терроризма</h4>
                          <p className="text-[#001D8D]/80 leading-relaxed">
                            Предоставление финансовых средств или иной поддержки для совершения террористического акта, 
                            организация или оплата таких действий, а равно финансирование и поддержка поездок лиц с целью участия в террористической деятельности.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Соблюдение требований */}
                <motion.section
                  id="compliance"
                  variants={slideUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Scale className="h-6 w-6" />
                        Выполнение требований законодательства
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Kenigswap строго соблюдает все применимые международные и российские нормативные акты по противодействию отмыванию денег 
                        и финансированию терроризма, включая рекомендации ФАТФ и Федеральный закон РФ №115-ФЗ.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                          <h5 className="font-semibold text-[#001D8D] mb-2">Ключевые элементы политики:</h5>
                          <ul className="text-sm text-[#001D8D]/80 space-y-1">
                            <li>• Внутренний контроль</li>
                            <li>• Комплаенс-офицер</li>
                            <li>• Обучение персонала</li>
                            <li>• Процедуры проверки клиентов</li>
                            <li>• Мониторинг транзакций</li>
                            <li>• Независимый аудит</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                          <h5 className="font-semibold text-[#001D8D] mb-2">Международные стандарты:</h5>
                          <ul className="text-sm text-[#001D8D]/80 space-y-1">
                            <li>• Рекомендации ФАТФ</li>
                            <li>• Федеральный закон №115-ФЗ</li>
                            <li>• Международные санкционные списки</li>
                            <li>• Банковские стандарты безопасности</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Система внутреннего контроля */}
                <motion.section
                  id="internal-control"
                  variants={slideUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Settings className="h-6 w-6" />
                        Система внутреннего контроля
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Мы разработали структурированную систему внутреннего контроля для соблюдения всех применимых требований AML/CTF.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                          <UserCheck className="h-5 w-5 text-blue-600 mt-1" />
                          <div>
                            <h5 className="font-semibold text-[#001D8D]">Идентификация клиентов</h5>
                            <p className="text-sm text-[#001D8D]/70">
                              Проверка личности и достоверности предоставленных сведений при установлении деловых отношений
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                          <Eye className="h-5 w-5 text-purple-600 mt-1" />
                          <div>
                            <h5 className="font-semibold text-[#001D8D]">Особый порядок для ПЗЛ</h5>
                            <p className="text-sm text-[#001D8D]/70">
                              Усиленные меры проверки для политически значимых лиц и их близких родственников
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                          <Activity className="h-5 w-5 text-orange-600 mt-1" />
                          <div>
                            <h5 className="font-semibold text-[#001D8D]">Выявление подозрительных операций</h5>
                            <p className="text-sm text-[#001D8D]/70">
                              Фиксация необычных операций и направление отчётов о подозрительной деятельности
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Комплаенс-офицер */}
                <motion.section
                  id="compliance-officer"
                  variants={slideUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <UserCheck className="h-6 w-6" />
                        Сотрудник по соблюдению требований (Комплаенс-офицер)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Для обеспечения эффективной реализации политики AML/CTF назначается специально уполномоченный комплаенс-офицер, 
                        который отвечает за разработку и внедрение всех мер по ПОД/ФТ.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h5 className="font-semibold text-[#001D8D]">Основные обязанности:</h5>
                          <ul className="text-sm text-[#001D8D]/80 space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              Разработка внутренних политик и процедур
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              Контроль идентификации новых клиентов
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              Управление записью и хранением данных
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              Анализ необычных операций
                            </li>
                          </ul>
                        </div>
                        
                        <div className="space-y-3">
                          <h5 className="font-semibold text-[#001D8D]">Дополнительные функции:</h5>
                          <ul className="text-sm text-[#001D8D]/80 space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                              Сообщение о подозрительной деятельности
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                              Информирование руководства
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                              Организация обучения сотрудников
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                              Актуализация оценки рисков
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Обучение персонала */}
                <motion.section
                  id="training"
                  variants={slideUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <BookOpen className="h-6 w-6" />
                        Обучение и информирование персонала
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Все сотрудники Kenigswap проходят обязательное обучение по вопросам AML/CTF и KYC при найме 
                        и далее на регулярной основе – не реже одного раза в год.
                      </p>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                        <h5 className="font-semibold text-[#001D8D] mb-4">Программа обучения включает:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="text-sm text-[#001D8D]/80 space-y-2">
                            <li>• Реальные примеры мошеннических схем</li>
                            <li>• Методы выявления и пресечения</li>
                            <li>• Изменения законодательства</li>
                          </ul>
                          <ul className="text-sm text-[#001D8D]/80 space-y-2">
                            <li>• Международные практики</li>
                            <li>• Рекомендации ФАТФ</li>
                            <li>• Практические навыки применения</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* KYC процедуры */}
                <motion.section
                  id="kyc-procedures"
                  variants={slideUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Users className="h-6 w-6" />
                        Процедуры проверки клиентов (KYC и Due Diligence)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Kenigswap внедрил собственные процедуры проверки клиентов в соответствии со стандартами AML/CTF 
                        и принципом «Знай своего клиента».
                      </p>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-[#001D8D] mb-3 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Сбор данных
                            </h5>
                            <p className="text-sm text-[#001D8D]/80">
                              Полное имя, дата рождения, гражданство, адрес проживания, контактные данные. 
                              Для подтверждения личности требуются документы с фотографией.
                            </p>
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-[#001D8D] mb-3 flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Верификация
                            </h5>
                            <p className="text-sm text-[#001D8D]/80">
                              Проверка подлинности документов, сравнение с санкционными списками, 
                              сверка с перечнями политически значимых лиц.
                            </p>
                          </div>
                          
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-[#001D8D] mb-3 flex items-center gap-2">
                              <Search className="h-4 w-4" />
                              Источник средств
                            </h5>
                            <p className="text-sm text-[#001D8D]/80">
                              Запрос информации о происхождении денежных средств или криптоактивов, 
                              особенно для крупных сумм.
                            </p>
                          </div>
                          
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-[#001D8D] mb-3 flex items-center gap-2">
                              <Activity className="h-4 w-4" />
                              Оценка рисков
                            </h5>
                            <p className="text-sm text-[#001D8D]/80">
                              Присвоение уровня риска (низкий, средний, высокий) на основе 
                              различных факторов и периодический пересмотр.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Мониторинг транзакций */}
                <motion.section
                  id="monitoring"
                  variants={slideUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Activity className="h-6 w-6" />
                        Мониторинг транзакций и риск-ориентированный подход
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Kenigswap осуществляет непрерывный мониторинг операций клиентов, применяя риск-ориентированный подход 
                        в соответствии с международными стандартами.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg">
                          <h5 className="font-semibold text-[#001D8D] mb-2">Автоматизированный анализ</h5>
                          <p className="text-sm text-[#001D8D]/80">
                            Система мониторинга в режиме реального времени отслеживает все операции обмена, 
                            используя современные аналитические инструменты и алгоритмы анализа блокчейн-транзакций.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded-r-lg">
                          <h5 className="font-semibold text-[#001D8D] mb-2">Сопоставление с профилем</h5>
                          <p className="text-sm text-[#001D8D]/80">
                            Каждая сделка оценивается на предмет соответствия известной информации о клиенте – 
                            его обычной деятельности, заявленным источникам средств, уровням доходов.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-4 rounded-r-lg">
                          <h5 className="font-semibold text-[#001D8D] mb-2">Критерии подозрительности</h5>
                          <p className="text-sm text-[#001D8D]/80">
                            Необычно крупные суммы, сложные цепочки переводов, использование миксеров, 
                            участие санкционных адресов, частая разбивка сумм.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Отчётность */}
                <motion.section
                  id="reporting"
                  variants={slideUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Database className="h-6 w-6" />
                        Отчётность и хранение данных
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Kenigswap соблюдает все требования по финансовой отчётности и хранению информации, 
                        связанные с программой AML/CTF.
                      </p>
                      
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-semibold text-[#001D8D] mb-3">Сроки хранения:</h5>
                            <ul className="text-sm text-[#001D8D]/80 space-y-2">
                              <li>• Документы клиентов: не менее 5 лет</li>
                              <li>• Данные транзакций: не менее 5 лет</li>
                              <li>• Отчёты SAR: не менее 5 лет</li>
                              <li>• Журналы мониторинга: не менее 5 лет</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-[#001D8D] mb-3">Меры защиты:</h5>
                            <ul className="text-sm text-[#001D8D]/80 space-y-2">
                              <li>• Безопасное электронное хранение</li>
                              <li>• Ограниченный доступ</li>
                              <li>• Шифрование данных</li>
                              <li>• Резервное копирование</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Аудит */}
                <motion.section
                  id="audit"
                  variants={slideUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Search className="h-6 w-6" />
                        Внутренний аудит AML/CTF
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Для проверки эффективности реализованных мер ПОД/ФТ предусмотрен регулярный внутренний аудит 
                        программы AML/CTF не реже одного раза в год.
                      </p>
                      
                      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                        <Zap className="h-8 w-8 text-blue-600" />
                        <div>
                          <h5 className="font-semibold text-[#001D8D]">Цели аудита</h5>
                          <p className="text-sm text-[#001D8D]/80">
                            Оценка полноты соблюдения политик, выявление пробелов, проверка документации, 
                            рекомендации по улучшению системы контроля.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Due Diligence */}
                <motion.section
                  id="due-diligence"
                  variants={slideUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Eye className="h-6 w-6" />
                        Применение мер due diligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Kenigswap применяет меры углублённой проверки клиентов не только при первичном принятии на обслуживание, 
                        но и в ряде других случаев.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h5 className="font-semibold text-[#001D8D]">Случаи дополнительной проверки:</h5>
                          <ul className="text-sm text-[#001D8D]/80 space-y-2">
                            <li>• Установление деловых отношений</li>
                            <li>• Сомнения в достоверности данных</li>
                            <li>• Периодическое обновление информации</li>
                            <li>• Подозрения в незаконной деятельности</li>
                          </ul>
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-[#001D8D] mb-2">Принцип постоянства</h5>
                          <p className="text-sm text-[#001D8D]/80">
                            Принципы KYC и due diligence пронизывают всё взаимодействие с пользователями: 
                            от момента регистрации до завершения отношений.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Меры при нарушениях */}
                <motion.section
                  id="violations"
                  variants={slideUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <AlertCircle className="h-6 w-6" />
                        Меры при выявлении нарушений и подозрительной активности
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Kenigswap оставляет за собой право применять дополнительные меры контроля или ограничения, 
                        если деятельность пользователя нарушает правила данной политики.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Заморозка средств при высоком риске
                          </h5>
                          <p className="text-sm text-red-800">
                            При превышении установленного порога риска (70%) операция подлежит немедленной приостановке 
                            до выяснения обстоятельств.
                          </p>
                        </div>
                        
                        <div className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Санкционные и миксерные адреса
                          </h5>
                          <p className="text-sm text-orange-800">
                            Средства с санкционных адресов или прошедшие через cryptocurrency mixers 
                            не принимаются и подлежат автоматической блокировке.
                          </p>
                        </div>
                        
                        <div className="border border-purple-200 bg-purple-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Дополнительные меры
                          </h5>
                          <p className="text-sm text-purple-800">
                            Запрос дополнительных документов, временная блокировка аккаунта, 
                            возврат средств только на исходные реквизиты.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Заключение */}
                <motion.section
                  variants={slideUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card className="bg-gradient-to-r from-[#001D8D] to-blue-700 text-white shadow-2xl border-none">
                    <CardContent className="p-8 text-center">
                      <div className="flex justify-center mb-6">
                        <div className="bg-white/20 p-4 rounded-full">
                          <Shield className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      <h2 className="text-3xl font-bold mb-4">
                        Наша приверженность безопасности
                      </h2>
                      <p className="text-xl text-white/90 mb-6 max-w-3xl mx-auto">
                        Политика AML/CTF и KYC – это фундамент безопасности сервиса KenigSwap, 
                        который защищает как нас, так и наших клиентов, и способствует поддержанию 
                        чистоты и прозрачности криптовалютного рынка.
                      </p>
                      
                      {/* Trust indicators */}
                      <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-white/80">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span>Соответствие ФАТФ</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-400" />
                          <span>Федеральный закон №115-ФЗ</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-purple-400" />
                          <span>Международные стандарты</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}