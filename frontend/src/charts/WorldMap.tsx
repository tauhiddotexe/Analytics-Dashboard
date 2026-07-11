import { memo, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import type { ChartPoint } from '../types';

interface WorldMapProps {
  data: ChartPoint[];
}

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const ALIASES: Record<string, string> = {
  'usa': 'United States of America',
  'us': 'United States of America',
  'united states of america': 'United States of America',
  'united states': 'United States of America',
  'america': 'United States of America',
  'uk': 'United Kingdom',
  'england': 'United Kingdom',
  'great britain': 'United Kingdom',
  'britain': 'United Kingdom',
  'russia': 'Russian Federation',
  'south korea': 'Republic of Korea',
  'korea': 'Republic of Korea',
  'north korea': "Democratic People's Republic of Korea",
  'iran': 'Iran',
  'iran (islamic republic of)': 'Iran',
  'syria': 'Syrian Arab Republic',
  'venezuela': 'Venezuela',
  'venezuela (bolivarian republic of)': 'Venezuela',
  'bolivia': 'Bolivia',
  'bolivia (plurinational state of)': 'Bolivia',
  'vietnam': 'Vietnam',
  'tanzania': 'Tanzania',
  'tanzania, united republic of': 'Tanzania',
  'moldova': 'Moldova',
  'republic of moldova': 'Moldova',
  'brunei': 'Brunei',
  'brunei darussalam': 'Brunei',
  'ivory coast': "C\u00f4te d'Ivoire",
  'c\u00f4te d\'ivoire': "C\u00f4te d'Ivoire",
  'cote d\'ivoire': "C\u00f4te d'Ivoire",
  'macedonia': 'North Macedonia',
  'north macedonia': 'North Macedonia',
  'swaziland': 'Eswatini',
  'congo': 'Republic of the Congo',
  'republic of congo': 'Republic of the Congo',
  'drc': 'Democratic Republic of the Congo',
  'democratic republic of the congo': 'Democratic Republic of the Congo',
  'dr congo': 'Democratic Republic of the Congo',
  'laos': "Lao People's Democratic Republic",
  'czech republic': 'Czech Republic',
  'czechia': 'Czech Republic',
  'palestine': 'State of Palestine',
  'west bank': 'State of Palestine',
  'south sudan': 'South Sudan',
  'sudan': 'Sudan',
  'east timor': 'Timor-Leste',
  'timor leste': 'Timor-Leste',
  'myanmar': 'Myanmar',
  'burma': 'Myanmar',
  'cape verde': 'Cape Verde',
  'cabo verde': 'Cape Verde',
  'eswatini': 'Eswatini',
  'kingdom of eswatini': 'Eswatini',
  'gambia': 'Gambia',
  'the gambia': 'Gambia',
  'united arab emirates': 'United Arab Emirates',
  'uae': 'United Arab Emirates',
  'central african republic': 'Central African Republic',
  'car': 'Central African Republic',
  'saint kitts and nevis': 'Saint Kitts and Nevis',
  'st kitts and nevis': 'Saint Kitts and Nevis',
  'saint lucia': 'Saint Lucia',
  'st lucia': 'Saint Lucia',
  'saint vincent and the grenadines': 'Saint Vincent and the Grenadines',
  'st vincent and the grenadines': 'Saint Vincent and the Grenadines',
  'antigua and barbuda': 'Antigua and Barbuda',
  'trinidad and tobago': 'Trinidad and Tobago',
  's\u00e3o tom\u00e9 and pr\u00edncipe': 'Sao Tome and Principe',
  'sao tome and principe': 'Sao Tome and Principe',
};

function normalize(s: string): string {
  const cleaned = s.replace(/[^\w\s]/g, '').toLowerCase().trim();
  return cleaned.replace(/\s+/g, ' ');
}

function buildGeoIndex(geoList: { properties: { name: string } }[]): Map<string, string> {
  const index = new Map<string, string>();
  for (const geo of geoList) {
    const raw = geo.properties.name;
    const norm = normalize(raw);
    index.set(norm, raw);
    const parts = norm.split(/\s+/);
    if (parts.length > 1) {
      for (const p of parts) {
        if (p.length > 4 && !index.has(p)) index.set(p, raw);
      }
    }
  }
  return index;
}

const COLORS = ['#f0f0f2', '#cce4ff', '#80c4ff', '#4da6ff', '#007aff', '#004c99'];
const NO_DATA = '#f0f0f2';

function buildValueMap(data: ChartPoint[]) {
  const map = new Map<string, number>();
  for (const d of data) {
    if (!d.label) continue;
    const raw = d.label;
    const alias = ALIASES[normalize(raw)];
    const key = alias ?? raw;
    map.set(key, (map.get(key) ?? 0) + d.value);
  }
  return map;
}

function buildQuantileColors(values: number[]): Map<number, string> {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const colorMap = new Map<number, string>();
  const thresholds = [0.2, 0.4, 0.6, 0.8];

  for (let i = 0; i < n; i++) {
    const v = sorted[i];
    const p = i / n;
    let idx = 0;
    while (idx < thresholds.length && p > thresholds[idx]) idx++;
    colorMap.set(v, COLORS[idx + 1] ?? COLORS[COLORS.length - 1]);
  }
  return colorMap;
}

function WorldMapInner({ data }: WorldMapProps) {
  const valueMap = useMemo(() => buildValueMap(data), [data]);
  const values = useMemo(() => Array.from(valueMap.values()).filter((v) => v > 0), [valueMap]);
  const quantileColors = useMemo(() => buildQuantileColors(values), [values]);

  return (
    <div className="relative size-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130, center: [10, 30] }}
        className="size-full"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) => {
            const geoIndex = buildGeoIndex(geographies);

            for (const d of data) {
              const alias = ALIASES[normalize(d.label)];
              const target = alias ?? d.label;
              const norm = normalize(target);
              if (!geoIndex.has(norm)) {
                const parts = norm.split(/\s+/);
                let found = false;
                for (const p of parts) {
                  if (p.length > 3 && geoIndex.has(p)) {
                    const matched = geoIndex.get(p)!;
                    const n = normalize(matched);
                    geoIndex.set(norm, matched);
                    break;
                  }
                }
              }
            }

            return geographies.map((geo) => {
              const geoName = geo.properties.name as string;
              const normGeo = normalize(geoName);
              let value = 0;
              for (const [key, v] of valueMap) {
                if (normalize(key) === normGeo || geoIndex.get(normGeo) === key) {
                  value = v;
                  break;
                }
              }

              const fill = value > 0 ? (quantileColors.get(value) ?? COLORS[COLORS.length - 1]) : NO_DATA;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: value > 0 ? '#004c99' : '#c7c7cc', outline: 'none', cursor: value > 0 ? 'pointer' : 'default' },
                    pressed: { outline: 'none' },
                  }}
                  tabIndex={-1}
                >
                  {value > 0 && (
                    <title>{`${geoName}: ${value.toLocaleString()} records`}</title>
                  )}
                </Geography>
              );
            });
          }}
        </Geographies>
      </ComposableMap>

      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-[8px] bg-white/80 px-2.5 py-1.5 text-[10px]">
        <span className="text-[#86868b]">Low</span>
        <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COLORS[1] }} />
        <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COLORS[2] }} />
        <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COLORS[3] }} />
        <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COLORS[4] }} />
        <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COLORS[5] }} />
        <span className="text-[#86868b]">High</span>
      </div>
    </div>
  );
}

export const WorldMap = memo(WorldMapInner);
