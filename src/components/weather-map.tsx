"use client";

import React, { useState } from "react";
import { Map, Maximize2, Minimize2, Thermometer, Wind, CloudRain, RotateCw } from "lucide-react";
import { WeatherIcon } from "./weather-icon";

interface NeighborCity {
  name: string;
  lat: number;
  lon: number;
  temp: number;
  icon: string;
}

interface WeatherMapProps {
  cityName: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  neighboringCities: NeighborCity[];
  onCityClick: (cityName: string) => void;
}

type MapFilter = "temp" | "wind" | "rain";

export function WeatherMap({ cityName, coordinates, neighboringCities, onCityClick }: WeatherMapProps) {
  const [filter, setFilter] = useState<MapFilter>("temp");
  const [zoomLevel, setZoomLevel] = useState(2); // 1 = min, 3 = max

  // Obter valores simulados adicionais de vento e precipitação para as cidades vizinhas
  const getNeighborValue = (city: NeighborCity, type: MapFilter) => {
    // Usar um hash do nome para valores consistentes
    let hash = 0;
    for (let i = 0; i < city.name.length; i++) {
      hash += city.name.charCodeAt(i);
    }

    if (type === "temp") {
      return `${city.temp}°C`;
    } else if (type === "wind") {
      const windSpeed = 10 + (hash % 25);
      return `${windSpeed} km/h`;
    } else {
      const rainChance = 10 + (hash % 70);
      return `${rainChance}%`;
    }
  };

  // Cores do Heatmap com base na temperatura ou intensidade do filtro
  const getMarkerColor = (city: NeighborCity) => {
    if (filter === "temp") {
      if (city.temp > 30) return "bg-orange-500 border-orange-300 shadow-orange-500/50";
      if (city.temp > 22) return "bg-amber-400 border-amber-200 shadow-amber-400/50";
      if (city.temp > 10) return "bg-blue-400 border-blue-200 shadow-blue-400/50";
      return "bg-sky-500 border-sky-300 shadow-sky-500/50";
    } else if (filter === "wind") {
      return "bg-teal-400 border-teal-200 shadow-teal-400/50";
    } else {
      return "bg-sky-400 border-sky-200 shadow-sky-400/50";
    }
  };

  return (
    <section id="mapa-interativo" className="rounded-3xl border border-white/10 bg-slate-950/20 backdrop-blur-md p-6 text-white space-y-6">
      
      {/* Cabeçalho do Mapa */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Map className="text-blue-400 animate-pulse" size={20} />
          <div>
            <h3 className="text-lg font-bold">Radar Interativo da Região</h3>
            <p className="text-xs text-white/50">Coordenadas: Lat {coordinates.lat.toFixed(2)} / Lon {coordinates.lon.toFixed(2)}</p>
          </div>
        </div>

        {/* Controles de Filtros e Zoom */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filtros */}
          <div className="flex rounded-full bg-white/5 p-1 border border-white/10">
            <button
              onClick={() => setFilter("temp")}
              className={`p-1.5 rounded-full transition-all ${
                filter === "temp" ? "bg-orange-500 text-white" : "text-white/60 hover:text-white"
              }`}
              title="Temperatura"
            >
              <Thermometer size={16} />
            </button>
            <button
              onClick={() => setFilter("wind")}
              className={`p-1.5 rounded-full transition-all ${
                filter === "wind" ? "bg-teal-500 text-white" : "text-white/60 hover:text-white"
              }`}
              title="Vento"
            >
              <Wind size={16} />
            </button>
            <button
              onClick={() => setFilter("rain")}
              className={`p-1.5 rounded-full transition-all ${
                filter === "rain" ? "bg-sky-500 text-white" : "text-white/60 hover:text-white"
              }`}
              title="Precipitação"
            >
              <CloudRain size={16} />
            </button>
          </div>

          {/* Zoom */}
          <div className="flex rounded-full bg-white/5 p-1 border border-white/10">
            <button
              onClick={() => setZoomLevel(Math.max(1, zoomLevel - 1))}
              disabled={zoomLevel === 1}
              className="p-1.5 rounded-full hover:bg-white/5 text-white/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            >
              <Minimize2 size={14} />
            </button>
            <span className="px-2 py-0.5 text-xs font-bold leading-5">{zoomLevel}x</span>
            <button
              onClick={() => setZoomLevel(Math.min(3, zoomLevel + 1))}
              disabled={zoomLevel === 3}
              className="p-1.5 rounded-full hover:bg-white/5 text-white/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Tela do Radar Climático */}
      <div className="relative w-full h-[320px] rounded-2xl bg-slate-950 border border-white/5 overflow-hidden flex items-center justify-center select-none shadow-inner">
        
        {/* Padrão de Grade Geográfica de Fundo */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Linhas Construtivas de Radar (Círculos) */}
        <div className="absolute border border-blue-500/10 rounded-full w-[100px] h-[100px] animate-ping opacity-25" />
        <div className={`absolute border border-blue-500/10 rounded-full transition-all duration-500 ${zoomLevel === 1 ? "w-[60px] h-[60px]" : zoomLevel === 2 ? "w-[120px] h-[120px]" : "w-[240px] h-[240px]"}`} />
        <div className={`absolute border border-blue-500/10 rounded-full transition-all duration-500 ${zoomLevel === 1 ? "w-[120px] h-[120px]" : zoomLevel === 2 ? "w-[240px] h-[240px]" : "w-[480px] h-[480px]"}`} />
        <div className={`absolute border border-blue-500/5 rounded-full transition-all duration-500 ${zoomLevel === 1 ? "w-[180px] h-[180px]" : zoomLevel === 2 ? "w-[360px] h-[360px]" : "w-[720px] h-[720px]"}`} />

        {/* Linhas de Cruzamento */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-blue-500/5" />
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-blue-500/5" />

        {/* Varredura Rotativa de Radar (Realista!) */}
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_50%,rgba(59,130,246,0.08)_100%)] animate-spin-slow pointer-events-none" />

        {/* Marcador Central: Cidade Buscada */}
        <div className="absolute z-20 flex flex-col items-center">
          <div className="h-6 w-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-lg shadow-blue-500/50 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-white" />
          </div>
          <div className="mt-2 bg-slate-900/90 border border-white/10 px-2 py-1 rounded-md text-[10px] font-bold text-white shadow-md whitespace-nowrap backdrop-blur-sm">
            📍 {cityName} (Você)
          </div>
        </div>

        {/* Marcadores das Cidades Vizinhas */}
        {neighboringCities.map((city, idx) => {
          // Determinar posições dos 4 quadrantes
          // Variando o raio com base no zoom
          const radius = zoomLevel === 1 ? 55 : zoomLevel === 2 ? 100 : 160;
          
          let style = {};
          if (idx === 0) style = { transform: `translateY(-${radius}px)` }; // Norte
          if (idx === 1) style = { transform: `translateY(${radius}px)` };  // Sul
          if (idx === 2) style = { transform: `translateX(${radius}px)` };  // Leste
          if (idx === 3) style = { transform: `translateX(-${radius}px)` }; // Oeste

          const colorClass = getMarkerColor(city);
          const filterValue = getNeighborValue(city, filter);

          return (
            <div
              key={city.name}
              style={style}
              onClick={() => onCityClick(city.name)}
              className="absolute z-10 flex flex-col items-center cursor-pointer group transition-transform duration-500 hover:scale-110"
              title={`Ver previsão de ${city.name}`}
            >
              {/* Ponto / Ícone */}
              <div className={`h-5 w-5 rounded-full border-2 ${colorClass} shadow-md flex items-center justify-center transition-all`}>
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>

              {/* Box de Informações */}
              <div className="mt-1 bg-slate-900/85 border border-white/10 px-2.5 py-1.5 rounded-xl shadow-lg backdrop-blur-md flex flex-col items-center gap-0.5 text-center transition-all group-hover:border-blue-400 group-hover:bg-blue-950/90">
                <span className="text-[9px] font-semibold text-white/90 group-hover:text-blue-200 truncate max-w-[80px]">
                  {city.name}
                </span>
                <div className="flex items-center gap-1">
                  <WeatherIcon name={city.icon} size={12} />
                  <span className="text-[10px] font-bold text-white">
                    {filterValue}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Rodapé informativo dentro da tela do radar */}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 border border-white/15 px-2.5 py-1 rounded-md text-[9px] font-semibold text-white/60 flex items-center gap-1.5">
          <RotateCw size={10} className="animate-spin text-blue-400" />
          <span>Buscando sinais locais...</span>
        </div>
      </div>

      <div className="text-xs text-white/40 text-center leading-relaxed">
        💡 <strong>Dica:</strong> O radar mapeia o entorno climático. Clique em qualquer cidade vizinha para navegar e ver a previsão meteorológica completa daquela área.
      </div>
    </section>
  );
}
