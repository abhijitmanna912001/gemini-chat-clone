export type Country = {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
};

// Partial typing for the API response (only fields we use)
type CountryAPIResponse = {
  name: {
    common: string;
  };
  cca2: string;
  idd?: {
    root?: string;
    suffixes?: string[];
  };
};

export async function fetchCountries(): Promise<Country[]> {
  const res = await fetch(
    "https://restcountries.com/v3.1/independent?status=true"
  );
  const data: CountryAPIResponse[] = await res.json();

  return data
    .map((c) => {
      const code = c.cca2;
      const dialRoot = c.idd?.root || "";
      const dialSuffix = c.idd?.suffixes?.[0] || "";
      return {
        name: c.name.common,
        code,
        dialCode: dialRoot + dialSuffix,
        flag: `https://flagcdn.com/${code.toLowerCase()}.svg`,
      };
    })
    .filter((c) => c.dialCode); // Only keep countries with dial code
}
