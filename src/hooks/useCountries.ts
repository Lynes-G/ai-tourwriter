import { useState, useEffect } from "react";

interface CountryData {
  name: {
    common: string;
    official: string;
  };
  cca3: string;
  cioc?: string;
  flags?: {
    png: string;
    svg: string;
    alt?: string;
  };
  maps?: {
    googleMaps: string;
    openStreetMaps: string;
  };
  latlng?: [number, number];
}

// Cache for countries data
let cachedCountries: Country[] | null = null;
let cachePromise: Promise<Country[]> | null = null;

// Fallback list of popular countries in case API is unavailable
const fallbackCountries: Country[] = [
  { name: "United States", code: "USA", value: "United States", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GBR", value: "United Kingdom", flag: "🇬🇧" },
  { name: "Canada", code: "CAN", value: "Canada", flag: "🇨🇦" },
  { name: "Australia", code: "AUS", value: "Australia", flag: "🇦🇺" },
  { name: "Germany", code: "DEU", value: "Germany", flag: "🇩🇪" },
  { name: "France", code: "FRA", value: "France", flag: "🇫🇷" },
  { name: "Italy", code: "ITA", value: "Italy", flag: "🇮🇹" },
  { name: "Spain", code: "ESP", value: "Spain", flag: "🇪🇸" },
  { name: "Japan", code: "JPN", value: "Japan", flag: "🇯🇵" },
  { name: "Brazil", code: "BRA", value: "Brazil", flag: "🇧🇷" },
  { name: "India", code: "IND", value: "India", flag: "🇮🇳" },
  { name: "China", code: "CHN", value: "China", flag: "🇨🇳" },
  { name: "Mexico", code: "MEX", value: "Mexico", flag: "🇲🇽" },
  { name: "Thailand", code: "THA", value: "Thailand", flag: "🇹🇭" },
  { name: "Greece", code: "GRC", value: "Greece", flag: "🇬🇷" },
  { name: "Turkey", code: "TUR", value: "Turkey", flag: "🇹🇷" },
  { name: "Egypt", code: "EGY", value: "Egypt", flag: "🇪🇬" },
  { name: "South Africa", code: "ZAF", value: "South Africa", flag: "🇿🇦" },
  { name: "New Zealand", code: "NZL", value: "New Zealand", flag: "🇳🇿" },
  { name: "Netherlands", code: "NLD", value: "Netherlands", flag: "🇳🇱" },
].sort((a, b) => a.name.localeCompare(b.name));

async function fetchCountriesData(): Promise<Country[]> {
  if (cachedCountries) {
    return cachedCountries;
  }

  if (cachePromise) {
    return cachePromise;
  }

  cachePromise = (async () => {
    console.log("🌍 Fetching countries from REST Countries API...");

    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca3,cioc,flags,maps,latlng",
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }

    const data: CountryData[] = await response.json(); // Transform the data to match our Country interface
    const transformedCountries = data
      .map((country) => ({
        name: country.name.common,
        code: country.cca3,
        value: country.name.common,
        flag: country.flags?.png,
        flagSvg: country.flags?.svg,
        flagAlt: country.flags?.alt || `${country.name.common} flag`,
        googleMaps: country.maps?.googleMaps,
        openStreetMaps: country.maps?.openStreetMaps,
        coordinates: country.latlng,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

    cachedCountries = transformedCountries;
    cachePromise = null;

    console.log(`✅ Loaded ${transformedCountries.length} countries`);
    return transformedCountries;
  })();

  return cachePromise;
}

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        setError(null);

        const countriesData = await fetchCountriesData();
        setCountries(countriesData);
      } catch (err) {
        console.error("❌ Error fetching countries:", err);
        console.log("🔄 Using fallback countries list");

        // Use fallback countries if API fails
        setCountries(fallbackCountries);
        setError("Using offline country list - some countries may be missing");
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  return { countries, loading, error };
}

// Export function to manually clear cache if needed
export function clearCountriesCache() {
  cachedCountries = null;
  cachePromise = null;
}
