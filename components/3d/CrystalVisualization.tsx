"use client";

import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Heart, TrendingUp, Globe, Rocket } from 'lucide-react';

interface Goal {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  progress: number;
  metric: string;
  details: string[];
  color: string;
}

const goals: Goal[] = [
  {
    id: 0,
    icon: Heart,
    title: "Доверительные отношения",
    description: "Создавать и поддерживать доверительные, долгосрочные отношения с нашими клиентами.",
    progress: 85,
    metric: "85%",
    details: [
      "Повышение уровня удовлетворенности клиентов",
      "Развитие программы лояльности",
      "Персонализированный подход к каждому клиенту"
    ],
    color: "#ef4444"
  },
  {
    id: 1,
    icon: TrendingUp,
    title: "Повышение квалификации",
    description: "Непрерывно повышать уровень квалификации наших специалистов.",
    progress: 70,
    metric: "70%",
    details: [
      "Регулярные тренинги и сертификации",
      "Изучение новых технологий",
      "Обмен опытом с международными экспертами"
    ],
    color: "#10b981"
  },
  {
    id: 2,
    icon: Globe,
    title: "Регистрация на BestChange",
    description: "Зарегистрироваться и активно работать на платформе BestChange.",
    progress: 45,
    metric: "45%",
    details: [
      "Подготовка документации",
      "Соответствие требованиям платформы",
      "Интеграция с системами BestChange"
    ],
    color: "#3b82f6"
  },
  {
    id: 3,
    icon: Rocket,
    title: "Технологическое развитие",
    description: "Расширить технологические возможности и ассортимент предоставляемых услуг.",
    progress: 60,
    metric: "60%",
    details: [
      "Разработка собственной инфраструктуры",
      "Внедрение новых технологий",
      "Автоматизация процессов"
    ],
    color: "#8b5cf6"
  }
];

// Crystal geometry component
function Crystal({ onFaceClick, hoveredFace, setHoveredFace }: {
  onFaceClick: (goalId: number) => void;
  hoveredFace: number | null;
  setHoveredFace: (id: number | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera, raycaster, pointer } = useThree();
  
  // Auto-rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005; // 0.1 radians per second at 60fps
    }
  });

  // Create crystal geometry (octahedron)
  const geometry = new THREE.OctahedronGeometry(2, 0);
  
  // Handle mouse interactions
  useFrame(() => {
    if (!meshRef.current) return;
    
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(meshRef.current);
    
    if (intersects.length > 0) {
      const faceIndex = Math.floor(intersects[0].faceIndex! / 2); // Each face has 2 triangles
      const goalId = faceIndex % 4; // Map to our 4 goals
      setHoveredFace(goalId);
    } else {
      setHoveredFace(null);
    }
  });

  const handleClick = () => {
    if (hoveredFace !== null) {
      onFaceClick(hoveredFace);
    }
  };

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={handleClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        <meshPhysicalMaterial
          color={hoveredFace !== null ? "#007bff" : "#ffffff"}
          transparent
          opacity={0.7}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.9}
          emissive={hoveredFace !== null ? "#007bff" : "#000000"}
          emissiveIntensity={hoveredFace !== null ? 0.2 : 0}
        />
      </mesh>
      
      {/* Goal labels */}
      {goals.map((goal, index) => {
        const angle = (index / goals.length) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <Text
            key={goal.id}
            position={[x, 0, z]}
            fontSize={0.3}
            color={goal.color}
            anchorX="center"
            anchorY="middle"
            rotation={[0, -angle, 0]}
          >
            {goal.title}
          </Text>
        );
      })}
      
      {/* Halo effect */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial
          color="#94bdff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Fallback SVG crystal
function FallbackCrystal({ onFaceClick, className }: {
  onFaceClick: (goalId: number) => void;
  className?: string;
}) {
  const [hoveredFace, setHoveredFace] = useState<number | null>(null);

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))' }}
      >
        {/* Crystal faces */}
        {goals.map((goal, index) => {
          const angle = (index / goals.length) * Math.PI * 2;
          const centerX = 200;
          const centerY = 200;
          const radius = 80;
          
          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          const x2 = centerX + Math.cos(angle + Math.PI / 2) * radius;
          const y2 = centerY + Math.sin(angle + Math.PI / 2) * radius;
          
          return (
            <g key={goal.id}>
              <polygon
                points={`${centerX},${centerY} ${x1},${y1} ${x2},${y2}`}
                fill={hoveredFace === goal.id ? goal.color : "rgba(255, 255, 255, 0.7)"}
                stroke={goal.color}
                strokeWidth="2"
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredFace(goal.id)}
                onMouseLeave={() => setHoveredFace(null)}
                onClick={() => onFaceClick(goal.id)}
              />
              <text
                x={centerX + Math.cos(angle + Math.PI / 4) * radius * 0.6}
                y={centerY + Math.sin(angle + Math.PI / 4) * radius * 0.6}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-semibold fill-current"
                style={{ color: goal.color }}
              >
                {goal.title.split(' ')[0]}
              </text>
            </g>
          );
        })}
        
        {/* Center circle */}
        <circle
          cx="200"
          cy="200"
          r="30"
          fill="rgba(148, 189, 255, 0.3)"
          stroke="#94bdff"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

// Goal modal
function GoalModal({ goal, isOpen, onClose }: {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!goal) return null;

  const IconComponent = goal.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-none shadow-none">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${goal.color}20` }}
                    >
                      <IconComponent 
                        className="h-6 w-6" 
                        style={{ color: goal.color }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-[#001D8D]">
                        {goal.title}
                      </CardTitle>
                      <Badge 
                        className="mt-1"
                        style={{ 
                          backgroundColor: `${goal.color}20`,
                          color: goal.color,
                          border: `1px solid ${goal.color}40`
                        }}
                      >
                        {goal.metric} завершено
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-[#001D8D]/70 leading-relaxed">
                  {goal.description}
                </p>
                
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[#001D8D]/70">
                      Прогресс выполнения
                    </span>
                    <span className="text-sm font-bold text-[#001D8D]">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div 
                      className="h-2 rounded-full"
                      style={{ backgroundColor: goal.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
                
                {/* Details */}
                <div>
                  <h4 className="font-semibold text-[#001D8D] mb-3">
                    Ключевые направления:
                  </h4>
                  <ul className="space-y-2">
                    {goal.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div 
                          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: goal.color }}
                        />
                        <span className="text-sm text-[#001D8D]/70">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main component
export function CrystalVisualization() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredFace, setHoveredFace] = useState<number | null>(null);
  const [use3D, setUse3D] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check for low-end devices
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      setUse3D(false);
      return;
    }

    // Check GPU capabilities
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      // Fallback for integrated graphics or mobile
      if (renderer.includes('Intel') || renderer.includes('Mali') || renderer.includes('Adreno')) {
        setUse3D(false);
      }
    }
  }, []);

  const handleFaceClick = (goalId: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      setSelectedGoal(goal);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedGoal(null);
  };

  if (!isClient) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-pulse text-[#001D8D]">
          Загрузка 3D визуализации...
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="text-center mb-8">
        <Badge className="bg-gradient-to-r from-[#001D8D] to-blue-600 text-white px-6 py-2 text-lg mb-6">
          <Rocket className="h-5 w-5 mr-2" />
          Интерактивные стратегические цели
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
          Наши цели до 2026 года
        </h2>
        <p className="text-xl text-[#001D8D]/70 max-w-3xl mx-auto mb-4">
          Нажмите на грани кристалла, чтобы узнать подробности о каждой цели
        </p>
        <p className="text-sm text-[#001D8D]/50">
          {use3D ? '3D режим активен' : 'Упрощенный режим для лучшей производительности'}
        </p>
      </div>

      <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl overflow-hidden">
        {use3D ? (
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001D8D]"></div>
            </div>
          }>
            <Canvas
              camera={{ position: [0, 0, 8], fov: 50 }}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={0.8} />
              <pointLight position={[-10, -10, -10]} intensity={0.4} />
              
              <Crystal
                onFaceClick={handleFaceClick}
                hoveredFace={hoveredFace}
                setHoveredFace={setHoveredFace}
              />
              
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                autoRotate={false}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 3}
              />
            </Canvas>
          </Suspense>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-8">
            <FallbackCrystal
              onFaceClick={handleFaceClick}
              className="w-full max-w-sm h-full"
            />
          </div>
        )}
        
        {/* Interaction hint */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-sm text-[#001D8D]/70">
              {use3D ? 'Наведите курсор и нажмите на грани кристалла' : 'Нажмите на секции для подробностей'}
            </p>
          </div>
        </div>
      </div>

      {/* Goal cards preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {goals.map((goal) => {
          const IconComponent = goal.icon;
          return (
            <motion.div
              key={goal.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                hoveredFace === goal.id 
                  ? 'border-current shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ 
                borderColor: hoveredFace === goal.id ? goal.color : undefined,
                backgroundColor: hoveredFace === goal.id ? `${goal.color}10` : 'white'
              }}
              onClick={() => handleFaceClick(goal.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <IconComponent 
                  className="h-4 w-4" 
                  style={{ color: goal.color }}
                />
                <span className="text-sm font-semibold text-[#001D8D]">
                  {goal.title}
                </span>
              </div>
              <div className="text-xs text-[#001D8D]/70 mb-2">
                {goal.description.substring(0, 50)}...
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: goal.color }}>
                  {goal.metric}
                </span>
                <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${goal.progress}%`,
                      backgroundColor: goal.color 
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <GoalModal
        goal={selectedGoal}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}