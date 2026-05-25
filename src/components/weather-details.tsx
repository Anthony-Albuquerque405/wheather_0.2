import React from "react";
import { Sunrise, Sunset, Moon, Wind, Droplets, Compass, Eye, SunDim } from "lucide-react";

interface WeatherDetailsProps {
  current: {
    humidity: number;
    windSpeed: number;
    pressure: number;
    uvIndex: number;
    visibility: number;
    sunrise: string;
    sunset: string;
    moonPhase: string;
    feelsLike: number;
    temp: number;
  };
}

export function WeatherDetails({ current }: WeatherDetailsProps) {
  // Traduzir/Formatar visibilidade (metros para km)
  const visibilityKm = Math.round(current.visibility / 1000);

  // Obter descrição do Índice UV
  const getUvLevel = (uv: number) => {
    if (uv <= 2) return "Baixo";
    if (uv <= 5) return "Moderado";
    if (uv <= 7) return "Alto";
    if (uv <= 10) return "Muito Alto";
    return "Extremo";
  };

  const uvLevel = getUvLevel(current.uvIndex);

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Card 1: Sol (Nascer & Pôr) */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md flex flex-col justify-between min-h-[140px] text-white">
        <div className="flex items-center justify-between text-white/50 text-xs font-semibold uppercase tracking-wider">
          <span>Sol</span>
          <Sunrise size={18} className="text-amber-400" />
        </div>
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-white/60">
              <Sunrise size={14} /> Nascer:
            </span>
            <span className="font-bold">{current.sunrise}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-white/60">
              <Sunset size={14} /> Pôr do sol:
            </span>
            <span className="font-bold">{current.sunset}</span>
          </div>
        </div>
        <div className="text-[10px] text-white/40 mt-2">Duração do dia: ~12h 11m</div>
      </div>

      {/* Card 2: Lua (Fase) */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md flex flex-col justify-between min-h-[140px] text-white">
        <div className="flex items-center justify-between text-white/50 text-xs font-semibold uppercase tracking-wider">
          <span>Fase da Lua</span>
          <Moon size={18} className="text-indigo-300" />
        </div>
        <div className="mt-4">
          <span className="text-2xl font-bold tracking-tight block text-indigo-100">
            {current.moonPhase}
          </span>
          <span className="text-[10px] text-white/50 block mt-1">
            Próxima Lua Cheia em ~12 dias
          </span>
        </div>
        <div className="text-[10px] text-white/40 mt-2">Visibilidade lunar: 48%</div>
      </div>

      {/* Card 3: Umidade */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md flex flex-col justify-between min-h-[140px] text-white">
        <div className="flex items-center justify-between text-white/50 text-xs font-semibold uppercase tracking-wider">
          <span>Umidade</span>
          <Droplets size={18} className="text-sky-400" />
        </div>
        <div className="mt-4">
          <span className="text-3xl font-bold tracking-tight block">{current.humidity}%</span>
          <span className="text-[10px] text-white/50 block mt-1">
            Ponto de orvalho: ~{Math.round(current.humidity * 0.15)}°C
          </span>
        </div>
        <div className="text-[10px] text-white/40 mt-2">Ar úmido e refrescante</div>
      </div>

      {/* Card 4: Vento */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md flex flex-col justify-between min-h-[140px] text-white">
        <div className="flex items-center justify-between text-white/50 text-xs font-semibold uppercase tracking-wider">
          <span>Velocidade do Vento</span>
          <Wind size={18} className="text-teal-300" />
        </div>
        <div className="mt-4">
          <span className="text-3xl font-bold tracking-tight block">{current.windSpeed} km/h</span>
          <span className="text-[10px] text-white/50 block mt-1 flex items-center gap-1">
            <Compass size={12} className="text-teal-400" /> Direção: NE (Nordeste)
          </span>
        </div>
        <div className="text-[10px] text-white/40 mt-2">Brisa suave constante</div>
      </div>

      {/* Card 5: Pressão */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md flex flex-col justify-between min-h-[140px] text-white">
        <div className="flex items-center justify-between text-white/50 text-xs font-semibold uppercase tracking-wider">
          <span>Pressão Atmosférica</span>
          <Compass size={18} className="text-emerald-400" />
        </div>
        <div className="mt-4">
          <span className="text-3xl font-bold tracking-tight block">{current.pressure} hPa</span>
          <span className="text-[10px] text-white/50 block mt-1">
            Equivalente a: 1.01 atm
          </span>
        </div>
        <div className="text-[10px] text-white/40 mt-2">Condição estável padrão</div>
      </div>

      {/* Card 6: Visibilidade */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md flex flex-col justify-between min-h-[140px] text-white">
        <div className="flex items-center justify-between text-white/50 text-xs font-semibold uppercase tracking-wider">
          <span>Visibilidade</span>
          <Eye size={18} className="text-blue-400" />
        </div>
        <div className="mt-4">
          <span className="text-3xl font-bold tracking-tight block">{visibilityKm} km</span>
          <span className="text-[10px] text-white/50 block mt-1">
            Excelente visibilidade
          </span>
        </div>
        <div className="text-[10px] text-white/40 mt-2">Livre de névoas ou fumaça</div>
      </div>

      {/* Card 7: Índice UV */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md flex flex-col justify-between min-h-[140px] text-white">
        <div className="flex items-center justify-between text-white/50 text-xs font-semibold uppercase tracking-wider">
          <span>Índice UV</span>
          <SunDim size={18} className="text-amber-500" />
        </div>
        <div className="mt-4">
          <span className="text-3xl font-bold tracking-tight block">
            {current.uvIndex} <span className="text-sm font-semibold text-white/60">({uvLevel})</span>
          </span>
          <span className="text-[10px] text-white/50 block mt-1">
            Uso recomendado de protetor
          </span>
        </div>
        <div className="text-[10px] text-white/40 mt-2">Exposição segura até 45 min</div>
      </div>

      {/* Card 8: Sensação térmica estendida */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md flex flex-col justify-between min-h-[140px] text-white">
        <div className="flex items-center justify-between text-white/50 text-xs font-semibold uppercase tracking-wider">
          <span>Sensação vs Real</span>
          <SunDim size={18} className="text-pink-400" />
        </div>
        <div className="mt-4">
          <span className="text-2xl font-bold tracking-tight block">
            {Math.abs(Math.round(current.feelsLike - current.temp)) <= 1 
              ? "Sem divergência" 
              : `${Math.round(current.feelsLike - current.temp)}°C de dif.`}
          </span>
          <span className="text-[10px] text-white/50 block mt-1">
            Temp. Real: {Math.round(current.temp)}°C
          </span>
        </div>
        <div className="text-[10px] text-white/40 mt-2">Influenciada por vento e umidade</div>
      </div>
    </section>
  );
}
