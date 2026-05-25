"use client";

import React, { useState } from "react";
import { Download, Bell, BellOff, Heart } from "lucide-react";

export function Footer() {
  const [notificationsActive, setNotificationsActive] = useState(false);
  const [appInstalled, setAppInstalled] = useState(false);

  const toggleNotifications = () => {
    setNotificationsActive(!notificationsActive);
    const alertMsg = !notificationsActive 
      ? "Notificações ativadas! Você receberá alertas climáticos severos." 
      : "Notificações desativadas.";
    alert(alertMsg);
  };

  const handleInstallApp = () => {
    setAppInstalled(true);
    alert("Aplicativo 'Clima Agora' instalado com sucesso na sua área de trabalho!");
  };

  return (
    <footer className="mt-auto border-t border-white/10 dark:border-white/10 bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-white/60 transition-colors duration-300">
      
      {/* Container Principal */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Lado Esquerdo: Info Geral e PWA */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Clima Agora</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-500/20">v0.2</span>
          </div>
          <p className="text-xs leading-relaxed max-w-xs text-slate-400 dark:text-white/50">
            Acompanhe o clima em tempo real e planeje seu dia com nossos gráficos detalhados e radar de precisão.
          </p>

          {/* Botões de Instalação e Notificações (PWA/Push) */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={handleInstallApp}
              disabled={appInstalled}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/25 text-xs font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Download size={14} />
              <span>{appInstalled ? "Aplicativo Instalado" : "Instalar Aplicativo"}</span>
            </button>

            <button
              onClick={toggleNotifications}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                notificationsActive 
                  ? "bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25" 
                  : "bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-white/80 border-slate-300 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10"
              }`}
            >
              {notificationsActive ? <Bell size={14} /> : <BellOff size={14} />}
              <span>{notificationsActive ? "Alertas Ativos" : "Ativar Alertas"}</span>
            </button>
          </div>
        </div>

        {/* Lado Direito: Parcerias */}
        <div className="flex flex-col justify-center md:items-end">
          <h4 className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider mb-3">Parcerias</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                OpenWeatherMap
              </a>
            </li>
            <li>
              <a href="https://openstreetmap.org" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                OpenStreetMap
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Direitos Autorais e Créditos */}
      <div className="border-t border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-slate-950/60 py-6 text-center text-[10px] text-slate-400 dark:text-white/40 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Clima Agora. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart size={10} className="text-rose-500 fill-rose-500" /> para o curso de programação.
          </p>
          <p>
            Dados meteorológicos fornecidos por{" "}
            <a
              href="https://openweathermap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-900 dark:text-white hover:underline font-semibold"
            >
              OpenWeatherMap API
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
