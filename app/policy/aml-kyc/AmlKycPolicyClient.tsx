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
  Zap,
  Award,
  TrendingUp
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
            
            {/* Заголовок */}
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
                Политика AML/CTF и KYC сервиса Kenigswap
              </h1>
              <p className="text-xl text-[#001D8D]/80 max-w-4xl mx-auto leading-relaxed">
                Политика противодействия отмыванию денег, финансированию терроризма и «Знай своего клиента»
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
                
                {/* Цели политики и общие положения */}
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
                      <div className="text-[#001D8D]/80 leading-relaxed space-y-6">
                        <p>
                          Политика противодействия отмыванию денег (AML, Anti-Money Laundering), финансированию терроризма (CTF, Counter-Terrorism Financing) и политика «Знай своего клиента» (KYC, Know Your Customer) сервиса Kenigswap разработана для защиты бизнеса и клиентов от незаконной деятельности. Данная политика направлена на выполнение требований законодательства и международных стандартов по противодействию финансовым преступлениям. Политики AML/CTF и KYC помогают идентифицировать клиентов, проверять их личность и финансовые данные, а также мониторить транзакции, которые могут быть связаны с противоправными действиями. Правильное применение этих политик обеспечивает прозрачность бизнеса, законность операций и минимизирует риски штрафов и потери репутации. Благодаря мерам AML и KYC компания избегает сотрудничества с подозрительными лицами, выполняет требования регуляторов и повышает доверие клиентов.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="h-5 w-5 text-blue-600" />
                              <span className="font-semibold text-blue-900">AML</span>
                            </div>
                            <p className="text-sm text-blue-800">
                              Комплекс мер и процедур, предотвращающих легализацию преступных доходов (т.е. «отмывание денег») посредством финансовых операций.
                            </p>
                          </div>
                          
                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                              <span className="font-semibold text-red-900">CTF</span>
                            </div>
                            <p className="text-sm text-red-800">
                              Меры, направленные на недопущение финансирования террористических организаций и террористической деятельности.
                            </p>
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="h-5 w-5 text-green-600" />
                              <span className="font-semibold text-green-900">KYC</span>
                            </div>
                            <p className="text-sm text-green-800">
                              Процедуры проверки личности клиента и сбора информации о нём (например, проверка паспорта, адреса, источника доходов) с целью убедиться, что клиент является благонадежным и не связан с мошенничеством или иной незаконной деятельностью.
                            </p>
                          </div>
                        </div>
                        
                        <p>
                          В совокупности соблюдение правил AML/CTF и проведение процедур KYC позволяет поддерживать законность финансовых операций, защищает добросовестных пользователей и всю финансовую систему от злоупотреблений.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Определения противоправных действий */}
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
                      <div className="text-[#001D8D]/80 leading-relaxed space-y-6">
                        <div className="border-l-4 border-red-500 pl-6 bg-red-50 p-4 rounded-r-lg">
                          <h4 className="font-bold text-[#001D8D] mb-3">Отмывание денег</h4>
                          <p className="mb-4">
                            Отмывание денег – это придание законного вида владению, пользованию или распоряжению денежными средствами или имуществом, полученными преступным путём. В официальных документах РФ это называется «легализация доходов, полученных преступным путем». Отмывание денег определяется законом посредством следующих действий:
                          </p>
                          <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Конверсия или перевод имущества, полученного от преступной деятельности (либо имущества, приобретенного на такие доходы), при знании того, что оно имеет преступное происхождение, с целью скрыть или утаить незаконное происхождение средств либо помочь участнику преступления избежать ответственности.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Приобретение, владение или использование имущества, полученного от преступной деятельности (или на средства от неё), при условии осведомленности на момент получения, что оно добыто преступным путём.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Сокрытие или утаивание истинной природы, источника, местонахождения, движения или права собственности на имущество, полученное в результате преступления, если известно, что имущество получено преступным путём.</span>
                            </li>
                          </ul>
                          <p className="mt-4">
                            Отмыванием денег также считается участие или пособничество в совершении, попытке совершения, подстрекательстве или консультировании в осуществлении любых из вышеупомянутых действий.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-orange-500 pl-6 bg-orange-50 p-4 rounded-r-lg">
                          <h4 className="font-bold text-[#001D8D] mb-3">Финансирование терроризма</h4>
                          <p>
                            Финансирование терроризма – это предоставление финансовых средств или иной поддержки для совершения террористического акта, организация или оплата таких действий, а равно финансирование и поддержка поездок лиц с целью участия в террористической деятельности. Иными словами, финансирование терроризма включает любую материальную поддержку террористов, террористических групп либо связанных с ними мероприятий.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Выполнение требований законодательства */}
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
                      <div className="text-[#001D8D]/80 leading-relaxed space-y-6">
                        <p>
                          Kenigswap строго соблюдает все применимые международные и российские нормативные акты по противодействию отмыванию денег и финансированию терроризма, включая рекомендации ФАТФ и Федеральный закон РФ №115-ФЗ «О противодействии легализации доходов, полученных преступным путем, и финансированию терроризма». Международные и местные нормы обязывают нас внедрять эффективные внутренние процедуры и механизмы для предотвращения отмывания денег, финансирования терроризма, торговли наркотиками и людьми, распространения оружия массового уничтожения, коррупции и других финансовых преступлений. В случае выявления подозрительной активности мы предпринимаем необходимые меры, предусмотренные законом, и взаимодействуем с уполномоченными органами.
                        </p>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                          <h5 className="font-semibold text-[#001D8D] mb-4">Политика AML/CTF сервиса Kenigswap охватывает следующие ключевые элементы:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                                <span className="text-sm">Внутренний контроль – наличие действенной системы внутренних правил и процедур.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                                <span className="text-sm">Специально назначенный сотрудник по соблюдению (комплаенс-офицер), ответственный за реализацию программы AML/CTF.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                                <span className="text-sm">Обучение персонала – регулярное повышение осведомленности сотрудников по вопросам AML/CTF.</span>
                              </li>
                            </ul>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-blue-600 mt-1" />
                                <span className="text-sm">Процедуры проверки клиентов – идентификация, верификация и комплексная проверка (KYC/CDD).</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-blue-600 mt-1" />
                                <span className="text-sm">Мониторинг транзакций и риск-ориентированный подход – оценка рисков клиентов и операций, выявление и расследование подозрительных транзакций.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-blue-600 mt-1" />
                                <span className="text-sm">Независимый аудит – периодическая проверка эффективности программы AML/CTF.</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <p>
                          Далее подробно описаны перечисленные компоненты политики Kenigswap по AML/CTF и KYC.
                        </p>
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
                      <div className="text-[#001D8D]/80 leading-relaxed space-y-6">
                        <p>
                          Мы разработали структурированную систему внутреннего контроля для соблюдения всех применимых требований AML/CTF. Эта система предусматривает:
                        </p>
                        
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                            <UserCheck className="h-5 w-5 text-blue-600 mt-1" />
                            <div>
                              <h5 className="font-semibold text-[#001D8D] mb-2">Идентификация личности клиентов</h5>
                              <p className="text-sm">
                                Проверка достоверности предоставленных ими сведений при установлении деловых отношений.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                            <Eye className="h-5 w-5 text-purple-600 mt-1" />
                            <div>
                              <h5 className="font-semibold text-[#001D8D] mb-2">Особый порядок обслуживания политически значимых лиц (ПЗЛ / PEP)</h5>
                              <p className="text-sm">
                                Применение усиленных мер проверки в отношении клиентов, которые занимают или занимали видные государственные должности, либо являются близкими родственниками таких лиц. Такие клиенты автоматически относятся к группе повышенного риска по международным стандартам, поэтому их идентификация и мониторинг проводятся с особой тщательностью.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                            <Activity className="h-5 w-5 text-orange-600 mt-1" />
                            <div>
                              <h5 className="font-semibold text-[#001D8D] mb-2">Выявление и фиксация необычных или подозрительных операций</h5>
                              <p className="text-sm">
                                Процедура направления отчётов о подозрительной деятельности (SAR) во уполномоченные органы. Любые транзакции, не соответствующие профилю клиента или не имеющие явного экономического смысла, отмечаются для дальнейшего анализа.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                            <Database className="h-5 w-5 text-green-600 mt-1" />
                            <div>
                              <h5 className="font-semibold text-[#001D8D] mb-2">Ведение учетных записей и сохранение документации</h5>
                              <p className="text-sm">
                                Все документы по клиентам и их операциям хранятся в надлежащем порядке и при необходимости могут быть быстро найдены для проверки или предоставления регуляторам.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Сотрудник по соблюдению требований */}
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
                      <div className="text-[#001D8D]/80 leading-relaxed space-y-6">
                        <p>
                          Для обеспечения эффективной реализации политики AML/CTF назначается специально уполномоченный комплаенс-офицер (сотрудник службы безопасности). Комплаенс-офицер отвечает за разработку и внедрение всех мер по ПОД/ФТ, а также за надзор за их исполнением. Он контролирует все аспекты программы AML/CTF Kenigswap и, в частности, выполняет следующие обязанности:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4">
                              <h6 className="font-semibold text-[#001D8D] mb-2">Разработка и актуализация</h6>
                              <p className="text-sm">
                                Внутренних политик и процедур, регламентирующих сбор, проверку, подачу и хранение всех отчётов и записей, требуемых законодательством.
                              </p>
                            </div>
                            
                            <div className="border-l-4 border-green-500 pl-4">
                              <h6 className="font-semibold text-[#001D8D] mb-2">Контроль процесса идентификации</h6>
                              <p className="text-sm">
                                Верификации новых клиентов – сбор необходимых данных и документов, проверка предоставленной информации, включая её сопоставление с санкционными списками и другими базами данных.
                              </p>
                            </div>
                            
                            <div className="border-l-4 border-purple-500 pl-4">
                              <h6 className="font-semibold text-[#001D8D] mb-2">Управление записью и хранением</h6>
                              <p className="text-sm">
                                Внедрение системы учёта, гарантирующей надлежащее хранение всех документов, файлов, журналов и форм, связанных с выполнением требований AML/CTF.
                              </p>
                            </div>
                            
                            <div className="border-l-4 border-orange-500 pl-4">
                              <h6 className="font-semibold text-[#001D8D] mb-2">Анализ и расследование</h6>
                              <p className="text-sm">
                                Необычных операций или обстоятельств, которые могут быть связаны с отмыванием денег или финансированием терроризма. При обнаружении такого рода активности комплаенс-офицер проводит детальную проверку и при необходимости инициирует внутреннее расследование.
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="border-l-4 border-red-500 pl-4">
                              <h6 className="font-semibold text-[#001D8D] mb-2">Сообщение о подозрительной деятельности</h6>
                              <p className="text-sm">
                                При наличии обоснованных подозрений в отмывании денег или финансировании терроризма комплаенс-офицер подготавливает и подаёт Отчёт о подозрительной операции (ОПО, англ. SAR) в уполномоченный государственный орган (например, Росфинмониторинг). Он же обеспечивает предоставление правоохранительным органам всей запрошенной информации в соответствии с законом.
                              </p>
                            </div>
                            
                            <div className="border-l-4 border-indigo-500 pl-4">
                              <h6 className="font-semibold text-[#001D8D] mb-2">Регулярное информирование руководства</h6>
                              <p className="text-sm">
                                Предоставление письменных отчётов совету директоров (либо иному высшему органу управления компании) о состоянии соблюдения AML/CTF-требований и выявленных рисках.
                              </p>
                            </div>
                            
                            <div className="border-l-4 border-teal-500 pl-4">
                              <h6 className="font-semibold text-[#001D8D] mb-2">Организация обучения сотрудников</h6>
                              <p className="text-sm">
                                Комплаенс-офицер отвечает за программу подготовки персонала по вопросам ПОД/ФТ (подробнее см. следующий раздел).
                              </p>
                            </div>
                            
                            <div className="border-l-4 border-pink-500 pl-4">
                              <h6 className="font-semibold text-[#001D8D] mb-2">Актуализация оценки рисков</h6>
                              <p className="text-sm">
                                Проведение регулярной переоценки рисков клиентов и операций по мере изменения условий и появлении новых угроз, корректировка мер контроля в соответствии с обновлённой оценкой.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                          <p>
                            Комплаенс-офицер обладает необходимыми полномочиями для выполнения своих задач. В частности, он имеет право запрашивать у клиентов дополнительную информацию, приостанавливать подозрительные транзакции для проверки, а также взаимодействовать с правоохранительными и надзорными органами, занимающимися борьбой с финансовыми преступлениями. Комплаенс-офицер подчиняется непосредственно высшему руководству Kenigswap, что гарантирует независимость его функций и приоритетность целей AML/CTF.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Обучение и информирование персонала */}
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
                      <div className="text-[#001D8D]/80 leading-relaxed space-y-6">
                        <p>
                          Все сотрудники Kenigswap, так или иначе участвующие в проведении операций, проходят обязательное обучение по вопросам AML/CTF и KYC. Обучение проводится при найме нового сотрудника и далее на регулярной основе – не реже одного раза в год – в форме тренингов, семинаров и экзаменов на знание политики компании. Это позволяет поддерживать высокий уровень осведомленности персонала обо всех актуальных угрозах и способах их выявления. В программу обучения включены реальные примеры мошеннических схем и методов их пресечения, изучаются изменения законодательства и лучшие международные практики, в том числе новые рекомендации ФАТФ и требования российского законодательства.
                        </p>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                          <h5 className="font-semibold text-[#001D8D] mb-4">Программа обучения включает:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="text-sm space-y-2">
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                <span>Реальные примеры мошеннических схем</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                <span>Методы выявления и пресечения</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                <span>Изменения законодательства</span>
                              </li>
                            </ul>
                            <ul className="text-sm space-y-2">
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                                <span>Лучшие международные практики</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                                <span>Новые рекомендации ФАТФ</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                                <span>Требования российского законодательства</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <p>
                          В случае существенных изменений (например, принятия нового закона или появления новой схемы отмывания средств) сотрудники проходят внеочередное обучение или инструктаж. Также всем сотрудникам предоставляются внутренние методические материалы и руководства, которые регулярно обновляются отделом комплаенса, чтобы соответствовать текущим нормативным требованиям. Контроль знаний персонала осуществляется посредством периодического тестирования и оценки практических навыков применения AML-процедур. Такой подход гарантирует, что каждый сотрудник Kenigswap чётко понимает свои обязанности в рамках политики AML/CTF и способен распознать и должным образом реагировать на подозрительные ситуации.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Процедуры проверки клиентов (KYC и Due Diligence) */}
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
                      <div className="text-[#001D8D]/80 leading-relaxed space-y-6">
                        <p>
                          Kenigswap внедрил собственные процедуры проверки клиентов в соответствии со стандартами AML/CTF и принципом «Знай своего клиента». Прежде чем вступить с клиентом в деловые отношения (например, предоставить ему доступ к операциям обмена криптовалюты), компания проводит процедуру надлежащей проверки – Customer Due Diligence (CDD). Основные элементы процессов идентификации и верификации клиентов включают:
                        </p>
                        
                        <div className="space-y-6">
                          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                            <h5 className="font-semibold text-[#001D8D] mb-3 flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              Сбор идентификационных данных клиента
                            </h5>
                            <p className="text-sm">
                              На этапе регистрации пользователь обязан предоставить достоверную персональную информацию: полное имя, дату рождения, гражданство, адрес проживания, контактные данные и пр. Для подтверждения личности запрашиваются документы – обычно государственный документ с фотографией (паспорт или аналогичный удостоверяющий личность документ). Для организаций запрашиваются регистрационные документы, информация о руководстве и бенефициарных владельцах.
                            </p>
                          </div>
                          
                          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                            <h5 className="font-semibold text-[#001D8D] mb-3 flex items-center gap-2">
                              <Shield className="h-5 w-5" />
                              Верификация личности и документов
                            </h5>
                            <p className="text-sm">
                              Предоставленные клиентом сведения проверяются на подлинность. Kenigswap использует современные инструменты и базы данных для проверки документов и личности: сравнение фото в документе с селфи клиента, проверка валидности паспорта, сверка адреса. Также осуществляется сопоставление с международными санкционными списками, списками террористов и другими списками наблюдения, а также с перечнями политически значимых лиц (PEP). Данные проверки позволяют убедиться, что клиент не включён в санкционные реестры и не связан с экстремистской или криминальной деятельностью.
                            </p>
                          </div>
                          
                          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                            <h5 className="font-semibold text-[#001D8D] mb-3 flex items-center gap-2">
                              <Search className="h-5 w-5" />
                              Установление источника средств
                            </h5>
                            <p className="text-sm">
                              В рамках политики KYC компания вправе запросить у клиента информацию и подтверждающие документы о происхождении денежных средств или криптоактивов, участвующих в сделках. Это особенно важно, если речь идёт о крупных суммах или если поведение клиента кажется нестандартным. Например, могут потребоваться справки о доходах, выписки со счетов, документы о продаже имущества и т.п.
                            </p>
                          </div>
                          
                          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                            <h5 className="font-semibold text-[#001D8D] mb-3 flex items-center gap-2">
                              <Activity className="h-5 w-5" />
                              Оценка рискового профиля клиента
                            </h5>
                            <p className="text-sm">
                              На основании собранных данных Kenigswap присваивает каждому новому клиенту определённый уровень риска – низкий, средний или высокий. Этот комплаенс-риск профиль рассчитывается при начале взаимоотношений и периодически пересматривается впоследствии. На оценку влияют различные факторы: страна проживания клиента (например, находится ли она в списке юрисдикций с высоким риском по версии ФАТФ), статус клиента (например, является ли PEP), вид планируемых операций, объемы средств, репутация клиента и др.
                            </p>
                          </div>
                          
                          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                            <h5 className="font-semibold text-[#001D8D] mb-3 flex items-center gap-2">
                              <Eye className="h-5 w-5" />
                              Усиленная проверка (EDD) для повышенных рисков
                            </h5>
                            <p className="text-sm">
                              Если клиент отнесён к категории высокого риска, либо является юридическим лицом со сложной структурой собственности, либо подпадает под статус PEP – к нему применяются расширенные процедуры проверки. Это может включать запрос дополнительных документов, более тщательное изучение биографии и деловой репутации, мониторинг упоминаний о клиенте в СМИ и открытых источниках и пр. Для корпоративных клиентов анализируется структура владения, устанавливаются все конечные бенефициары, проверяется благонадежность учредителей и руководителей компании. Цель усиленной проверки – максимально снизить неопределенность и убедиться в легальности деятельности клиента.
                            </p>
                          </div>
                        </div>
                        
                        <p>
                          Прохождение перечисленных этапов KYC является обязательным для всех новых пользователей Kenigswap. До завершения идентификации и проверки личность клиента считается не установленной, и проведение операций с криптовалютой ему недоступно. Если на каком-либо этапе клиент отказывается предоставить запрошенные сведения или выявляются факты, вызывающие обоснованные подозрения, компания вправе отказать ему в обслуживании в соответствии с внутренними правилами и законом.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Мониторинг транзакций и риск-ориентированный подход */}
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
                      <div className="text-[#001D8D]/80 leading-relaxed space-y-6">
                        <p>
                          Kenigswap осуществляет непрерывный мониторинг операций клиентов, применяя при этом риск-ориентированный подход в соответствии с международными стандартами. Это означает, что интенсивность и фокус контроля устанавливаются пропорционально уровню риска, который представляет конкретный клиент или транзакция. Основные положения мониторинга следующие:
                        </p>
                        
                        <div className="space-y-4">
                          <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg">
                            <h5 className="font-semibold text-[#001D8D] mb-2">Автоматизированный анализ транзакций</h5>
                            <p className="text-sm">
                              В сервисе внедрена специализированная система мониторинга, которая в режиме реального времени отслеживает все операции обмена. Система использует современные аналитические инструменты (включая алгоритмы анализа блокчейн-транзакций и поведенческие модели) для выявления паттернов, характерных для отмывания денег. Обрабатываются большие объёмы данных, что позволяет мгновенно отмечать подозрительную активность среди множества обычных операций.
                            </p>
                          </div>
                          
                          <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded-r-lg">
                            <h5 className="font-semibold text-[#001D8D] mb-2">Сопоставление операций с профилем клиента</h5>
                            <p className="text-sm">
                              Каждая сделка оценивается на предмет соответствия известной информации о клиенте – его обычной деятельности, заявленным источникам средств, уровням доходов и т.д. Если транзакция существенно отклоняется от ожидаемого поведения клиента, она помечается как необычная и подлежит дополнительной проверке сотрудником службы комплаенса. Например, если клиент, обычно совершающий мелкие обмены, внезапно переводит большую сумму на зарубежный счёт, такая операция признаётся нестандартной для данного профиля.
                            </p>
                          </div>
                          
                          <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-4 rounded-r-lg">
                            <h5 className="font-semibold text-[#001D8D] mb-2">Критерии подозрительных операций</h5>
                            <p className="text-sm">
                              Определение того, считать ли операцию подозрительной, во многом основывается на профессиональном суждении, опирающемся на знание клиента (результаты KYC), его финансовое поведение и информацию о контрагентах. Признаками подозрительности могут быть: необычно крупные суммы, сложные цепочки перевода средств через многочисленные адреса, использование криптомиксеров или coinjoin-транзакций для запутывания следов, участие адресов из санкционных списков, частая разбивка суммы на множество мелких переводов (smurfing) и т.п. Отдельно отслеживаются «красные флажки» – заранее определённые сценарии, ассоциируемые с мошенничеством (например, поступление средств с адресов, связанных с даркнет-площадками и пр.). Если транзакция не имеет разумного или очевидного законного экономического смысла, либо не характерна для данного клиента с учётом его бизнеса, она рассматривается как потенциально подозрительная.
                            </p>
                          </div>
                          
                          <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded-r-lg">
                            <h5 className="font-semibold text-[#001D8D] mb-2">Решение о сообщении (SAR)</h5>
                            <p className="text-sm">
                              Все отмеченные системой нестандартные операции проверяются комплаенс-офицером. Он проводит разбор: связывается с клиентом за пояснениями при необходимости, анализирует дополнительную информацию о транзакции, устанавливает, можно ли объяснить её законной деятельностью. По итогам анализа принимается решение – составляет ли данная операция подозрительную активность, подлежащую обязательному сообщению в компетентные органы, либо же имеет удовлетворительное объяснение. В первом случае комплаенс-офицер готовит и направляет Отчёт о подозрительной операции (SAR) в регулирующий орган. Отметим, что факт подачи SAR является конфиденциальным: клиент не уведомляется о том, что по его операции направлен отчёт, во избежание противодействия расследованию. Лишь сотрудники Kenigswap, непосредственно участвующие в рассмотрении и оформлении SAR, осведомлены о его наличии.
                            </p>
                          </div>
                          
                          <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-4 rounded-r-lg">
                            <h5 className="font-semibold text-[#001D8D] mb-2">Пересмотр рискового профиля</h5>
                            <p className="text-sm">
                              После анализа подозрительной активности профиль риска клиента может быть пересмотрен. Например, обнаружение сомнительной операции может повысить категорию риска клиента с «средней» до «высокой», что повлечёт более строгий контроль последующих его действий. Профили рисков всех клиентов также планово пересматриваются через определённые интервалы времени, даже если подозрительных инцидентов не происходило. Это делается для учета возможных изменений в поведении клиента или в общей обстановке (например, изменения в санкционных списках).
                            </p>
                          </div>
                        </div>
                        
                        <p>
                          В рамках риск-ориентированного подхода Kenigswap уделяет особое внимание операциям, которые по своей природе или параметрам относятся к повышенному риску. В частности, усиленный мониторинг ведётся за: а) сложными, многоэтапными сделками, не имеющими понятной законной цели; б) операциями на необычно крупные суммы, несоразмерные финансовому профилю клиента; в) транзакциями, связанными с юрисдикциями из списка стран с недостаточным уровнем ПОД/ФТ (в т.ч. страны, включённые в «чёрный» или «серый» список ФАТФ); г) любыми операциями, в которых участвуют контрагенты или адреса из санкционных списков (ООН, OFAC, ЕС и др.). Такой пристальный надзор помогает выявлять схему отмывания денег даже в случаях, когда злоумышленники пытаются замаскировать её под обычную деятельность.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Отчётность и хранение данных */}
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
                      <div className="text-[#001D8D]/80 leading-relaxed space-y-6">
                        <p>
                          Kenigswap соблюдает все требования по финансовой отчётности и хранению информации, связанные с программой AML/CTF. Во-первых, как отмечалось, при возникновении подозрений мы направляем уведомления о подозрительных операциях (SAR) в уполномоченные органы, такие как Росфинмониторинг. Мы также готовы предоставить полную информацию о клиенте и произведённых транзакциях по официальному запросу регулятора или правоохранительных органов в установленные сроки.
                        </p>
                        
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg">
                          <h5 className="font-semibold text-[#001D8D] mb-4">Требования к хранению данных:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h6 className="font-semibold text-[#001D8D] mb-3">Сроки хранения:</h6>
                              <ul className="text-sm space-y-2">
                                <li className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                  <span>Документы клиентов: не менее 5 лет</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                  <span>Данные транзакций: не менее 5 лет</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                  <span>Отчёты SAR: не менее 5 лет</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                  <span>Журналы мониторинга: не менее 5 лет</span>
                                </li>
                              </ul>
                            </div>
                            
                            <div>
                              <h6 className="font-semibold text-[#001D8D] mb-3">Меры защиты:</h6>
                              <ul className="text-sm space-y-2">
                                <li className="flex items-start gap-2">
                                  <Lock className="h-4 w-4 text-blue-600 mt-0.5" />
                                  <span>Безопасное электронное хранение</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Lock className="h-4 w-4 text-blue-600 mt-0.5" />
                                  <span>Ограниченный доступ</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Lock className="h-4 w-4 text-blue-600 mt-0.5" />
                                  <span>Шифрование данных</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <Lock className="h-4 w-4 text-blue-600 mt-0.5" />
                                  <span>Резервное копирование</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <p>
                          Все сведения, собранные в ходе KYC и мониторинга, хранятся компанией в течение как минимум 5 лет после завершения отношений с клиентом или проведения отдельной транзакции. В частности, оригиналы или копии документов, на основании которых проводилась идентификация личности клиента, а также документация, послужившая основанием для установления деловых отношений, хранятся не менее пяти лет с момента прекращения отношений. Документы по разовым сделкам (заявки, платежные квитанции и т.п.), а также данные и журналы, связанные с исполнением обязанностей по контролю и отчётности, хранятся не менее 5 лет после завершения соответствующей операции либо подачи отчёта.
                        </p>
                        
                        <p>
                          Для защиты конфиденциальности эти архивы хранятся в безопасном электронном виде с ограниченным кругом ответственных лиц, имеющих к ним доступ. По прошествии установленного срока информация может быть уничтожена (если не требуется более долгого хранения по иным законам), однако по внутреннему усмотрению компания может продлить период хранения, если это необходимо для расследования или судебного разбирательства.
                        </p>
                        
                        <p>
                          Отдельно подчеркнём, что все сотрудники Kenigswap обязаны немедленно информировать комплаенс-офицера, если они обнаружили какую-либо нетипичную операцию клиента, которая не вписывается в его известный профиль или законную деятельность. Такая бдительность персонала является частью корпоративной культуры и дополнительно обеспечивает своевременное выявление подозрительных операций.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Внутренний аудит AML/CTF */}
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
                      <div className="text-[#001D8D]/80 leading-relaxed space-y-6">
                        <p>
                          Для проверки эффективности и актуальности реализованных мер ПОД/ФТ в Kenigswap предусмотрен регулярный внутренний аудит программы AML/CTF. По поручению руководства комплаенс-офицер организует проведение аудиторской проверки не реже одного раза в год. Аудит может выполняться как внутренними ревизорами компании, не вовлечёнными в ежедневные комплаенс-процедуры, так и независимыми экспертами или специализированными организациями. Цель аудита – оценить, насколько полно и точно соблюдаются установленные политики AML/CTF, выявить возможные пробелы или уязвимости в системе внутреннего контроля и мониторинга, проверить адекватность ведения документации и отчётности.
                        </p>
                        
                        <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-lg border border-blue-200">
                          <Zap className="h-8 w-8 text-blue-600" />
                          <div>
                            <h5 className="font-semibold text-[#001D8D] mb-2">Цели аудита</h5>
                            <p className="text-sm">
                              Оценка полноты соблюдения политик, выявление пробелов, проверка документации, рекомендации по улучшению системы контроля.
                            </p>
                          </div>
                        </div>
                        
                        <p>
                          По результатам аудита составляется отчёт с описанием обнаруженных недостатков и рекомендациями по их устранению. Руководство Kenigswap рассматривает отчёт и обеспечивает реализацию корректирующих мер в разумные сроки. Кроме ежегодных плановых проверок, внеочередной аудит программы AML может проводиться при существенных изменениях в регулировании или внутренней структуре компании, либо в случае инцидента, выявившего слабое место в действующих процедурах. Такой подход гарантирует, что политика AML/CTF не является статичным документом, а постоянно совершенствуется и адаптируется к новым вызовам.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Применение мер due diligence */}
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
                      <div className="text-[#001D8D]/80 leading-relaxed space-y-6">
                        <p>
                          Kenigswap применяет меры углублённой проверки (due diligence) клиентов не только при первичном их принятии на обслуживание, но и в ряде других случаев, предусмотренных законом и внутренними процедурами. Дополнительная проверка проводится, если:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h5 className="font-semibold text-[#001D8D]">Случаи дополнительной проверки:</h5>
                            <ul className="space-y-3">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm">Клиент устанавливает деловые отношения с сервисом (регистрация и начало операций) – первичная идентификация и KYC обязательны для всех.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm">Возникают сомнения в достоверности или полноте ранее полученных данных о клиенте – например, если документы вызывают подозрения в подлинности, либо появились противоречивые сведения. В таком случае компания повторно запрашивает и проверяет информацию, обновляет анкеты клиента.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm">Обновление данных по требованию регулятора или внутреннему регламенту. Периодически (раз в год либо в иной срок, установленный политикой) Kenigswap может проводить ревалидацию данных клиента, запрашивать актуальные версии документов, чтобы удостовериться, что информация ещё актуальна. Это особенно важно для удостоверений личности с ограниченным сроком действия или при смене фамилии клиентом и т.п.</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="space-y-4">
                            <h5 className="font-semibold text-[#001D8D]">Дополнительные случаи:</h5>
                            <ul className="space-y-3">
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm">У компании появляются подозрения в том, что конкретная транзакция или деятельность клиента связаны с отмыванием денег или финансированием терроризма – здесь внутренние правила предписывают немедленно усилить проверку: потребовать дополнительные сведения, отследить цепочку транзакций, отложить выполнение операции до прояснения обстоятельств.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm">Иные случаи, предусмотренные законодательством или внутренними «красными флажками». Например, поступление официального уведомления от правоохранительных органов о конкретном клиенте, либо выявление факта, что клиент предоставил ранее ложные сведения о себе – все это запускает внеплановую процедуру полного пересмотра информации по клиенту и его операций.</span>
                              </li>
                            </ul>
                            
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-6">
                              <h5 className="font-semibold text-[#001D8D] mb-2">Принцип постоянства</h5>
                              <p className="text-sm">
                                Принципы KYC и due diligence пронизывают всё взаимодействие Kenigswap с пользователями: от момента регистрации до завершения отношений. Мы постоянно поддерживаем актуальность клиентских данных и степень доверия к ним.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>

                {/* Меры при выявлении нарушений и подозрительной активности */}
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
                      <div className="text-[#001D8D]/80 leading-relaxed space-y-6">
                        <p>
                          Kenigswap оставляет за собой право применять дополнительные меры контроля или ограничения, если деятельность пользователя нарушает правила данной политики либо его транзакции получают высокие показатели риска по результатам AML-анализов. Мы используем в работе профессиональные аналитические сервисы для оценки «чистоты» криптовалютных транзакций. Эти инструменты присваивают входящим транзакциям так называемый AML risk score – процентный показатель, отражающий вероятность связи средств с противоправными источниками (например, с мошенничеством, даркнетом, миксерами, санкционными адресами и т.д.). На основании результатов такой проверки Kenigswap действует следующим образом:
                        </p>
                        
                        <div className="space-y-6">
                          <div className="border border-red-200 bg-red-50 p-6 rounded-lg">
                            <h5 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                              <Lock className="h-5 w-5" />
                              1. Заморозка средств при высоком риск-скоринге
                            </h5>
                            <p className="text-sm text-red-800">
                              Если суммарный риск транзакции превышает установленный порог (как правило, 70%), операция подлежит немедленной приостановке. Средства временно замораживаются на нашем кошельке до выяснения обстоятельств. В отдельных случаях блокировка может применяться и при меньшем проценте риска – решение принимается индивидуально с учётом структуры риска. Например, транзакция с 50% риском может быть остановлена, если значительная часть этого риска – прямое попадание средств с мошеннического источника.
                            </p>
                          </div>
                          
                          <div className="border border-orange-200 bg-orange-50 p-6 rounded-lg">
                            <h5 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5" />
                              2. Средства с санкционных или «миксерных» адресов не принимаются
                            </h5>
                            <p className="text-sm text-orange-800">
                              Если поступающие к нам криптоактивы помечены аналитической системой как имеющие связь с санкционными сервисами (например, с биржами или кошельками, находящимися под санкциями) либо прошли через cryptocurrency mixers (сервисы смешивания, используемые для анонимизации), то такие средства будут заморожены независимо от общего процента риска. Любая транзакция с тегом "Sanctions" или "Mixer" автоматически становится объектом блокировки. Следует учитывать, что регуляторные органы могут изъять или заблокировать подобные активы на неопределённый срок, а обменник не несёт ответственности за возвращение средств, помеченных как санкционные или связанные с миксерами, если они были задержаны по требованию регулятора. Это служит дополнительным предупреждением для клиентов избегать источников средств сомнительного происхождения.
                            </p>
                          </div>
                          
                          <div className="border border-purple-200 bg-purple-50 p-6 rounded-lg">
                            <h5 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              3. Признаки мошенничества или преступления (Victim Report)
                            </h5>
                            <p className="text-sm text-purple-800">
                              Если транзакция помечена статусом "victim-report" (что означает наличие официальной жалобы или уголовного дела, связанного с адресом отправки/получения), такие средства подлежат немедленной заморозке аналогично вышеописанному. Компания обязана будет сотрудничать с правоохранительными органами и, возможно, вернуть средства жертве преступления по предписанию суда.
                            </p>
                          </div>
                          
                          <div className="border border-blue-200 bg-blue-50 p-6 rounded-lg">
                            <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                              <Shield className="h-5 w-5" />
                              4. Блокировка отдельных источников
                            </h5>
                            <p className="text-sm text-blue-800">
                              Kenigswap в рамках своей внутренней политики может заранее не обслуживать транзакции из определённых систем или адресов, имеющих неблагонадежную репутацию. К примеру, если известно, что какая-либо платформа или кошелёк систематически участвуют в сомнительных операциях (как отмечено независимыми аудиторами), переводы с таких ресурсов могут быть нами отклонены. В частности, на данный момент не принимаются депозиты с кошельков CommEX, Capitalist и некоторых других, зарекомендовавших себя как высокорисковые. Перечень подобных исключений может обновляться службой безопасности.
                            </p>
                          </div>
                        </div>
                        
                        <p>
                          Каждый случай срабатывания AML-контроля рассматривается нами индивидуально с учётом множества факторов: давности поступления "грязных" средств на адрес (например, если рисковые средства поступали очень давно и затем смешивались с чистыми, общий риск мог "размыться"), доли подозрительных средств в общей сумме, наличия у клиента объяснений и документов и т.д. Такой комплексный анализ призван исключить ложные срабатывания и не создавать излишних препятствий добросовестным пользователям.
                        </p>
                        
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg">
                          <h5 className="font-semibold text-[#001D8D] mb-4">Если по результатам проверки установлено, что пользователь нарушил правила политики AML/CTF и KYC, Kenigswap вправе применить следующие меры:</h5>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <h6 className="font-semibold text-[#001D8D] text-sm mb-1">Приостановка операций</h6>
                                <p className="text-sm">Приостановить проведение операции обмена до выяснения обстоятельств и завершения расследования. Пользователь будет уведомлен о том, что транзакция задержана на проверку.</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <h6 className="font-semibold text-[#001D8D] text-sm mb-1">Запрос дополнительных документов</h6>
                                <p className="text-sm">Запросить у пользователя дополнительные документы, подтверждающие личность и легальность происхождения средств. В частности, мы можем потребовать актуальное фото (селфи) пользователя с паспортом в руках либо короткое видео, где он держит документ возле лица, чтобы убедиться, что именно владелец документа инициирует операцию. Также может потребоваться скриншот из личного кабинета криптокошелька или биржи, откуда осуществлён вывод средств, – это поможет проследить источник криптоактивов и их историю.</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <h6 className="font-semibold text-[#001D8D] text-sm mb-1">Блокировка аккаунта</h6>
                                <p className="text-sm">Временно заблокировать учётную запись пользователя на платформе и заморозить все связанные с ним операции (включая последующие заявки), если выявлены серьёзные нарушения. Одновременно информация о данном клиенте и его транзакциях может быть передана в уполномоченные органы, осуществляющие финансовый надзор, а также в правоохранительные органы по месту регистрации сервиса, если есть подозрение в преступной деятельности. Такая мера применяется в исключительных случаях грубого нарушения или когда того требует закон.</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <h6 className="font-semibold text-[#001D8D] text-sm mb-1">Удержание средств</h6>
                                <p className="text-sm">Удерживать замороженные средства клиента до завершения разбирательства. Средства не будут возвращены пользователю, пока он не предоставит все затребованные данные и пока служба безопасности Kenigswap не убедится в законности происхождения этих активов. Расследование проводится в разумные сроки, но их продолжительность может варьироваться в зависимости от сложности случая (например, ожидание ответов от сторонних организаций или государственных органов).</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <h6 className="font-semibold text-[#001D8D] text-sm mb-1">Возврат на исходные реквизиты</h6>
                                <p className="text-sm">Возврат средств исключительно на исходные реквизиты. Если по итогу проверки будет принято решение вернуть клиенту его криптовалюту (при условии, что легальное происхождение доказано), возврат будет произведён только на тот же адрес/кошелёк, с которого поступил первоначальный платёж. По усмотрению Kenigswap возможен перевод на иные реквизиты только после полной проверки и при наличии подтверждений, что новый адрес также принадлежит тому же пользователю и не связан с незаконной деятельностью. Такая мера преследует цель предотвратить попытки злоумышленников обналичить незаконные средства через подставных лиц.</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <h6 className="font-semibold text-[#001D8D] text-sm mb-1">Запрос дополнительных материалов</h6>
                                <p className="text-sm">Запрос иных необходимых материалов. Kenigswap может потребовать от пользователя любые дополнительные сведения, документы или пояснения, касающиеся спорной операции или его деятельности в целом. Например, документы, подтверждающие экономический смысл сделки, договоры, инвойсы, объяснительные письма и т.д. Пользователь обязан своевременно и полно содействовать такому запросу.</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <h6 className="font-semibold text-[#001D8D] text-sm mb-1">Окончательный отказ при отсутствии сотрудничества</h6>
                                <p className="text-sm">Окончательный отказ и конфискация при отсутствии сотрудничества. Если пользователь не выполняет требования по предоставлению информации и не отвечает на наши запросы в течение 6 месяцев с момента обращения, удерживаемые средства не подлежат возврату. Такой длительный срок ожидания предусмотрен на случай, если клиент по уважительным причинам не мог быстро ответить. Однако игнорирование запросов на протяжении полугода будет расценено как отказ от претензий на замороженные активы. Компания оставляет за собой право по истечении этого периода рассматривать вопрос о перечислении невостребованных средств в доход государства либо о другой процедуре, предусмотренной законом для подобных ситуаций.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p>
                          Приведённые меры соответствуют общепринятой мировой практике и нацелены на обеспечение строгого соблюдения режима ПОД/ФТ. Мы ценим доверие наших клиентов и прилагаем все усилия, чтобы добросовестные пользователи не испытывали лишних неудобств. В то же время Kenigswap будет бескомпромиссно пресекать любые попытки использовать нашу площадку для противоправной деятельности. Наша политика AML/CTF и KYC – это фундамент безопасности сервиса, который защищает как нас, так и наших клиентов, и способствует поддержанию чистоты и прозрачности криптовалютного рынка.
                        </p>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                          <h5 className="font-semibold text-[#001D8D] mb-3">Источники</h5>
                          <p className="text-sm">
                            Использованы требования и рекомендации из действующего законодательства и международных стандартов (ФАТФ), а также лучшие практики, опубликованные в открытых источниках для разработки и обоснования настоящей политики. Kenigswap будет регулярно пересматривать и обновлять данную политику в соответствии с актуальными нормативными изменениями и появлением новых рисков в сфере криптовалют.
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
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-yellow-400" />
                          <span>Профессиональная команда</span>
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