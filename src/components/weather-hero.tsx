import React from "react";
import { WeatherIcon } from "./weather-icon";
import { AlertCircle, Thermometer, Wind, Droplets } from "lucide-react";

interface WeatherHeroProps {
  current: {
    name: string;
    temp: number;
    tempMin: number;
    tempMax: number;
    feelsLike: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    alert?: string;
  };
}

export function WeatherHero({ current }: WeatherHeroProps) {
  // Escolher gradiente de fundo com base na condição climática
  const getBackgroundGradient = (icon: string) => {
    switch (icon.toLowerCase()) {
      case "sunny":
      case "clear":
        return "from-sky-500 via-blue-600 to-amber-600/30";
      case "rainy":
      case "rain":
      case "drizzle":
        return "from-slate-700 via-slate-800 to-blue-900";
      case "stormy":
      case "thunderstorm":
        return "from-slate-900 via-purple-950 to-indigo-950";
      case "windy":
      case "wind":
        return "from-sky-800 via-slate-800 to-teal-900";
      case "cloudy":
      case "clouds":
      default:
        return "from-blue-900 via-slate-800 to-slate-900";
    }
  };

  const gradient = getBackgroundGradient(current.icon);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl transition-all duration-500">
      {/* Camada de Gradiente de Fundo Dinâmico */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
      
      {/* Elementos de Brilho / Glassmorphism */}
      <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-[2px]" />
      
      {/* Conteúdo Principal */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        
        {/* Lado Esquerdo: Cidade, Temperatura e Condição */}
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold tracking-wider uppercase text-sky-200/80">Clima Atual</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {current.name}
            </h2>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-6xl sm:text-7xl font-black text-white tracking-tighter">
              {Math.round(current.temp)}°C
            </span>
            <span className="text-lg font-medium text-white/60">
              Sensação {Math.round(current.feelsLike)}°C
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm font-semibold text-white/90 shadow-sm backdrop-blur-md">
              {current.description}
            </span>
            <div className="text-xs text-white/60 font-medium">
              Mín: <span className="text-white font-bold">{Math.round(current.tempMin)}°</span> • Máx: <span className="text-white font-bold">{Math.round(current.tempMax)}°</span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Grande Ícone do Clima e Informações Rápidas */}
        <div className="flex flex-col items-center sm:items-start md:items-end justify-center gap-4 border-t border-white/10 pt-6 md:border-t-0 md:pt-0">
          <div className="flex items-center justify-center h-28 w-28 rounded-3xl bg-white/5 border border-white/10 shadow-inner backdrop-blur-md">
            <WeatherIcon name={current.icon} size={64} className="drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]" />
          </div>
          
          {/* Micro cards rápidos */}
          <div className="flex gap-4 text-xs text-white/70">
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
              <Thermometer size={14} className="text-orange-400" />
              <span>Sensação: <strong>{current.feelsLike}°</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
              <Wind size={14} className="text-teal-300" />
              <span>Vento: <strong>{current.windSpeed} km/h</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
              <Droplets size={14} className="text-sky-300" />
              <span>Umidade: <strong>{current.humidity}%</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta Climatológico Inferior (se existir) */}
      {current.alert && (
        <div className="relative z-10 flex items-center gap-2 bg-amber-500/20 border-t border-amber-500/30 px-6 py-3 text-xs sm:text-sm text-amber-200">
          <AlertCircle size={16} className="text-amber-400 flex-shrink-0 animate-pulse" />
          <span className="font-semibold text-amber-300">Aviso:</span>
          <span>{current.alert}</span>
        </div>
      )}
    </section>
  );
}
