"use client";

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { 
  Shield,
  Eye,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Lock,
  Search,
  Scale,
  Building2,
  Gavel,
  UserCheck,
  Activity,
  Database,
  Clock,
  Award,
  Globe,
  Star
} from 'lucide-react';
import { UnifiedVantaBackground } from '@/components/shared/UnifiedVantaBackground';

export function AmlKycPolicyClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('goals');
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'goals', 'definitions', 'compliance', 'internal-control', 
        'compliance-officer', 'training', 'kyc-procedures', 
        'monitoring', 'reporting', 'audit', 'due-diligence', 
        'violations', 'sources'
      ];
      
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const tableOfContentsItems = [
    { id: 'goals', title: 'Цели политики и общие положения', icon: <Shield className="h-4 w-4" /> },
    { id: 'definitions', title: 'Определения противоправных действий', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'compliance', title: 'Выполнение требований законодательства', icon: <Gavel className="h-4 w-4" /> },
    { id: 'internal-control', title: 'Система внутреннего контроля', icon: <Eye className="h-4 w-4" /> },
    { id: 'compliance-officer', title: 'Сотрудник по соблюдению требований', icon: <UserCheck className="h-4 w-4" /> },
    { id: 'training', title: 'Обучение и информирование персонала', icon: <Users className="h-4 w-4" /> },
    { id: 'kyc-procedures', title: 'Процедуры проверки клиентов (KYC)', icon: <Search className="h-4 w-4" /> },
    { id: 'monitoring', title: 'Мониторинг транзакций', icon: <Activity className="h-4 w-4" /> },
    { id: 'reporting', title: 'Отчётность и хранение данных', icon: <Database className="h-4 w-4" /> },
    { id: 'audit', title: 'Внутренний аудит AML/CTF', icon: <Scale className="h-4 w-4" /> },
    { id: 'due-diligence', title: 'Применение мер due diligence', icon: <FileText className="h-4 w-4" /> },
    { id: 'violations', title: 'Меры при выявлении нарушений', icon: <Lock className="h-4 w-4" /> },
    { id: 'sources', title: 'Источники', icon: <Building2 className="h-4 w-4" /> }
  ];

  const handleSectionClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background */}
      <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/10 to-blue-100/20 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <UnifiedVantaBackground 
            type="topology"
            color={0x94bdff}
            color2={0xFF6B35}
            backgroundColor={0xffffff}
            points={15}
            maxDistance={20}
            spacing={16}
            showDots={true}
            speed={1.4}
            mouseControls={true}
            touchControls={true}
            forceAnimate={true}
          />
        </div>

        {/* Gradient transitions */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-5" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-blue-100/20 z-5" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Table of Contents - Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-24">
                <TableOfContents 
                  items={tableOfContentsItems}
                  activeItem={activeSection}
                  onItemClick={handleSectionClick}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="space-y-16">
                
                {/* Hero Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-16"
                >
                  <div className="flex justify-center mb-6">
                    <Badge className="bg-[#001D8D]/10 text-[#001D8D] border-[#001D8D]/20 px-6 py-2 text-lg">
                      <Shield className="h-5 w-5 mr-2" />
                      Политика безопасности
                    </Badge>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#001D8D]">
                    Политика <span className="bg-gradient-to-r from-[#001D8D] to-blue-600 bg-clip-text text-transparent">AML/CTF и KYC</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-[#001D8D]/80 max-w-4xl mx-auto leading-relaxed">
                    Сервиса Kenigswap
                  </p>
                </motion.div>

                {/* Goals Section */}
                <motion.div
                  id="goals"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Shield className="h-6 w-6" />
                        Цели политики и общие положения
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none">
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Политика противодействия отмыванию денег (AML, Anti-Money Laundering), финансированию терроризма (CTF, Counter-Terrorism Financing) и политика «Знай своего клиента» (KYC, Know Your Customer) сервиса Kenigswap разработана для защиты бизнеса и клиентов от незаконной деятельности. Данная политика направлена на выполнение требований законодательства и международных стандартов по противодействию финансовым преступлениям. Политики AML/CTF и KYC помогают идентифицировать клиентов, проверять их личность и финансовые данные, а также мониторить транзакции, которые могут быть связаны с противоправными действиями. Правильное применение этих политик обеспечивает прозрачность бизнеса, законность операций и минимизирует риски штрафов и потери репутации. Благодаря мерам AML и KYC компания избегает сотрудничества с подозрительными лицами, выполняет требования регуляторов и повышает доверие клиентов.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-600 p-2 rounded-lg">
                              <Shield className="h-5 w-5 text-white" />
                            </div>
                            <h4 className="font-bold text-blue-900">AML</h4>
                          </div>
                          <p className="text-sm text-blue-800">
                            Комплекс мер и процедур, предотвращающих легализацию преступных доходов посредством финансовых операций.
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-600 p-2 rounded-lg">
                              <AlertTriangle className="h-5 w-5 text-white" />
                            </div>
                            <h4 className="font-bold text-red-900">CTF</h4>
                          </div>
                          <p className="text-sm text-red-800">
                            Меры, направленные на недопущение финансирования террористических организаций и террористической деятельности.
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-600 p-2 rounded-lg">
                              <UserCheck className="h-5 w-5 text-white" />
                            </div>
                            <h4 className="font-bold text-green-900">KYC</h4>
                          </div>
                          <p className="text-sm text-green-800">
                            Процедуры проверки личности клиента и сбора информации о нём с целью убедиться в его благонадежности.
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-[#001D8D]/80 leading-relaxed">
                        В совокупности соблюдение правил AML/CTF и проведение процедур KYC позволяет поддерживать законность финансовых операций, защищает добросовестных пользователей и всю финансовую систему от злоупотреблений.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Definitions Section */}
                <motion.div
                  id="definitions"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6" />
                        Определения противоправных действий
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none">
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
                          <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Отмывание денег
                          </h4>
                          <p className="text-[#001D8D]/80 leading-relaxed mb-4">
                            Отмывание денег – это придание законного вида владению, пользованию или распоряжению денежными средствами или имуществом, полученными преступным путём. В официальных документах РФ это называется «легализация доходов, полученных преступным путем». Отмывание денег определяется законом посредством следующих действий:
                          </p>
                          <ul className="space-y-2 text-[#001D8D]/70">
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Конверсия или перевод имущества, полученного от преступной деятельности, с целью скрыть или утаить незаконное происхождение средств</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Приобретение, владение или использование имущества, полученного от преступной деятельности, при условии осведомленности о его преступном происхождении</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Сокрытие или утаивание истинной природы, источника, местонахождения, движения или права собственности на имущество, полученное в результате преступления</span>
                            </li>
                          </ul>
                          <p className="text-[#001D8D]/80 leading-relaxed mt-4">
                            Отмыванием денег также считается участие или пособничество в совершении, попытке совершения, подстрекательстве или консультировании в осуществлении любых из вышеупомянутых действий.
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200">
                          <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Финансирование терроризма
                          </h4>
                          <p className="text-[#001D8D]/80 leading-relaxed">
                            Финансирование терроризма – это предоставление финансовых средств или иной поддержки для совершения террористического акта, организация или оплата таких действий, а равно финансирование и поддержка поездок лиц с целью участия в террористической деятельности. Иными словами, финансирование терроризма включает любую материальную поддержку террористов, террористических групп либо связанных с ними мероприятий.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Compliance Section */}
                <motion.div
                  id="compliance"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Gavel className="h-6 w-6" />
                        Выполнение требований законодательства
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none">
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Kenigswap строго соблюдает все применимые международные и российские нормативные акты по противодействию отмыванию денег и финансированию терроризма, включая рекомендации ФАТФ и Федеральный закон РФ №115-ФЗ «О противодействии легализации доходов, полученных преступным путем, и финансированию терроризма». Международные и местные нормы обязывают нас внедрять эффективные внутренние процедуры и механизмы для предотвращения отмывания денег, финансирования терроризма, торговли наркотиками и людьми, распространения оружия массового уничтожения, коррупции и других финансовых преступлений. В случае выявления подозрительной активности мы предпринимаем необходимые меры, предусмотренные законом, и взаимодействуем с уполномоченными органами.
                      </p>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                        <h4 className="font-bold text-blue-900 mb-4">Политика AML/CTF сервиса Kenigswap охватывает следующие ключевые элементы:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                            <div>
                              <div className="font-semibold text-blue-900">Внутренний контроль</div>
                              <div className="text-sm text-blue-800">Действенная система внутренних правил и процедур</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                            <div>
                              <div className="font-semibold text-blue-900">Комплаенс-офицер</div>
                              <div className="text-sm text-blue-800">Специально назначенный сотрудник по соблюдению</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                            <div>
                              <div className="font-semibold text-blue-900">Обучение персонала</div>
                              <div className="text-sm text-blue-800">Регулярное повышение осведомленности сотрудников</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                            <div>
                              <div className="font-semibold text-blue-900">Проверка клиентов</div>
                              <div className="text-sm text-blue-800">Идентификация, верификация и комплексная проверка</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                            <div>
                              <div className="font-semibold text-blue-900">Мониторинг транзакций</div>
                              <div className="text-sm text-blue-800">Риск-ориентированный подход и выявление подозрительных операций</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                            <div>
                              <div className="font-semibold text-blue-900">Независимый аудит</div>
                              <div className="text-sm text-blue-800">Периодическая проверка эффективности программы</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Internal Control Section */}
                <motion.div
                  id="internal-control"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Eye className="h-6 w-6" />
                        Система внутреннего контроля
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none">
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Мы разработали структурированную систему внутреннего контроля для соблюдения всех применимых требований AML/CTF. Эта система предусматривает:
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                          <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
                            <UserCheck className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-blue-900 mb-2">Идентификация клиентов</h5>
                            <p className="text-blue-800 text-sm">Проверка личности клиентов и достоверности предоставленных ими сведений при установлении деловых отношений.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                          <div className="bg-purple-600 p-2 rounded-lg flex-shrink-0">
                            <Star className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-purple-900 mb-2">Обслуживание ПЗЛ (PEP)</h5>
                            <p className="text-purple-800 text-sm">Особый порядок обслуживания политически значимых лиц с применением усиленных мер проверки. Такие клиенты автоматически относятся к группе повышенного риска.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                          <div className="bg-orange-600 p-2 rounded-lg flex-shrink-0">
                            <Activity className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-orange-900 mb-2">Выявление подозрительных операций</h5>
                            <p className="text-orange-800 text-sm">Фиксация необычных операций по счетам клиентов и направление отчётов о подозрительной деятельности (SAR) во уполномоченные органы.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                          <div className="bg-green-600 p-2 rounded-lg flex-shrink-0">
                            <Database className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-green-900 mb-2">Ведение документации</h5>
                            <p className="text-green-800 text-sm">Все документы по клиентам и их операциям хранятся в надлежащем порядке и могут быть быстро найдены для проверки или предоставления регуляторам.</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Compliance Officer Section */}
                <motion.div
                  id="compliance-officer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <UserCheck className="h-6 w-6" />
                        Сотрудник по соблюдению требований (Комплаенс-офицер)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none">
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Для обеспечения эффективной реализации политики AML/CTF назначается специально уполномоченный комплаенс-офицер (сотрудник службы безопасности). Комплаенс-офицер отвечает за разработку и внедрение всех мер по ПОД/ФТ, а также за надзор за их исполнением. Он контролирует все аспекты программы AML/CTF Kenigswap и, в частности, выполняет следующие обязанности:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#001D8D]">Разработка политик</h5>
                              <p className="text-sm text-[#001D8D]/70">Актуализация внутренних политик и процедур, регламентирующих сбор, проверку и хранение отчётов</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <Search className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#001D8D]">Контроль идентификации</h5>
                              <p className="text-sm text-[#001D8D]/70">Контроль процесса идентификации и верификации новых клиентов, включая сопоставление с санкционными списками</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="bg-purple-100 p-2 rounded-lg">
                              <Database className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#001D8D]">Управление записями</h5>
                              <p className="text-sm text-[#001D8D]/70">Внедрение системы учёта, гарантирующей надлежащее хранение всех документов и форм</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                              <Activity className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#001D8D]">Анализ операций</h5>
                              <p className="text-sm text-[#001D8D]/70">Расследование необычных операций, которые могут быть связаны с отмыванием денег или финансированием терроризма</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-red-100 p-2 rounded-lg">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#001D8D]">Сообщение о подозрительной деятельности</h5>
                              <p className="text-sm text-[#001D8D]/70">Подготовка и подача отчётов о подозрительной операции (ОПО) в уполномоченные органы</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                              <Building2 className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#001D8D]">Информирование руководства</h5>
                              <p className="text-sm text-[#001D8D]/70">Предоставление письменных отчётов о состоянии соблюдения AML/CTF-требований</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="bg-yellow-100 p-2 rounded-lg">
                              <Users className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#001D8D]">Организация обучения</h5>
                              <p className="text-sm text-[#001D8D]/70">Ответственность за программу подготовки персонала по вопросам ПОД/ФТ</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="bg-teal-100 p-2 rounded-lg">
                              <Scale className="h-4 w-4 text-teal-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#001D8D]">Оценка рисков</h5>
                              <p className="text-sm text-[#001D8D]/70">Проведение регулярной переоценки рисков клиентов и операций</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <p className="text-[#001D8D]/80 leading-relaxed">
                          Комплаенс-офицер обладает необходимыми полномочиями для выполнения своих задач. В частности, он имеет право запрашивать у клиентов дополнительную информацию, приостанавливать подозрительные транзакции для проверки, а также взаимодействовать с правоохранительными и надзорными органами. Комплаенс-офицер подчиняется непосредственно высшему руководству Kenigswap, что гарантирует независимость его функций и приоритетность целей AML/CTF.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Training Section */}
                <motion.div
                  id="training"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Users className="h-6 w-6" />
                        Обучение и информирование персонала
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none">
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Все сотрудники Kenigswap, так или иначе участвующие в проведении операций, проходят обязательное обучение по вопросам AML/CTF и KYC. Обучение проводится при найме нового сотрудника и далее на регулярной основе – не реже одного раза в год – в форме тренингов, семинаров и экзаменов на знание политики компании. Это позволяет поддерживать высокий уровень осведомленности персонала обо всех актуальных угрозах и способах их выявления.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                          <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Программа обучения включает:
                          </h4>
                          <ul className="space-y-2 text-green-800">
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Реальные примеры мошеннических схем</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Изучение изменений законодательства</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Лучшие международные практики</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Новые рекомендации ФАТФ</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                          <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Контроль знаний:
                          </h4>
                          <ul className="space-y-2 text-blue-800">
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Периодическое тестирование</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Оценка практических навыков</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Внеочередное обучение при изменениях</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Методические материалы</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <p className="text-[#001D8D]/80 leading-relaxed mt-6">
                        Такой подход гарантирует, что каждый сотрудник Kenigswap чётко понимает свои обязанности в рамках политики AML/CTF и способен распознать и должным образом реагировать на подозрительные ситуации.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* KYC Procedures Section */}
                <motion.div
                  id="kyc-procedures"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Search className="h-6 w-6" />
                        Процедуры проверки клиентов (KYC и Due Diligence)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none">
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Kenigswap внедрил собственные процедуры проверки клиентов в соответствии со стандартами AML/CTF и принципом «Знай своего клиента». Прежде чем вступить с клиентом в деловые отношения, компания проводит процедуру надлежащей проверки – Customer Due Diligence (CDD). Основные элементы процессов идентификации и верификации клиентов включают:
                      </p>
                      
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                          <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <UserCheck className="h-5 w-5" />
                            Сбор идентификационных данных клиента
                          </h4>
                          <p className="text-blue-800 text-sm leading-relaxed">
                            На этапе регистрации пользователь обязан предоставить достоверную персональную информацию: полное имя, дату рождения, гражданство, адрес проживания, контактные данные. Для подтверждения личности запрашиваются документы – обычно государственный документ с фотографией. Для организаций запрашиваются регистрационные документы, информация о руководстве и бенефициарных владельцах.
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                          <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Верификация личности и документов
                          </h4>
                          <p className="text-green-800 text-sm leading-relaxed">
                            Предоставленные клиентом сведения проверяются на подлинность. Kenigswap использует современные инструменты и базы данных для проверки документов и личности: сравнение фото в документе с селфи клиента, проверка валидности паспорта, сверка адреса. Также осуществляется сопоставление с международными санкционными списками, списками террористов и другими списками наблюдения, а также с перечнями политически значимых лиц (PEP).
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                          <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Установление источника средств
                          </h4>
                          <p className="text-purple-800 text-sm leading-relaxed">
                            В рамках политики KYC компания вправе запросить у клиента информацию и подтверждающие документы о происхождении денежных средств или криптоактивов, участвующих в сделках. Это особенно важно, если речь идёт о крупных суммах или если поведение клиента кажется нестандартным.
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                          <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                            <Scale className="h-5 w-5" />
                            Оценка рискового профиля клиента
                          </h4>
                          <p className="text-orange-800 text-sm leading-relaxed">
                            На основании собранных данных Kenigswap присваивает каждому новому клиенту определённый уровень риска – низкий, средний или высокий. Этот комплаенс-риск профиль рассчитывается при начале взаимоотношений и периодически пересматривается впоследствии. На оценку влияют различные факторы: страна проживания клиента, статус клиента, вид планируемых операций, объемы средств, репутация клиента.
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
                          <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Усиленная проверка (EDD) для повышенных рисков
                          </h4>
                          <p className="text-red-800 text-sm leading-relaxed">
                            Если клиент отнесён к категории высокого риска, либо является юридическим лицом со сложной структурой собственности, либо подпадает под статус PEP – к нему применяются расширенные процедуры проверки. Это может включать запрос дополнительных документов, более тщательное изучение биографии и деловой репутации, мониторинг упоминаний о клиенте в СМИ и открытых источниках.
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                        <p className="text-[#001D8D]/80 leading-relaxed">
                          <strong>Важно:</strong> Прохождение перечисленных этапов KYC является обязательным для всех новых пользователей Kenigswap. До завершения идентификации и проверки личность клиента считается не установленной, и проведение операций с криптовалютой ему недоступно. Если на каком-либо этапе клиент отказывается предоставить запрошенные сведения или выявляются факты, вызывающие обоснованные подозрения, компания вправе отказать ему в обслуживании.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Monitoring Section */}
                <motion.div
                  id="monitoring"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Activity className="h-6 w-6" />
                        Мониторинг транзакций и риск-ориентированный подход
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none">
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Kenigswap осуществляет непрерывный мониторинг операций клиентов, применяя при этом риск-ориентированный подход в соответствии с международными стандартами. Это означает, что интенсивность и фокус контроля устанавливаются пропорционально уровню риска, который представляет конкретный клиент или транзакция.
                      </p>
                      
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                          <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Автоматизированный анализ транзакций
                          </h4>
                          <p className="text-blue-800 text-sm leading-relaxed">
                            В сервисе внедрена специализированная система мониторинга, которая в режиме реального времени отслеживает все операции обмена. Система использует современные аналитические инструменты (включая алгоритмы анализа блокчейн-транзакций и поведенческие модели) для выявления паттернов, характерных для отмывания денег.
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                          <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                            <UserCheck className="h-5 w-5" />
                            Сопоставление операций с профилем клиента
                          </h4>
                          <p className="text-green-800 text-sm leading-relaxed">
                            Каждая сделка оценивается на предмет соответствия известной информации о клиенте – его обычной деятельности, заявленным источникам средств, уровням доходов. Если транзакция существенно отклоняется от ожидаемого поведения клиента, она помечается как необычная и подлежит дополнительной проверке.
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                          <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Критерии подозрительных операций
                          </h4>
                          <p className="text-orange-800 text-sm leading-relaxed mb-3">
                            Определение того, считать ли операцию подозрительной, во многом основывается на профессиональном суждении, опирающемся на знание клиента, его финансовое поведение и информацию о контрагентах. Признаками подозрительности могут быть:
                          </p>
                          <ul className="space-y-1 text-orange-800 text-sm">
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Необычно крупные суммы</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Сложные цепочки перевода средств</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Использование криптомиксеров</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Участие адресов из санкционных списков</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Частая разбивка суммы на мелкие переводы</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                          <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Решение о сообщении (SAR)
                          </h4>
                          <p className="text-purple-800 text-sm leading-relaxed">
                            Все отмеченные системой нестандартные операции проверяются комплаенс-офицером. Он проводит разбор: связывается с клиентом за пояснениями при необходимости, анализирует дополнительную информацию о транзакции. По итогам анализа принимается решение – составляет ли данная операция подозрительную активность, подлежащую обязательному сообщению в компетентные органы.
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
                          <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                            <Scale className="h-5 w-5" />
                            Пересмотр рискового профиля
                          </h4>
                          <p className="text-red-800 text-sm leading-relaxed">
                            После анализа подозрительной активности профиль риска клиента может быть пересмотрен. Например, обнаружение сомнительной операции может повысить категорию риска клиента с «средней» до «высокой», что повлечёт более строгий контроль последующих его действий. Профили рисков всех клиентов также планово пересматриваются через определённые интервалы времени.
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                        <p className="text-[#001D8D]/80 leading-relaxed">
                          В рамках риск-ориентированного подхода Kenigswap уделяет особое внимание операциям, которые по своей природе или параметрам относятся к повышенному риску. В частности, усиленный мониторинг ведётся за сложными, многоэтапными сделками, операциями на необычно крупные суммы, транзакциями, связанными с юрисдикциями из списка стран с недостаточным уровнем ПОД/ФТ, и любыми операциями, в которых участвуют контрагенты или адреса из санкционных списков.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Reporting Section */}
                <motion.div
                  id="reporting"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Database className="h-6 w-6" />
                        Отчётность и хранение данных
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none">
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Kenigswap соблюдает все требования по финансовой отчётности и хранению информации, связанные с программой AML/CTF. Во-первых, как отмечалось, при возникновении подозрений мы направляем уведомления о подозрительных операциях (SAR) в уполномоченные органы, такие как Росфинмониторинг. Мы также готовы предоставить полную информацию о клиенте и произведённых транзакциях по официальному запросу регулятора или правоохранительных органов в установленные сроки.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                          <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Сроки хранения данных
                          </h4>
                          <div className="space-y-3 text-blue-800 text-sm">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Документы по клиентам: <strong>не менее 5 лет</strong> после завершения отношений</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Документы по разовым сделкам: <strong>не менее 5 лет</strong> после завершения операции</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Журналы контроля и отчётности: <strong>не менее 5 лет</strong> после подачи отчёта</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                          <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Защита информации
                          </h4>
                          <div className="space-y-3 text-green-800 text-sm">
                            <div className="flex items-start gap-2">
                              <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>Безопасное электронное хранение с ограниченным доступом</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <UserCheck className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>Доступ только у ответственных лиц</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>Возможность продления срока хранения при необходимости</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                        <p className="text-[#001D8D]/80 leading-relaxed">
                          <strong>Важно:</strong> Все сотрудники Kenigswap обязаны немедленно информировать комплаенс-офицера, если они обнаружили какую-либо нетипичную операцию клиента, которая не вписывается в его известный профиль или законную деятельность. Такая бдительность персонала является частью корпоративной культуры и дополнительно обеспечивает своевременное выявление подозрительных операций.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Audit Section */}
                <motion.div
                  id="audit"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Scale className="h-6 w-6" />
                        Внутренний аудит AML/CTF
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none">
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Для проверки эффективности и актуальности реализованных мер ПОД/ФТ в Kenigswap предусмотрен регулярный внутренний аудит программы AML/CTF. По поручению руководства комплаенс-офицер организует проведение аудиторской проверки не реже одного раза в год. Аудит может выполняться как внутренними ревизорами компании, не вовлечёнными в ежедневные комплаенс-процедуры, так и независимыми экспертами или специализированными организациями.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                          <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            Цели аудита
                          </h4>
                          <ul className="space-y-2 text-purple-800 text-sm">
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Оценка полноты соблюдения установленных политик AML/CTF</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Выявление возможных пробелов в системе контроля</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Проверка адекватности ведения документации</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Оценка качества отчётности</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
                          <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Результаты аудита
                          </h4>
                          <ul className="space-y-2 text-indigo-800 text-sm">
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Отчёт с описанием обнаруженных недостатков</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Рекомендации по устранению проблем</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>План корректирующих мер</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Контроль реализации улучшений</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <p className="text-[#001D8D]/80 leading-relaxed mt-6">
                        Кроме ежегодных плановых проверок, внеочередной аудит программы AML может проводиться при существенных изменениях в регулировании или внутренней структуре компании, либо в случае инцидента, выявившего слабое место в действующих процедурах. Такой подход гарантирует, что политика AML/CTF не является статичным документом, а постоянно совершенствуется и адаптируется к новым вызовам.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Due Diligence Section */}
                <motion.div
                  id="due-diligence"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <FileText className="h-6 w-6" />
                        Применение мер due diligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none">
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Kenigswap применяет меры углублённой проверки (due diligence) клиентов не только при первичном их принятии на обслуживание, но и в ряде других случаев, предусмотренных законом и внутренними процедурами. Дополнительная проверка проводится, если:
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                          <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
                            <UserCheck className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-blue-900 mb-2">Установление деловых отношений</h5>
                            <p className="text-blue-800 text-sm">Клиент устанавливает деловые отношения с сервисом (регистрация и начало операций) – первичная идентификация и KYC обязательны для всех.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                          <div className="bg-orange-600 p-2 rounded-lg flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-orange-900 mb-2">Сомнения в достоверности данных</h5>
                            <p className="text-orange-800 text-sm">Возникают сомнения в достоверности или полноте ранее полученных данных о клиенте – например, если документы вызывают подозрения в подлинности, либо появились противоречивые сведения.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                          <div className="bg-green-600 p-2 rounded-lg flex-shrink-0">
                            <Clock className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-green-900 mb-2">Обновление данных</h5>
                            <p className="text-green-800 text-sm">Периодически (раз в год либо в иной срок, установленный политикой) Kenigswap может проводить ревалидацию данных клиента, запрашивать актуальные версии документов.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                          <div className="bg-red-600 p-2 rounded-lg flex-shrink-0">
                            <Search className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-red-900 mb-2">Подозрения в противоправной деятельности</h5>
                            <p className="text-red-800 text-sm">У компании появляются подозрения в том, что конкретная транзакция или деятельность клиента связаны с отмыванием денег или финансированием терроризма.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                          <div className="bg-purple-600 p-2 rounded-lg flex-shrink-0">
                            <Gavel className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-purple-900 mb-2">Иные случаи</h5>
                            <p className="text-purple-800 text-sm">Случаи, предусмотренные законодательством или внутренними «красными флажками». Например, поступление официального уведомления от правоохранительных органов о конкретном клиенте.</p>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-[#001D8D]/80 leading-relaxed mt-6">
                        Таким образом, принципы KYC и due diligence пронизывают всё взаимодействие Kenigswap с пользователями: от момента регистрации до завершения отношений. Мы постоянно поддерживаем актуальность клиентских данных и степень доверия к ним.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Violations Section */}
                <motion.div
                  id="violations"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Lock className="h-6 w-6" />
                        Меры при выявлении нарушений и подозрительной активности
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none">
                      <p className="text-[#001D8D]/80 leading-relaxed mb-6">
                        Kenigswap оставляет за собой право применять дополнительные меры контроля или ограничения, если деятельность пользователя нарушает правила данной политики либо его транзакции получают высокие показатели риска по результатам AML-анализов. Мы используем в работе профессиональные аналитические сервисы для оценки «чистоты» криптовалютных транзакций.
                      </p>
                      
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
                          <h4 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Заморозка средств при высоком риск-скоринге
                          </h4>
                          <p className="text-red-800 text-sm leading-relaxed mb-3">
                            Если суммарный риск транзакции превышает установленный порог (как правило, 70%), операция подлежит немедленной приостановке. Средства временно замораживаются на нашем кошельке до выяснения обстоятельств.
                          </p>
                          <div className="bg-red-200 p-3 rounded text-red-900 text-xs">
                            <strong>Важно:</strong> В отдельных случаях блокировка может применяться и при меньшем проценте риска – решение принимается индивидуально с учётом структуры риска.
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                          <h4 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Санкционные и «миксерные» адреса
                          </h4>
                          <p className="text-orange-800 text-sm leading-relaxed mb-3">
                            Средства с санкционных или «миксерных» адресов не принимаются. Если поступающие криптоактивы помечены как имеющие связь с санкционными сервисами либо прошли через cryptocurrency mixers, то такие средства будут заморожены независимо от общего процента риска.
                          </p>
                          <div className="bg-orange-200 p-3 rounded text-orange-900 text-xs">
                            <strong>Предупреждение:</strong> Регуляторные органы могут изъять или заблокировать подобные активы на неопределённый срок.
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
                          <h4 className="font-bold text-yellow-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Признаки мошенничества (Victim Report)
                          </h4>
                          <p className="text-yellow-800 text-sm leading-relaxed">
                            Если транзакция помечена статусом "victim-report" (что означает наличие официальной жалобы или уголовного дела), такие средства подлежат немедленной заморозке. Компания обязана будет сотрудничать с правоохранительными органами и, возможно, вернуть средства жертве преступления по предписанию суда.
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                          <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Блокировка отдельных источников
                          </h4>
                          <p className="text-purple-800 text-sm leading-relaxed mb-3">
                            Kenigswap в рамках своей внутренней политики может заранее не обслуживать транзакции из определённых систем или адресов, имеющих неблагонадежную репутацию.
                          </p>
                          <div className="bg-purple-200 p-3 rounded text-purple-900 text-xs">
                            <strong>Примечание:</strong> На данный момент не принимаются депозиты с кошельков CommEX, Capitalist и некоторых других, зарекомендовавших себя как высокорисковые.
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <h4 className="font-bold text-blue-900 mb-4">Меры при нарушении правил политики AML/CTF и KYC:</h4>
                        <div className="space-y-3 text-blue-800 text-sm">
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Приостановить проведение операции обмена до выяснения обстоятельств</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Запросить дополнительные документы, подтверждающие личность и легальность происхождения средств</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Временно заблокировать учётную запись пользователя на платформе</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Удерживать замороженные средства до завершения разбирательства</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Возврат средств исключительно на исходные реквизиты</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Окончательный отказ и конфискация при отсутствии сотрудничества в течение 6 месяцев</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-[#001D8D]/80 leading-relaxed mt-6">
                        Приведённые меры соответствуют общепринятой мировой практике и нацелены на обеспечение строгого соблюдения режима ПОД/ФТ. Мы ценим доверие наших клиентов и прилагаем все усилия, чтобы добросовестные пользователи не испытывали лишних неудобств. В то же время Kenigswap будет бескомпромиссно пресекать любые попытки использовать нашу площадку для противоправной деятельности.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Sources Section */}
                <motion.div
                  id="sources"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                    <CardHeader>
                      <CardTitle className="text-[#001D8D] flex items-center gap-3">
                        <Building2 className="h-6 w-6" />
                        Источники
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none">
                      <p className="text-[#001D8D]/80 leading-relaxed">
                        Использованы требования и рекомендации из действующего законодательства и международных стандартов (ФАТФ), а также лучшие практики, опубликованные в открытых источниках для разработки и обоснования настоящей политики. Kenigswap будет регулярно пересматривать и обновлять данную политику в соответствии с актуальными нормативными изменениями и появлением новых рисков в сфере криптовалют.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Final CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="max-w-5xl mx-auto"
                >
                  <Card className="bg-gradient-to-r from-[#001D8D] to-blue-700 text-white shadow-2xl border-none overflow-hidden">
                    <CardContent className="p-12 text-center relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-50" />
                      <div className="relative z-10">
                        <div className="flex justify-center mb-6">
                          <div className="bg-white/20 p-4 rounded-full">
                            <CheckCircle className="h-12 w-12 text-white" />
                          </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                          Безопасность превыше всего
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                          Наша политика AML/CTF и KYC обеспечивает максимальную защиту для всех участников 
                          криптовалютного рынка и способствует созданию безопасной экосистемы.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button className="bg-white text-[#001D8D] hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Начать обмен
                          </Button>
                          <Button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold transition-all duration-300">
                            <Users className="h-5 w-5 mr-2" />
                            Связаться с нами
                          </Button>
                        </div>

                        {/* Trust indicators */}
                        <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-sm text-white/80">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Соответствие международным стандартам</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-400" />
                            <span>Полное соблюдение AML/KYC</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-yellow-400" />
                            <span>Профессиональная команда</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-purple-400" />
                            <span>Международные стандарты</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}