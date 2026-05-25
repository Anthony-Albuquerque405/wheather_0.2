import { NextRequest, NextResponse } from "next/server";

// Função para gerar um hash numérico a partir de uma string (nome da cidade)
// Usado para garantir que a mesma cidade sempre retorne dados climáticos consistentes no modo Mock
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Converte para inteiro de 32 bits
  }
  return Math.abs(hash);
}

// Retorna dados meteorológicos simulados realistas com base no nome da cidade
function generateMockData(city: string, lang: string = "pt") {
  const hash = hashCode(city.toLowerCase().trim());

  // Determinar clima básico baseado no hash para variedade
  const climateTypes = ["sunny", "cloudy", "rainy", "windy", "stormy"];
  const climate = climateTypes[hash % climateTypes.length];

  // Latitude e longitude realistas aproximadas
  const lat = ((hash % 180) - 90) * 0.9;
  const lon = ((hash % 360) - 180) * 0.9;

  // Temperatura base baseada no hash (de -10°C a 38°C)
  let baseTemp = 15 + (hash % 20); // padrão entre 15°C e 35°C
  if (city.toLowerCase().includes("siberia") || city.toLowerCase().includes("moscow") || city.toLowerCase().includes("canada")) {
    baseTemp = -10 + (hash % 15);
  } else if (city.toLowerCase().includes("sahara") || city.toLowerCase().includes("rio de janeiro") || city.toLowerCase().includes("nordeste") || city.toLowerCase().includes("belo jardim")) {
    baseTemp = 26 + (hash % 10);
  }

  const tempMin = Math.round((baseTemp - 4 - (hash % 4)) * 10) / 10;
  const tempMax = Math.round((baseTemp + 5 + (hash % 5)) * 10) / 10;
  const currentTemp = Math.round(((tempMin + tempMax) / 2) * 10) / 10;

  // Humidade (30% a 95%)
  let humidity = 40 + (hash % 50);
  if (climate === "rainy" || climate === "stormy") humidity = 80 + (hash % 15);
  if (climate === "sunny") humidity = 30 + (hash % 20);

  // Vento (5 km/h a 75 km/h)
  let windSpeed = 5 + (hash % 30);
  if (climate === "windy" || climate === "stormy") windSpeed = 45 + (hash % 30);

  // Condições climáticas
  let conditionText = lang === "en" ? "Partly Cloudy" : "Parcialmente Nublado";
  let conditionIcon = "cloudy";
  let alert = "";

  switch (climate) {
    case "sunny":
      conditionText = lang === "en" ? "Sunny / Clear Sky" : "Ensolarado / Céu Limpo";
      conditionIcon = "sunny";
      break;
    case "cloudy":
      conditionText = lang === "en" ? "Mostly Cloudy" : "Maioria Nublado";
      conditionIcon = "cloudy";
      break;
    case "rainy":
      conditionText = lang === "en" ? "Light Rain" : "Chuva Leve";
      conditionIcon = "rainy";
      alert = lang === "en" ? "Light rain forecast in the coming hours." : "Previsão de chuva fraca nas próximas horas.";
      break;
    case "windy":
      conditionText = lang === "en" ? "Strong Winds" : "Ventos Fortes";
      conditionIcon = "windy";
      alert = lang === "en" ? "Alert of wind gusts above average." : "Alerta de rajadas de vento acima da média.";
      break;
    case "stormy":
      conditionText = lang === "en" ? "Isolated Thunderstorms" : "Tempestades Isoladas";
      conditionIcon = "stormy";
      alert = lang === "en" ? "Notice of short-duration storm in the region." : "Aviso de tempestade de curta duração na região.";
      break;
  }

  // Fase da lua (simulada)
  const moonPhases = lang === "en"
    ? ["New", "Waxing Crescent", "Full", "Waning Gibbous"]
    : ["Nova", "Crescente", "Cheia", "Minguante"];
  const moonPhase = moonPhases[hash % moonPhases.length];

  // Previsão Horária (24 horas, em blocos de 3h, começando às 18:00 até 15:00 do dia seguinte)
  const hourly = [];
  const hours = [18, 21, 0, 3, 6, 9, 12, 15];
  for (let i = 0; i < hours.length; i++) {
    const hr = hours[i];
    const hrStr = `${hr.toString().padStart(2, "0")}:00`;

    // Temperatura oscila ao longo do dia (mais fria de madrugada, mais quente à tarde)
    let tempDiff = 0;
    if (hr >= 0 && hr <= 6) tempDiff = -3 - (hash % 3); // madrugada
    else if (hr >= 12 && hr <= 15) tempDiff = 4 + (hash % 3); // tarde
    const hTemp = Math.round((currentTemp + tempDiff) * 10) / 10;

    // Percentuais de precipitação (10% a 95%)
    let hPop = 10 + ((hash + i * 17) % 30);
    if (climate === "rainy" || climate === "stormy") {
      hPop = 65 + ((hash + i * 23) % 30);
    }

    // Ícone da hora
    let hIcon = conditionIcon;
    if (hr >= 18 || hr <= 5) {
      hIcon = climate === "sunny" ? "clear-night" : "cloudy-night";
    }

    hourly.push({
      time: hrStr,
      temp: hTemp,
      pop: hPop,
      icon: hIcon,
    });
  }

  // Previsão Diária (7 dias consecutivos)
  const daysPT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const daysEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = lang === "en" ? daysEN : daysPT;
  const todayIndex = new Date().getDay();
  const daily = [];

  for (let i = 0; i < 7; i++) {
    const dayName = days[(todayIndex + i) % 7];
    const dTempMin = Math.round((tempMin + ((hash + i * 13) % 5) - 2) * 10) / 10;
    const dTempMax = Math.round((tempMax + ((hash + i * 9) % 6) - 2) * 10) / 10;

    // Escolher ícone aleatório consistente para o dia
    const dClimateIndex = (hash + i * 11) % climateTypes.length;
    const dClimate = climateTypes[dClimateIndex];
    let dIcon = "sunny";
    if (dClimate === "cloudy") dIcon = "cloudy";
    if (dClimate === "rainy" || dClimate === "stormy") dIcon = "rainy";
    if (dClimate === "windy") dIcon = "windy";

    daily.push({
      day: dayName,
      date: `${21 + i}/05`, // simulando dia do calendário
      tempMin: dTempMin,
      tempMax: dTempMax,
      icon: dIcon,
    });
  }

  // Dados de cidades vizinhas para o mapa interativo
  const suffixNorth = lang === "en" ? "North" : "Norte";
  const suffixSouth = lang === "en" ? "South" : "Sul";
  const suffixEast = lang === "en" ? "East" : "Leste";
  const suffixWest = lang === "en" ? "West" : "Oeste";
  const neighboringCities = [
    { name: `${city} ${suffixNorth}`, lat: lat + 0.08, lon: lon - 0.05, temp: Math.round((currentTemp - 1) * 10) / 10, icon: conditionIcon },
    { name: `${city} ${suffixSouth}`, lat: lat - 0.07, lon: lon + 0.06, temp: Math.round((currentTemp + 1) * 10) / 10, icon: conditionIcon },
    { name: `${city} ${suffixEast}`, lat: lat + 0.03, lon: lon + 0.09, temp: Math.round(currentTemp * 10) / 10, icon: conditionIcon },
    { name: `${city} ${suffixWest}`, lat: lat - 0.05, lon: lon - 0.08, temp: Math.round((currentTemp - 2) * 10) / 10, icon: conditionIcon },
  ];

  return {
    isMock: true,
    current: {
      name: city.charAt(0).toUpperCase() + city.slice(1),
      temp: currentTemp,
      tempMin,
      tempMax,
      feelsLike: Math.round((currentTemp - 1 + (hash % 3)) * 10) / 10,
      description: conditionText,
      icon: conditionIcon,
      humidity,
      windSpeed: Math.round(windSpeed * 10) / 10,
      pressure: 1010 + (hash % 15),
      uvIndex: 1 + (hash % 10),
      visibility: 10000 - (hash % 3000),
      sunrise: "05:31",
      sunset: "17:42",
      moonPhase,
      alert,
    },
    hourly,
    daily,
    coordinates: {
      lat,
      lon,
    },
    neighboringCities,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("q");
  const lang = (searchParams.get("lang") || "pt").toLowerCase();

  if (!city) {
    return NextResponse.json(
      { error: "Cidade não fornecida." },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  // Se não houver API Key, usa o modo Mock de forma automática e segura
  if (!apiKey || apiKey.trim() === "" || apiKey === "sua_chave_aqui") {
    const mockData = generateMockData(city, lang);
    return NextResponse.json(mockData);
  }

  try {
    const apiLang = lang === "en" ? "en" : "pt_br";
    // 1. Buscar clima atual
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric&lang=${apiLang}`,
      { next: { revalidate: 600 } } // Cache por 10 minutos
    );

    if (!currentRes.ok) {
      if (currentRes.status === 401 || currentRes.status === 404) {
        // Se a chave for inválida ou a cidade não for encontrada, retorna erro descritivo
        return NextResponse.json(
          { error: currentRes.status === 404 ? "Cidade não encontrada." : "Chave de API inválida." },
          { status: currentRes.status }
        );
      }
      throw new Error("Erro na API do OpenWeatherMap");
    }

    const currentData = await currentRes.json();

    // 2. Buscar previsão (forecast 5 dias)
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric&lang=${apiLang}`,
      { next: { revalidate: 1800 } } // Cache por 30 minutos
    );

    let forecastData;
    if (forecastRes.ok) {
      forecastData = await forecastRes.json();
    }

    // Processar e mapear ícones para o nosso padrão simplificado
    const mapIcon = (id: number): string => {
      if (id >= 200 && id < 300) return "stormy";
      if (id >= 300 && id < 600) return "rainy";
      if (id >= 600 && id < 700) return "rainy"; // neve mapeado para chuva por simplicidade de layout
      if (id === 800) return "sunny";
      if (id > 800 && id < 804) return "cloudy";
      return "cloudy"; // nublado severo ou atmosfera
    };

    // Mapear previsão horária (pegar os primeiros 8 blocos de 3h do forecast para cobrir ~24 horas)
    const hourly = [];
    if (forecastData && forecastData.list) {
      const list = forecastData.list.slice(0, 8);
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const dateObj = new Date(item.dt * 1000);
        const timeStr = `${dateObj.getHours().toString().padStart(2, "0")}:00`;

        hourly.push({
          time: timeStr,
          temp: Math.round(item.main.temp * 10) / 10,
          pop: Math.round((item.pop || 0) * 100), // probabilidade de precipitação em %
          icon: mapIcon(item.weather[0].id),
        });
      }
    } else {
      // Fallback de horários caso falhe a segunda rota
      hourly.push({ time: "Agora", temp: Math.round(currentData.main.temp), pop: 10, icon: mapIcon(currentData.weather[0].id) });
    }

    // Mapear previsão diária (agrupar dados do forecast por dia)
    const daily: any[] = [];
    if (forecastData && forecastData.list) {
      const dayMap: { [key: string]: any } = {};
      const daysOfWeekPT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      const daysOfWeekEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const daysOfWeek = lang === "en" ? daysOfWeekEN : daysOfWeekPT;

      forecastData.list.forEach((item: any) => {
        const dateObj = new Date(item.dt * 1000);
        const dayName = daysOfWeek[dateObj.getDay()];
        const dateStr = `${dateObj.getDate().toString().padStart(2, "0")}/${(dateObj.getMonth() + 1).toString().padStart(2, "0")}`;

        if (!dayMap[dayName]) {
          dayMap[dayName] = {
            day: dayName,
            date: dateStr,
            tempMin: item.main.temp_min,
            tempMax: item.main.temp_max,
            iconIds: [item.weather[0].id],
          };
        } else {
          dayMap[dayName].tempMin = Math.min(dayMap[dayName].tempMin, item.main.temp_min);
          dayMap[dayName].tempMax = Math.max(dayMap[dayName].tempMax, item.main.temp_max);
          dayMap[dayName].iconIds.push(item.weather[0].id);
        }
      });

      // Converter objeto de volta em array e pegar 7 dias (ou o que houver, geralmente 5-6 dias no forecast gratuito)
      Object.keys(dayMap).forEach((key) => {
        const dayInfo = dayMap[key];
        // Encontrar o ícone mais comum no dia
        const mostCommonIconId = dayInfo.iconIds.sort(
          (a: any, b: any) =>
            dayInfo.iconIds.filter((v: any) => v === a).length -
            dayInfo.iconIds.filter((v: any) => v === b).length
        ).pop();

        daily.push({
          day: dayInfo.day,
          date: dayInfo.date,
          tempMin: Math.round(dayInfo.tempMin * 10) / 10,
          tempMax: Math.round(dayInfo.tempMax * 10) / 10,
          icon: mapIcon(mostCommonIconId),
        });
      });
    }

    // Determinar fase da lua aproximada baseada na data
    const getMoonPhase = () => {
      const phasesPT = ["Nova", "Crescente", "Cheia", "Minguante"];
      const phasesEN = ["New", "Crescent", "Full", "Waning"];
      const phases = lang === "en" ? phasesEN : phasesPT;
      const day = new Date().getDate();
      return phases[Math.floor((day % 30) / 7.5) % 4];
    };

    // Gerar alertas meteorológicos simulados inteligentes com base no vento e chuva reais
    let alert = "";
    if (currentData.wind.speed > 10) {
      alert = lang === "en"
        ? `Warning of strong winds up to ${Math.round(currentData.wind.speed * 3.6)} km/h in the region.`
        : `Aviso de ventos fortes de até ${Math.round(currentData.wind.speed * 3.6)} km/h na região.`;
    } else if (currentData.weather[0].id >= 200 && currentData.weather[0].id < 600) {
      alert = lang === "en"
        ? "Forecast of continuous precipitation in the coming hours. Drive carefully."
        : "Previsão de precipitação contínua nas próximas horas. Cuidado ao dirigir.";
    }

    // Cidades vizinhas
    const lat = currentData.coord.lat;
    const lon = currentData.coord.lon;
    const currentTemp = currentData.main.temp;
    const currentIcon = mapIcon(currentData.weather[0].id);
    const suffixNorth = lang === "en" ? "North" : "Norte";
    const suffixSouth = lang === "en" ? "South" : "Sul";
    const suffixEast = lang === "en" ? "East" : "Leste";
    const suffixWest = lang === "en" ? "West" : "Oeste";
    const neighboringCities = [
      { name: `${currentData.name} ${suffixNorth}`, lat: lat + 0.08, lon: lon - 0.05, temp: Math.round((currentTemp - 1) * 10) / 10, icon: currentIcon },
      { name: `${currentData.name} ${suffixSouth}`, lat: lat - 0.07, lon: lon + 0.06, temp: Math.round((currentTemp + 1) * 10) / 10, icon: currentIcon },
      { name: `${currentData.name} ${suffixEast}`, lat: lat + 0.03, lon: lon + 0.09, temp: Math.round(currentTemp * 10) / 10, icon: currentIcon },
      { name: `${currentData.name} ${suffixWest}`, lat: lat - 0.05, lon: lon - 0.08, temp: Math.round((currentTemp - 2) * 10) / 10, icon: currentIcon },
    ];

    const formattedData = {
      isMock: false,
      current: {
        name: currentData.name,
        temp: Math.round(currentData.main.temp * 10) / 10,
        tempMin: Math.round(currentData.main.temp_min * 10) / 10,
        tempMax: Math.round(currentData.main.temp_max * 10) / 10,
        feelsLike: Math.round(currentData.main.feels_like * 10) / 10,
        description: currentData.weather[0].description.charAt(0).toUpperCase() + currentData.weather[0].description.slice(1),
        icon: currentIcon,
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6 * 10) / 10, // Converter m/s para km/h
        pressure: currentData.main.pressure,
        uvIndex: 5, // UV index não está no endpoint gratuito do weather 2.5
        visibility: currentData.visibility || 10000,
        sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        moonPhase: getMoonPhase(),
        alert,
      },
      hourly,
      daily: daily.slice(0, 7), // limitar a 7 dias
      coordinates: {
        lat,
        lon,
      },
      neighboringCities,
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Erro ao buscar dados climáticos:", error);
    // Se a chamada oficial falhar (ex: rede offline), entra em modo fallback simulado
    const mockData = generateMockData(city, lang);
    return NextResponse.json(mockData);
  }
}
