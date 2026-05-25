"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, CloudSun, Star, X, Menu, Sun, Moon } from "lucide-react";

interface HeaderProps {
  onSearch: (city: string) => void;
  favorites: string[];
  onToggleFavorite: (city: string) => void;
  currentCity: string;
}

export function Header({ onSearch, favorites, onToggleFavorite, currentCity }: HeaderProps) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  
  const dropdownRef = useRef<HTMLFormElement>(null);

  // Carregar buscas recentes e tema salvo
  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    // Carregar tema salvo
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Fechar dropdown de busca ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    triggerSearch(query.trim());
  };

  const triggerSearch = (city: string) => {
    onSearch(city);
    setQuery("");
    setShowDropdown(false);
    
    // Atualizar buscas recentes
    const updated = [city, ...recentSearches.filter((c) => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  const removeRecentSearch = (e: React.MouseEvent, cityToRemove: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((c) => c !== cityToRemove);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  return (
    <>
      <header className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-300 ${
        isDark 
          ? "border-white/10 bg-blue-950/80 text-white" 
          : "border-slate-200 bg-white/80 text-slate-900"
      }`}>
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSearch("Belo Jardim")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-sky-300 shadow-lg shadow-blue-500/30">
            <CloudSun size={24} className="text-white" />
          </div>
          <span className={`text-xl font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent ${
            isDark ? "from-white to-blue-200" : "from-slate-900 to-blue-600"
          }`}>
            Clima Agora
          </span>
        </div>

        {/* Barra de Pesquisa */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md mx-4 hidden md:block" ref={dropdownRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cidade..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className={`w-full h-10 pl-10 pr-4 rounded-full border focus:outline-none transition-all text-sm ${
                isDark 
                  ? "bg-white/10 border-white/10 text-white placeholder-white/50 focus:border-blue-400 focus:bg-white/15"
                  : "bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white"
              }`}
            />
            <Search className={`absolute left-3.5 top-2.5 ${isDark ? "text-white/50" : "text-slate-400"}`} size={16} />
          </div>

          {/* Dropdown de Buscas Recentes e Favoritos */}
          {showDropdown && (recentSearches.length > 0 || favorites.length > 0) && (
            <div className={`absolute top-12 left-0 w-full rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
              isDark 
                ? "bg-slate-900 border-white/10 text-slate-200"
                : "bg-white border-slate-200 text-slate-700"
            }`}>
              {favorites.length > 0 && (
                <div className="mb-4">
                  <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                    isDark ? "text-white/40" : "text-slate-400"
                  }`}>
                    <Star size={12} className="text-amber-400 fill-amber-400" /> Cidades Favoritas
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {favorites.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => triggerSearch(city)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors border font-medium ${
                          isDark
                            ? "bg-white/5 hover:bg-blue-600/20 hover:text-blue-300 border-white/5"
                            : "bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border-slate-200"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {recentSearches.length > 0 && (
                <div>
                  <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDark ? "text-white/40" : "text-slate-400"
                  }`}>
                    Buscas Recentes
                  </h4>
                  <ul className="space-y-1">
                    {recentSearches.map((city) => (
                      <li
                        key={city}
                        onClick={() => triggerSearch(city)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-sm transition-colors group ${
                          isDark ? "hover:bg-white/5" : "hover:bg-slate-50"
                        }`}
                      >
                        <span>{city}</span>
                        <button
                          type="button"
                          onClick={(e) => removeRecentSearch(e, city)}
                          className={`p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                            isDark ? "text-white/30 hover:text-white/80" : "text-slate-300 hover:text-slate-600"
                          }`}
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </form>

        {/* Menu de Navegação - Desktop */}
        <nav className={`hidden lg:flex items-center gap-6 text-sm font-medium ${
          isDark ? "text-white/70" : "text-slate-500"
        }`}>
          <a href="#previsao-detalhada" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>Clima</a>
          <a href="#previsao-detalhada" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>Previsão Horária</a>
          <a href="#mapa-interativo" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>Mapas</a>
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botão Dark/Light Mode */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full border transition-all ${
              isDark
                ? "bg-white/5 border-white/10 text-amber-400 hover:bg-white/10 hover:text-amber-300"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
            title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Hamburguer menu - Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg border lg:hidden ${
              isDark 
                ? "bg-white/5 border-white/10 text-white/80 hover:text-white"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-t px-4 py-4 space-y-4 ${
          isDark ? "border-white/10 bg-blue-950" : "border-slate-200 bg-white"
        }`}>
          {/* Busca Mobile */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Buscar cidade..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full h-10 pl-10 pr-4 rounded-full border text-sm ${
                isDark
                  ? "bg-white/10 border-white/10 text-white placeholder-white/50"
                  : "bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400"
              }`}
            />
            <Search className={`absolute left-3.5 top-2.5 ${isDark ? "text-white/50" : "text-slate-400"}`} size={16} />
          </form>

          <nav className={`flex flex-col gap-3 text-sm font-medium ${
            isDark ? "text-white/70" : "text-slate-500"
          }`}>
            <a href="#previsao-detalhada" onClick={() => setMobileMenuOpen(false)} className={`py-1 ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>Clima</a>
            <a href="#previsao-detalhada" onClick={() => setMobileMenuOpen(false)} className={`py-1 ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>Previsão Horária</a>
            <a href="#mapa-interativo" onClick={() => setMobileMenuOpen(false)} className={`py-1 ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>Mapas</a>
          </nav>
        </div>
      )}
      </header>
    </>
  );
}
