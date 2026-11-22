import obsidiana from './brands/obsidiana/color.tokens.json' assert { type: 'json' };
import ixiptla from './brands/ixiptla/color.tokens.json' assert { type: 'json' };

type Token = { value: string; type: string };
type Group = Record<string, Token>;
type Palette = { color: Record<string, Record<'light' | 'dark', Group>> };
type Oklch = [number, number, number];

const AA_TEXT = 4.5;
const AA_NON_TEXT = 3;

const BRANDS: Record<string, Palette> = {
  obsidiana: obsidiana as unknown as Palette,
  ixiptla: ixiptla as unknown as Palette,
};
const MODES = ['light', 'dark'] as const;
const FILL_ROLES = ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'];
const TEXT_ROLES = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'];
const BASES = ['100', '200', '300'];

/** Legacy obsidiana fills kept unchanged on purpose; every other token must be in sRGB. */
const OUT_OF_GAMUT_ALLOWED = new Set([
  'obsidiana.base.light.100',
  'obsidiana.base.light.200',
  'obsidiana.neutral.light.default',
  'obsidiana.primary.light.default',
  'obsidiana.primary.dark.default',
  'obsidiana.secondary.light.default',
  'obsidiana.secondary.dark.default',
  'obsidiana.info.light.default',
  'obsidiana.info.dark.default',
]);

const parse = (value: string): Oklch => {
  const m = value.match(/^oklch\(([\d.]+)% ([\d.]+) ([\d.]+)\)$/);
  if (!m) throw new Error(`Not an OKLCH value: ${value}`);
  return [Number(m[1]) / 100, Number(m[2]), Number(m[3])];
};

const toLinearSrgb = ([L, C, H]: Oklch): Oklch => {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
};

const inGamut = (value: string) => toLinearSrgb(parse(value)).every((c) => c >= -1e-4 && c <= 1 + 1e-4);

const luminance = (value: string) => {
  const [r, g, b] = toLinearSrgb(parse(value)).map((c) => Math.min(1, Math.max(0, c)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (fg: string, bg: string) => {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

type Pair = [label: string, fg: string, bg: string, min: number];

const pairsFor = (palette: Palette, mode: (typeof MODES)[number]): Pair[] => {
  const c = palette.color;
  const v = (group: string, key: string) => {
    const token = c[group]?.[mode]?.[key];
    if (!token) throw new Error(`Missing color.${group}.${mode}.${key}`);
    return token.value;
  };
  const pairs: Pair[] = [];

  FILL_ROLES.forEach((r) => pairs.push([`${r}-content on ${r}`, v(r, 'content'), v(r, 'default'), AA_TEXT]));
  BASES.forEach((b) => {
    pairs.push([`base-content on base-${b}`, v('base', 'content'), v('base', b), AA_TEXT]);
    pairs.push([`base-muted on base-${b}`, v('base', 'muted'), v('base', b), AA_TEXT]);
    pairs.push([`ring on base-${b}`, v('ring', 'default'), v('base', b), AA_NON_TEXT]);
    TEXT_ROLES.forEach((r) => pairs.push([`${r}-text on base-${b}`, v(r, 'text'), v('base', b), AA_TEXT]));
  });
  ['100', '200'].forEach((b) => pairs.push([`border on base-${b}`, v('border', 'default'), v('base', b), AA_NON_TEXT]));
  Object.keys(c['surface']?.[mode] ?? {}).forEach((s) => {
    pairs.push([`base-content on surface-${s}`, v('base', 'content'), v('surface', s), AA_TEXT]);
    pairs.push([`base-muted on surface-${s}`, v('base', 'muted'), v('surface', s), AA_TEXT]);
  });
  return pairs;
};

const flatten = (brand: string, palette: Palette): [string, string][] =>
  Object.entries(palette.color).flatMap(([group, modes]) =>
    Object.entries(modes).flatMap(([mode, tokens]) =>
      Object.entries(tokens).map(([key, token]) => [`${brand}.${group}.${mode}.${key}`, token.value] as [string, string])
    )
  );

describe('Color contrast (WCAG 2, sRGB-clipped)', () => {
  it('matches the reference ratios from the audit script', () => {
    expect(contrast('oklch(98% 0.003 262.2)', 'oklch(72.6% 0.21 245)')).toBeCloseTo(2.34, 2);
    expect(contrast('oklch(26.2% 0.003 262.2)', 'oklch(70.3% 0.16 35)')).toBeCloseTo(5.48, 2);
    expect(contrast('oklch(100% 0 0)', 'oklch(0% 0 0)')).toBeCloseTo(21, 5);
  });

  describe.each(Object.entries(BRANDS))('%s', (brand, palette) => {
    describe.each(MODES)('%s', (mode) => {
      it.each(pairsFor(palette, mode))('%s', (_label, fg, bg, min) => {
        expect(contrast(fg, bg)).toBeGreaterThanOrEqual(min);
      });
    });

    it('keeps every token inside the sRGB gamut (except documented legacy fills)', () => {
      const outside = flatten(brand, palette)
        .filter(([path, value]) => !OUT_OF_GAMUT_ALLOWED.has(path) && !inGamut(value))
        .map(([path, value]) => `${path} = ${value}`);
      expect(outside).toEqual([]);
    });
  });
});
