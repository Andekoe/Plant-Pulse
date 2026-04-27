const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

function getLocationFromEnv() {
  const lat = import.meta.env.VITE_WEATHER_LAT;
  const lon = import.meta.env.VITE_WEATHER_LON;

  if (!lat || !lon) {
    throw new Error('Weather coordinates are not configured. Set VITE_WEATHER_LAT and VITE_WEATHER_LON in .env.');
  }

  return { lat, lon };
}

export async function fetchRainLast24h(): Promise<number> {
  const { lat, lon } = getLocationFromEnv();
  const query = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    hourly: 'rain',
    past_days: '1',
    timezone: 'auto'
  });

  const response = await fetch(`${BASE_URL}?${query.toString()}`);
  if (!response.ok) {
    throw new Error('Weather service returned an error.');
  }

  const data = await response.json();
  const hourlyRain: number[] = data.hourly?.rain ?? [];
  return hourlyRain.reduce((sum, value) => sum + value, 0);
}
