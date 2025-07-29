export type Country = {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
};

export async function fetchCountries(): Promise<Country[]> {
  const res = await fetch(
    "https://restcountries.com/v3.1/independent?status=true"
  );
  const data = await res.json();

  return data
    .map((c: any) => {
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
    .filter((c: Country) => c.dialCode); // Remove invalid entries
}
