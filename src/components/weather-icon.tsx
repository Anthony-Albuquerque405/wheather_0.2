import React from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  CloudLightning,
  Moon,
  CloudMoon,
} from "lucide-react";

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function WeatherIcon({ name, className = "", size = 24 }: WeatherIconProps) {
  const iconName = name.toLowerCase();

  switch (iconName) {
    case "sunny":
    case "clear":
      return <Sun className={`text-amber-400 animate-spin-slow ${className}`} size={size} />;
    case "cloudy":
    case "clouds":
      return <Cloud className={`text-slate-300 ${className}`} size={size} />;
    case "rainy":
    case "rain":
    case "drizzle":
      return <CloudRain className={`text-sky-400 ${className}`} size={size} />;
    case "windy":
    case "wind":
      return <Wind className={`text-teal-300 ${className}`} size={size} />;
    case "stormy":
    case "thunderstorm":
      return <CloudLightning className={`text-purple-400 animate-pulse ${className}`} size={size} />;
    case "clear-night":
      return <Moon className={`text-indigo-200 ${className}`} size={size} />;
    case "cloudy-night":
      return <CloudMoon className={`text-slate-400 ${className}`} size={size} />;
    default:
      return <Cloud className={`text-slate-300 ${className}`} size={size} />;
  }
}
