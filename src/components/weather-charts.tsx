"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { WeatherIcon } from "./weather-icon";
import { Clock, Calendar, Eye } from "lucide-react";

interface HourlyPoint {
  time: string;
  temp: number;
  pop: number; // probabilidade de precipitação (%)
  icon: string;
}

interface DailyPoint {
  day: string;
  date: string;
  tempMin: number;
  tempMax: number;
  icon: string;
}

interface WeatherChartsProps {
  hourly: HourlyPoint[];
  daily: DailyPoint[];
}

export function WeatherCharts({ hourly, daily }: WeatherChartsProps) {
  const [activeTab, setActiveTab] = useState<"hourly" | "daily">("hourly");
  const [tempMode, setTempMode] = useState<"feels" | "real">("real");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Customização de Tooltip para o gráfico Horário
  const CustomHourlyTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as HourlyPoint;
      return (
        <div className="rounded-xl border border-white/10 bg-slate-950/90 p-3 shadow-xl backdrop-blur-md text-white text-xs space-y-1.5">
          <p className="font-semibold text-white/50">{data.time}</p>
          <div className="flex items-center gap-1.5">
            <WeatherIcon name={data.icon} size={16} />
            <span className="font-bold text-lg">{data.temp}°C</span>
          </div>
          <p className="text-sky-300 font-medium">Chuva: {data.pop}%</p>
        </div>
      );
    }
    return null;
  };

  // Customização de Tooltip para o gráfico Diário
  const CustomDailyTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DailyPoint;
      return (
        <div className="rounded-xl border border-white/10 bg-slate-950/90 p-3 shadow-xl backdrop-blur-md text-white text-xs space-y-1">
          <p className="font-semibold text-white/50">{data.day} ({data.date})</p>
          <div className="flex items-center gap-2">
            <WeatherIcon name={data.icon} size={16} />
            <div>
              <span className="text-orange-400 font-bold">Máx: {data.tempMax}°C</span>
              <span className="text-sky-300 font-bold ml-2">Mín: {data.tempMin}°C</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/20 backdrop-blur-md p-6 text-white space-y-6">
      
      {/* Cabeçalho do Gráfico e Controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          {activeTab === "hourly" ? (
            <Clock className="text-blue-400" size={20} />
          ) : (
            <Calendar className="text-blue-400" size={20} />
          )}
          <h3 className="text-lg font-bold">Gráficos de Previsão</h3>
        </div>

        {/* Seletores de Tabs */}
        <div className="flex items-center gap-4">
          <div className="flex rounded-full bg-white/5 p-1 border border-white/10">
            <button
              onClick={() => setActiveTab("hourly")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === "hourly"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Previsão Horária
            </button>
            <button
              onClick={() => setActiveTab("daily")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === "daily"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Previsão Diária
            </button>
          </div>

          {/* Interatividade simulada (Botão Alternador) */}
          <button
            onClick={() => setTempMode(tempMode === "real" ? "feels" : "real")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Eye size={12} />
            <span>Visualização: <strong>{tempMode === "real" ? "Temp. Real" : "Sensação"}</strong></span>
          </button>
        </div>
      </div>

      {/* Gráfico 1: Previsão Horária */}
      {activeTab === "hourly" && (
        <div className="space-y-6">
          <p className="text-sm text-white/60">
            Curva de temperatura e probabilidade de chuva nas próximas 24 horas.
          </p>
          
          {/* Fileira de Ícones Climáticos Acima do Gráfico (Alinhados) */}
          <div className="grid grid-cols-8 text-center text-xs text-white/50 pt-2 px-8">
            {hourly.map((point, index) => (
              <div key={index} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-semibold">{point.time}</span>
                <WeatherIcon name={point.icon} size={20} />
              </div>
            ))}
          </div>

          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourly} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                  <YAxis 
                    stroke="rgba(255,255,255,0.4)" 
                    fontSize={10} 
                    tickLine={false} 
                    domain={[(dataMin: number) => Math.floor(dataMin - 2), (dataMax: number) => Math.ceil(dataMax + 2)]}
                    tickFormatter={(val) => `${val}°`}
                  />
                  <Tooltip content={<CustomHourlyTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#tempGradient)"
                    dot={{ r: 4, stroke: "#1e3b8a", strokeWidth: 2, fill: "#3b82f6" }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full rounded-xl bg-white/5 border border-white/5 animate-pulse flex items-center justify-center text-xs text-white/40">
                Carregando gráfico de horas...
              </div>
            )}
          </div>

          {/* Fileira de Precipitação Abaixo do Gráfico */}
          <div className="rounded-2xl bg-white/5 border border-white/5 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-2">
              Probabilidade de Precipitação (Chuva)
            </h4>
            <div className="grid grid-cols-8 text-center text-xs">
              {hourly.map((point, index) => (
                <div key={index} className="space-y-1">
                  <div className="h-10 flex items-end justify-center">
                    <div 
                      className="w-4 rounded-t-sm bg-sky-500/35 border-t border-sky-400/50 transition-all duration-500"
                      style={{ height: `${Math.max(point.pop, 5)}%` }}
                    />
                  </div>
                  <span className="font-bold text-sky-300 text-[10px]">{point.pop}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gráfico 2: Previsão Diária */}
      {activeTab === "daily" && (
        <div className="space-y-6">
          <p className="text-sm text-white/60">
            Comparativo de temperaturas máximas e mínimas previstas para os próximos 7 dias.
          </p>

          {/* Fileira de Ícones Climáticos Diários */}
          <div className="grid grid-cols-7 text-center text-xs text-white/50 pt-2 px-8">
            {daily.map((point, index) => (
              <div key={index} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold text-white/80">{point.day}</span>
                <span className="text-[9px] text-white/40">{point.date}</span>
                <WeatherIcon name={point.icon} size={20} />
              </div>
            ))}
          </div>

          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={daily} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
                  <YAxis 
                    stroke="rgba(255,255,255,0.4)" 
                    fontSize={10} 
                    tickLine={false} 
                    domain={[(dataMin: number) => Math.floor(dataMin - 3), (dataMax: number) => Math.ceil(dataMax + 3)]}
                    tickFormatter={(val) => `${val}°`}
                  />
                  <Tooltip content={<CustomDailyTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                  <Line
                    type="monotone"
                    dataKey="tempMax"
                    name="Temperatura Máxima"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ r: 4, stroke: "#1e3a8a", strokeWidth: 2, fill: "#f97316" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tempMin"
                    name="Temperatura Mínima"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    dot={{ r: 4, stroke: "#1e3a8a", strokeWidth: 2, fill: "#38bdf8" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full rounded-xl bg-white/5 border border-white/5 animate-pulse flex items-center justify-center text-xs text-white/40">
                Carregando gráfico semanal...
              </div>
            )}
          </div>

          <div className="flex justify-center gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-orange-500" />
              <span>Temp. Máxima (Média: {Math.round(daily.reduce((acc, curr) => acc + curr.tempMax, 0) / daily.length)}°C)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-sky-400" />
              <span>Temp. Mínima (Média: {Math.round(daily.reduce((acc, curr) => acc + curr.tempMin, 0) / daily.length)}°C)</span>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
