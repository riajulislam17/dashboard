interface ChartData {
  categories: string[];
  series: { name: string; data: number[] }[];
}

interface ApiResponse {
  website_visits: Record<string, { desktop: number; mobile: number }>;
  offers_sent: Record<string, number>;
}
