"use client";

import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Card, CardContent } from '@/components/ui/card';
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
    color: "#e11d48"
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
    color: "#22c55e"
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
    color: "#2563eb"
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
    color: "#7c3aed"
  }
];

// Strategic Crystal component with larger size and improved materials
function StrategicCrystal({ onFaceClick, hoveredFace, setHoveredFace }: {
  onFaceClick: (goalId: number) => void;
  hoveredFace: number | null;
  setHoveredFace: (id: number | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera, raycaster, pointer } = useThree();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const autoRotateRef = useRef(true);
  
  useEffect(() => {
    setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
  }, []);

  // Auto-rotation with smooth lerp
  useFrame((state, delta) => {
    if (groupRef.current && autoRotateRef.current) {
      groupRef.current.rotation.y += 0.002; // Slower, more elegant rotation
    }
  });

  // Create larger dodecahedron geometry - 25% bigger (1.1 * 1.25 = 1.375)
  const geometry = new THREE.DodecahedronGeometry(1.375, 0);
  
  // Handle mouse interactions
  useFrame(() => {
    if (!meshRef.current) return;
    
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(meshRef.current);
    
    if (intersects.length > 0) {
      const faceIndex = Math.floor(intersects[0].faceIndex! / 3); // Each face has multiple triangles
      const goalId = faceIndex % 4; // Map to our 4 goals
      setHoveredFace(goalId);
      setIsHovered(true);
    } else {
      setHoveredFace(null);
      setIsHovered(false);
    }
  });

  const handleClick = () => {
    if (hoveredFace !== null) {
      onFaceClick(hoveredFace);
    }
  };

  const handlePointerDown = () => {
    autoRotateRef.current = false;
  };

  const handlePointerUp = () => {
    // Resume auto-rotation after interaction
    setTimeout(() => {
      autoRotateRef.current = true;
    }, 2000);
  };

  return (
    <group ref={groupRef}>
      {/* Environment lighting */}
      <Environment preset="city" />
      <spotLight intensity={1.2} position={[5, 8, 5]} angle={0.3} penumbra={1} />
      <directionalLight intensity={0.6} position={[-5, -4, -5]} />
      
      {/* Main crystal - larger size */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
        scale={isHovered ? 1.08 : 1}
      >
        <meshPhysicalMaterial
          color="#4f80ff"
          roughness={0.05}
          transmission={0.9}
          ior={1.3}
          thickness={1.5}
          emissive="#2040ff"
          emissiveIntensity={isHovered ? 0.6 : 0.0}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Goal labels with Html components - adjusted for larger crystal */}
      {goals.map((goal, index) => {
        const angle = (index / goals.length) * Math.PI * 2;
        const radius = 3.2; // Increased from 2.5 to accommodate larger crystal
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const isActive = hoveredFace === goal.id;
        
        return (
          <Html
            key={goal.id}
            position={[x, 0, z]}
            center
            distanceFactor={6}
            style={{
              opacity: isActive ? 1 : 0,
              transform: `scale(${isActive ? 1 : 0.9})`,
              transition: 'all 0.3s ease-in-out',
              pointerEvents: 'none'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: isActive ? 1 : 0, 
                scale: isActive ? 1 : 0.9 
              }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass border-none shadow-lg min-w-[200px]">
                <CardContent className="p-4 text-center">
                  <div 
                    className="text-2xl font-bold mb-1"
                    style={{ color: goal.color }}
                  >
                    {goal.metric}
                  </div>
                  <div className="text-sm font-medium text-[#001D8D]">
                    {goal.title}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Html>
        );
      })}
      
      {/* Ambient halo effect - adjusted for larger crystal */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[4.2, 32, 32]} />
        <meshBasicMaterial
          color="#4f80ff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Fallback SVG crystal for low-end devices - larger size
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
        style={{ filter: 'drop-shadow(0 10px 20px rgba(79, 128, 255, 0.3))' }}
      >
        {/* Crystal faces - larger radius */}
        {goals.map((goal, index) => {
          const angle = (index / goals.length) * Math.PI * 2;
          const centerX = 200;
          const centerY = 200;
          const radius = 100; // Increased from 80 to make crystal 25% larger
          
          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          const x2 = centerX + Math.cos(angle + Math.PI / 2) * radius;
          const y2 = centerY + Math.sin(angle + Math.PI / 2) * radius;
          
          return (
            <g key={goal.id}>
              <polygon
                points={`${centerX},${centerY} ${x1},${y1} ${x2},${y2}`}
                fill={hoveredFace === goal.id ? goal.color : "rgba(79, 128, 255, 0.3)"}
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
                className="text-sm font-semibold fill-current pointer-events-none"
                style={{ color: goal.color }}
              >
                {goal.metric}
              </text>
            </g>
          );
        })}
        
        {/* Center circle - slightly larger */}
        <circle
          cx="200"
          cy="200"
          r="35"
          fill="rgba(79, 128, 255, 0.2)"
          stroke="#4f80ff"
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
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
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
                      <h3 className="text-xl font-bold text-[#001D8D]">
                        {goal.title}
                      </h3>
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
                
                <p className="text-[#001D8D]/70 leading-relaxed mb-6">
                  {goal.description}
                </p>
                
                {/* Progress bar */}
                <div className="mb-6">
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

// Main component with reduced container height
export function CrystalVisualization() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredFace, setHoveredFace] = useState<number | null>(null);
  const [use3D, setUse3D] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // GPU capability detection
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
      <div className="w-full min-h-[350px] flex items-center justify-center">
        <div className="animate-pulse text-[#001D8D]">
          Загрузка 3D визуализации...
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="text-center mb-6">
        <Badge className="bg-gradient-to-r from-[#001D8D] to-blue-600 text-white px-6 py-2 text-lg mb-4">
          <Rocket className="h-5 w-5 mr-2" />
          Интерактивные стратегические цели
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-3">
          Наши цели до 2026 года
        </h2>
        <p className="text-sm text-[#001d8d]/60 mb-2">
          Наведите курсор на грань кристалла, чтобы узнать подробнее
        </p>
      </div>

      {/* Crystal visualization container - reduced height by 30% */}
      <div className="relative w-full min-h-[350px] md:h-[455px] lg:h-[525px] mb-6">
        {use3D ? (
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001D8D]"></div>
            </div>
          }>
            <Canvas
              className="w-full h-full"
              camera={{ position: [0, 0, 6.5], fov: 50 }} // Moved camera closer for larger crystal
              style={{ background: 'transparent' }}
            >
              <StrategicCrystal
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
                enableDamping
                dampingFactor={0.05}
              />
            </Canvas>
          </Suspense>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6">
            <FallbackCrystal
              onFaceClick={handleFaceClick}
              className="w-full max-w-md h-full"
            />
          </div>
        )}
      </div>

      {/* Goal cards preview - reduced top padding */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {goals.map((goal) => {
          const IconComponent = goal.icon;
          return (
            <motion.div
              key={goal.id}
              className={`p-6 rounded-xl border border-[#001d8d]/10 cursor-pointer transition-all duration-300 ${
                hoveredFace === goal.id 
                  ? 'border-current shadow-lg scale-105' 
                  : 'hover:border-gray-300'
              }`}
              style={{ 
                borderColor: hoveredFace === goal.id ? goal.color : undefined,
                backgroundColor: hoveredFace === goal.id ? `${goal.color}10` : 'white'
              }}
              onClick={() => handleFaceClick(goal.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${goal.color}20` }}
                >
                  <IconComponent 
                    className="h-5 w-5" 
                    style={{ color: goal.color }}
                  />
                </div>
                <span className="font-semibold text-[#001D8D]">
                  {goal.title}
                </span>
              </div>
              
              <div className="text-sm text-[#001D8D]/70 mb-4">
                {goal.description.substring(0, 80)}...
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold" style={{ color: goal.color }}>
                    {goal.metric}
                  </span>
                  <span className="text-xs text-[#001D8D]/50">завершено</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
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