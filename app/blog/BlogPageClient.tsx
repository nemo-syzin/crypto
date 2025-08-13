"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen,
  Calendar,
  User,
  TrendingUp,
  Lightbulb,
  Globe,
  ArrowRight,
  Clock,
  Tag,
  Search,
  Filter,
  Star,
  Eye,
  MessageCircle,
  Share2,
  CheckCircle,
  Shield
} from 'lucide-react';

// Динамический импорт 3D-фона с отключенным SSR для улучшения производительности
const UnifiedVantaBackground = dynamic(
  () => import('@/components/shared/UnifiedVantaBackground').then(mod => ({ default: mod.UnifiedVantaBackground })),
  { 
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100" />
  }
);

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: 'news' | 'analytics' | 'guides' | 'updates';
  tags: string[];
  readTime: number;
  featured: boolean;
  imageUrl?: string;
}

export function BlogPageClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Пример данных блога (в будущем будет загружаться из базы данных)
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Обновление курсов обмена: новые возможности для пользователей',
      excerpt: 'Мы внедрили улучшенную систему мониторинга курсов, которая обеспечивает еще более точные и актуальные цены для обмена USDT на рубли.',
      content: '',
      author: 'Команда KenigSwap',
      publishedAt: '2024-01-15T10:00:00Z',
      category: 'updates',
      tags: ['обновления', 'курсы', 'USDT'],
      readTime: 3,
      featured: true,
      imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg'
    },
    {
      id: '2',
      title: 'Анализ рынка: тенденции криптовалют в 2024 году',
      excerpt: 'Подробный анализ текущих трендов на криптовалютном рынке и прогнозы развития основных цифровых активов.',
      content: '',
      author: 'Аналитический отдел',
      publishedAt: '2024-01-12T14:30:00Z',
      category: 'analytics',
      tags: ['анализ', 'тренды', 'прогнозы'],
      readTime: 7,
      featured: true,
      imageUrl: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg'
    },
    {
      id: '3',
      title: 'Как безопасно хранить криптовалюты: полное руководство',
      excerpt: 'Исчерпывающий гайд по безопасному хранению цифровых активов, включая холодные кошельки, мультиподпись и лучшие практики.',
      content: '',
      author: 'Отдел безопасности',
      publishedAt: '2024-01-10T09:15:00Z',
      category: 'guides',
      tags: ['безопасность', 'кошельки', 'хранение'],
      readTime: 12,
      featured: false,
      imageUrl: 'https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg'
    },
    {
      id: '4',
      title: 'Новости рынка: Bitcoin достиг нового максимума',
      excerpt: 'Bitcoin установил новый исторический максимум, превысив отметку в $50,000. Анализируем факторы роста и возможные последствия.',
      content: '',
      author: 'Редакция',
      publishedAt: '2024-01-08T16:45:00Z',
      category: 'news',
      tags: ['Bitcoin', 'новости', 'рост'],
      readTime: 5,
      featured: false,
      imageUrl: 'https://images.pexels.com/photos/6801647/pexels-photo-6801647.jpeg'
    }
  ];

  const categories = [
    { id: 'all', name: 'Все статьи', icon: BookOpen },
    { id: 'news', name: 'Новости', icon: Globe },
    { id: 'analytics', name: 'Аналитика', icon: TrendingUp },
    { id: 'guides', name: 'Гайды', icon: Lightbulb },
    { id: 'updates', name: 'Обновления', icon: Star }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'news': return 'bg-blue-100 text-blue-800';
      case 'analytics': return 'bg-green-100 text-green-800';
      case 'guides': return 'bg-purple-100 text-purple-800';
      case 'updates': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'news': return 'Новости';
      case 'analytics': return 'Аналитика';
      case 'guides': return 'Гайды';
      case 'updates': return 'Обновления';
      default: return 'Статья';
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background */}
      <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/10 to-blue-100/20 overflow-hidden">
        {isMounted && (
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
        )}

        {/* Gradient transitions */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-5" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-blue-100/20 z-5" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="space-y-24">
            
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="flex justify-center mb-6">
                <Badge className="bg-[#001D8D]/10 text-[#001D8D] border-[#001D8D]/20 px-6 py-2 text-lg">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Блог KenigSwap
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#001D8D]">
                Новости и <span className="bg-gradient-to-r from-[#001D8D] to-blue-600 bg-clip-text text-transparent">аналитика</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#001D8D]/80 max-w-4xl mx-auto leading-relaxed mb-8">
                Следите за последними новостями криптовалютного рынка, получайте экспертную аналитику 
                и изучайте полезные материалы от команды KenigSwap.
              </p>

              {/* Search and Filter */}
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#001D8D]/60" />
                    <input
                      type="text"
                      placeholder="Поиск по статьям..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/90 border border-[#001D8D]/20 rounded-lg text-[#001D8D] placeholder-[#001D8D]/60 focus:outline-none focus:ring-2 focus:ring-[#001D8D] focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 bg-white/90 border border-[#001D8D]/20 rounded-lg text-[#001D8D] focus:outline-none focus:ring-2 focus:ring-[#001D8D] focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto"
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
                    Рекомендуемые статьи
                  </h2>
                  <p className="text-xl text-[#001D8D]/70 max-w-3xl mx-auto">
                    Самые важные и актуальные материалы от наших экспертов
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group cursor-pointer"
                    >
                      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10 hover:border-[#001D8D]/30 transition-all duration-300 hover:shadow-xl hover:scale-105 transform overflow-hidden">
                        {post.imageUrl && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge className={getCategoryColor(post.category)}>
                                {getCategoryName(post.category)}
                              </Badge>
                            </div>
                          </div>
                        )}
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-[#001D8D] mb-3 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-[#001D8D]/70 leading-relaxed mb-4">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-[#001D8D]/60">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{post.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{post.readTime} мин</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(post.publishedAt)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* All Posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
                  Все статьи
                </h2>
                <p className="text-xl text-[#001D8D]/70 max-w-3xl mx-auto">
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'статья' : filteredPosts.length < 5 ? 'статьи' : 'статей'} 
                  {selectedCategory !== 'all' && ` в категории "${categories.find(c => c.id === selectedCategory)?.name}"`}
                </p>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group cursor-pointer"
                    >
                      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10 hover:border-[#001D8D]/30 transition-all duration-300 hover:shadow-xl hover:scale-105 transform overflow-hidden h-full">
                        {post.imageUrl && (
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className={getCategoryColor(post.category)}>
                                {getCategoryName(post.category)}
                              </Badge>
                            </div>
                          </div>
                        )}
                        <CardContent className="p-6 flex flex-col h-full">
                          <h3 className="text-lg font-bold text-[#001D8D] mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-[#001D8D]/70 leading-relaxed mb-4 flex-1 line-clamp-3">
                            {post.excerpt}
                          </p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-[#001D8D]/60 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{post.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{post.readTime} мин</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(post.publishedAt)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-[#001D8D]/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#001D8D] mb-2">
                    Статьи не найдены
                  </h3>
                  <p className="text-[#001D8D]/70 mb-6">
                    Попробуйте изменить критерии поиска или выбрать другую категорию
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    variant="outline"
                    className="text-[#001D8D] border-[#001D8D]/20"
                  >
                    Сбросить фильтры
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Newsletter Subscription */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-gradient-to-r from-[#001D8D] to-blue-700 text-white shadow-2xl border-none overflow-hidden">
                <CardContent className="p-12 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-50" />
                  <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                      <div className="bg-white/20 p-4 rounded-full">
                        <MessageCircle className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                      Не пропустите важные новости
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                      Подпишитесь на нашу рассылку и получайте самые важные новости криптовалютного рынка 
                      и обновления KenigSwap прямо на вашу почту.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                      <input
                        type="email"
                        placeholder="Ваш email адрес"
                        className="flex-1 px-4 py-3 rounded-lg text-[#001D8D] placeholder-[#001D8D]/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      <Button className="bg-white text-[#001D8D] hover:bg-gray-100 px-6 py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        Подписаться
                      </Button>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-white/80">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>Еженедельная рассылка</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>Эксклюзивная аналитика</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}