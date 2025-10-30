"use client";
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const regions = [
  {
    id: "europe",
    name: "Европа",
    countries: ["FRA", "DEU", "ITA", "ESP", "POL", "NLD", "SWE", "GBR", "BEL", "AUT", "CHE", "PRT", "CZE", "ROU", "HUN"],
    description: "Быстрые переводы в страны Европейского союза",
    transferTime: "2-4 часа"
  },
  {
    id: "cis",
    name: "СНГ и Ближний Восток",
    countries: ["RUS", "KAZ", "UZB", "AZE", "TUR", "ARE", "UKR", "BLR", "ARM", "GEO", "KGZ", "TJK", "TKM"],
    description: "Надёжные переводы по странам СНГ и Ближнего Востока",
    transferTime: "1-3 часа"
  },
  {
    id: "america",
    name: "Америка",
    countries: ["USA", "CAN", "BRA", "ARG", "MEX", "CHL", "COL", "PER"],
    description: "Международные переводы в Северную и Южную Америку",
    transferTime: "3-6 часов"
  },
  {
    id: "asia",
    name: "Азия и Африка",
    countries: ["CHN", "JPN", "IND", "IDN", "THA", "VNM", "SGP", "MYS", "EGY", "ZAF", "KEN", "NGA"],
    description: "Переводы в страны Азии и Африки",
    transferTime: "3-6 часов"
  },
  {
    id: "australia",
    name: "Австралия и Океания",
    countries: ["AUS", "NZL"],
    description: "Переводы в Австралию и Новую Зеландию",
    transferTime: "4-8 часов"
  },
];

const GeoSection = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("europe");

  const currentRegion = regions.find((r) => r.id === selectedRegion);

  return (
    <section className="relative py-24 bg-transparent overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(0,29,141,0.08)_0%,transparent_70%)] blur-3xl opacity-60 pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#001D8D]">
            География работы
          </h2>
          <p className="text-[#001D8D]/70 leading-relaxed text-lg">
            Осуществляем переводы по всему миру с гарантией безопасности и скорости
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">

          {/* Левая часть — список регионов */}
          <div className="space-y-4">
            {regions.map((region, index) => (
              <motion.button
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative w-full text-left p-6 rounded-3xl font-semibold transition-all duration-500 overflow-hidden group
                ${
                  selectedRegion === region.id
                    ? "bg-gradient-to-br from-white/60 to-white/30 shadow-[0_8px_40px_rgba(0,29,141,0.2)] text-[#001D8D]"
                    : "bg-gradient-to-br from-white/40 to-white/10 hover:from-white/50 hover:to-white/20 text-[#001D8D]/80"
                } backdrop-blur-xl`}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`absolute inset-0 transition duration-700 rounded-3xl
                  ${selectedRegion === region.id
                    ? "opacity-100 bg-[radial-gradient(circle_at_center,rgba(0,29,141,0.12)_0%,transparent_70%)]"
                    : "opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(0,29,141,0.06)_0%,transparent_70%)]"
                  }`}
                ></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{region.name}</span>
                    {selectedRegion === region.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-[#001D8D] rounded-full"
                      ></motion.div>
                    )}
                  </div>

                  <AnimatePresence>
                    {selectedRegion === region.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-2"
                      >
                        <p className="text-sm text-[#001D8D]/70 leading-relaxed">
                          {region.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-[#001D8D]/60">
                          <Clock className="w-4 h-4" />
                          <span>Время перевода: {region.transferTime}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Правая часть — интерактивная карта */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative w-full h-[600px] bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,29,141,0.05)] p-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,29,141,0.05)_0%,transparent_80%)] pointer-events-none"></div>

            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <ComposableMap
                projectionConfig={{
                  scale: 160,
                  center: [20, 20]
                }}
                width={800}
                height={500}
                className="w-full h-full"
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const isHighlighted = currentRegion?.countries.includes(geo.properties.ISO_A3);

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={
                            isHighlighted
                              ? "rgba(0,29,141,0.7)"
                              : "rgba(0,29,141,0.12)"
                          }
                          stroke="#001D8D"
                          strokeWidth={isHighlighted ? 0.6 : 0.3}
                          style={{
                            default: {
                              outline: "none",
                              transition: "all 0.5s ease"
                            },
                            hover: {
                              fill: isHighlighted ? "rgba(0,29,141,0.85)" : "rgba(0,29,141,0.25)",
                              cursor: isHighlighted ? "pointer" : "default",
                            },
                            pressed: { outline: "none" },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>

            {/* Информационная карточка внизу карты */}
            <AnimatePresence mode="wait">
              {currentRegion && (
                <motion.div
                  key={currentRegion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-[#001D8D]/10 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-[#001D8D]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#001D8D] mb-1">
                        {currentRegion.name}
                      </h4>
                      <p className="text-sm text-[#001D8D]/70">
                        {currentRegion.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GeoSection;
