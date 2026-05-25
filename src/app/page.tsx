"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/header";
import { WeatherHero } from "@/components/weather-hero";
import { WeatherDetails } from "@/components/weather-details";
import { WeatherCharts } from "@/components/weather-charts";
import { WeatherMap } from "@/components/weather-map";
import { Footer } from "@/components/footer";
import { AlertTriangle, CloudSun, RefreshCw, KeyRound, Check } from "lucide-react";

interface WeatherData {
  isMock: boolean;
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
    pressure: number;
    uvIndex: number;
    visibility: number;
    sunrise: string;
    sunset: string;
    moonPhase: string;
    alert?: string;
  };
  hourly: Array<{
    time: string;
    temp: number;
    pop: number;
    icon: string;
  }>;
  daily: Array<{
    day: string;
    date: string;
    tempMin: number;
    tempMax: number;
    icon: string;
  }>;
  coordinates: {
    lat: number;
    lon: number;
  };
  neighboringCities: Array<{
    name: string;
    lat: number;
    lon: number;
    temp: number;
    icon: string;
  }>;
}

export default function Home() {
  const [cityName, setCityName] = useState("Belo Jardim");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  // Carregar favoritos do localStorage no client-side
  useEffect(() => {
    const saved = localStorage.getItem("favorite_cities");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Buscar dados de clima
  const fetchWeather = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?q=${encodeURIComponent(city)}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Falha ao buscar dados climáticos.");
      }
      const data: WeatherData = await res.json();
      setWeatherData(data);
      // Atualizar o nome da cidade atual para o retornado oficial
      setCityName(data.current.name);
    } catch (err: any) {
      setError(err.message || "Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar cidade inicial
  useEffect(() => {
    fetchWeather(cityName);
  }, []);

  // Adicionar/Remover favoritos
  const handleToggleFavorite = (city: string) => {
    let updated;
    if (favorites.some((fav) => fav.toLowerCase() === city.toLowerCase())) {
      updated = favorites.filter((fav) => fav.toLowerCase() !== city.toLowerCase());
    } else {
      updated = [...favorites, city];
    }
    setFavorites(updated);
    localStorage.setItem("favorite_cities", JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-slate-100 dark:from-blue-950 dark:via-slate-900 dark:to-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-300">
      
      {/* Header */}
      <Header
        onSearch={fetchWeather}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        currentCity={cityName}
      />

      {/* Banner de Demonstração (Exibido se os dados forem Mockados e o banner não estiver fechado) */}
      {weatherData?.isMock && showDemoBanner && (
        <div className="bg-amber-600/20 border-b border-amber-500/20 text-amber-200 py-3.5 px-4 text-xs sm:text-sm transition-all duration-300">
          <div className="mx-auto max-w-7xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-amber-500 flex-shrink-0" size={16} />
              <span>
                <strong>Modo de Demonstração Ativo:</strong> Exibindo dados simulados consistentes para <strong>{cityName}</strong>. Para ver dados meteorológicos reais em tempo real, configure a chave de API <code>OPENWEATHER_API_KEY</code> no arquivo <code>.env.local</code>.
              </span>
            </div>
            <button
              onClick={() => setShowDemoBanner(false)}
              className="text-amber-200/60 hover:text-white font-bold px-2 py-0.5 rounded border border-amber-500/35 hover:bg-amber-500/20 transition-all text-xs"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Estado de Carregamento */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <RefreshCw className="animate-spin text-blue-500" size={48} />
            <p className="text-sm font-semibold tracking-wide text-blue-200">Consultando o clima em {cityName}...</p>
          </div>
        )}

        {/* Estado de Erro */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4 rounded-3xl border border-rose-500/20 bg-rose-950/10 backdrop-blur-md">
            <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">Erro na Consulta Climática</h3>
            <p className="text-sm text-rose-200/70 max-w-md">{error}</p>
            <button
              onClick={() => fetchWeather(cityName)}
              className="px-6 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-sm font-bold transition-all shadow-lg shadow-rose-600/20"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Dashboard Climático Principal */}
        {!loading && !error && weatherData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Seção 1: Hero Card (Destaque do Clima) */}
            <WeatherHero current={weatherData.current} />

            {/* Seção 2: Detalhes Complementares (Nascer do Sol, Lua, Umidade, Vento) */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">Condições Detalhadas</h3>
              <WeatherDetails current={weatherData.current} />
            </div>

            {/* Seção 3: Gráficos (Horário e Diário) */}
            <div id="previsao-detalhada">
              <WeatherCharts hourly={weatherData.hourly} daily={weatherData.daily} />
            </div>

            {/* Seção 4: Radar / Mapa Climático da Região */}
            <WeatherMap
              cityName={weatherData.current.name}
              coordinates={weatherData.coordinates}
              neighboringCities={weatherData.neighboringCities}
              onCityClick={fetchWeather}
            />

            {/* Configuração Rápida de API (Exclusivo para desenvolvedores visualizarem na Demo) */}
            {weatherData.isMock && (
              <div className="rounded-3xl border border-white/5 bg-slate-950/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
                    <KeyRound size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Como conectar a API Key real?</h4>
                    <p className="text-xs text-white/50 leading-relaxed max-w-lg mt-1">
                      1. Crie uma conta gratuita em <a href="https://openweathermap.org" target="_blank" rel="noopener" className="text-blue-400 hover:underline">openweathermap.org</a>.<br />
                      2. Obtenha sua API Key (pode levar alguns minutos para ativar).<br />
                      3. Abra o arquivo <code>.env.local</code> na raiz deste projeto e insira a chave na variável: <code>OPENWEATHER_API_KEY=sua_chave</code>.<br />
                      4. Reinicie o servidor de desenvolvimento para aplicar.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <Check size={14} />
                  <span>Ambiente Seguro: API Key oculta no Servidor</span>
                </div>
              </div>
            )}
            
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
