/**
 * Basic integration tests for theme generators
 */

import { describe, it, expect } from 'vitest';
import { generateDaisyUITheme } from './common/utils.js';
import { generateIxiptlaDaisyUITheme } from './daisyui/generators/ixiptla.js';
import { generateObsidianaDaisyUITheme } from './daisyui/generators/obsidiana.js';

describe('Theme Generators', () => {
  describe('DaisyUI', () => {
    it('should generate Ixiptla theme successfully', async () => {
      const theme = await generateIxiptlaDaisyUITheme();
      
      expect(theme).toBeDefined();
      expect(theme.light).toContain('@plugin "daisyui/theme"');
      expect(theme.light).toContain('name: "ixiptla"');
      expect(theme.light).toContain('color-scheme: light');
      expect(theme.dark).toContain('name: "ixiptla-dark"');
      expect(theme.dark).toContain('color-scheme: dark');
    });

    it('should generate Obsidiana theme successfully', async () => {
      const theme = await generateObsidianaDaisyUITheme();
      
      expect(theme).toBeDefined();
      expect(theme.light).toContain('@plugin "daisyui/theme"');
      expect(theme.light).toContain('name: "obsidiana"');
      expect(theme.light).toContain('color-scheme: light');
      expect(theme.dark).toContain('name: "obsidiana-dark"');
      expect(theme.dark).toContain('color-scheme: dark');
    });

    it('should generate theme using generic function', async () => {
      const ixiptlaTheme = await generateDaisyUITheme('ixiptla');
      const obsidianaTheme = await generateDaisyUITheme('obsidiana');
      
      expect(ixiptlaTheme).toBeDefined();
      expect(obsidianaTheme).toBeDefined();
      expect(ixiptlaTheme.light).toContain('name: "ixiptla"');
      expect(obsidianaTheme.light).toContain('name: "obsidiana"');
    });
  });

  describe('Design Tokens Loading', () => {
    it('should load design tokens for both brands', async () => {
      // This tests that the dynamic import works correctly
      const { loadDesignTokens } = await import('./common/utils.js');
      
      const ixiptlaTokens = await loadDesignTokens('ixiptla');
      const obsidianaTokens = await loadDesignTokens('obsidiana');
      
      expect(ixiptlaTokens).toBeDefined();
      expect(obsidianaTokens).toBeDefined();
      
      // Basic token structure verification
      expect(ixiptlaTokens).toHaveProperty('ColorPrimaryLightDefault');
      expect(obsidianaTokens).toHaveProperty('ColorPrimaryLightDefault');
    });
  });
}); 
describe('Generated output uses existing tokens', () => {
  const brands = ['ixiptla', 'obsidiana'] as const;

  it.each(brands)('%s DaisyUI theme has no undefined values', async (brand) => {
    const { generateDaisyUITheme } = await import('./common/utils.js');
    const theme = await generateDaisyUITheme(brand);
    expect(theme.light).not.toContain('undefined');
    expect(theme.dark).not.toContain('undefined');
    expect(theme.light).toContain('--border:');
  });

  it.each(brands)('%s shadcn theme has no undefined values and uses muted/border/ring tokens', async (brand) => {
    const { generateShadcnTheme } = await import('./common/utils.js');
    const { loadDesignTokens } = await import('./common/utils.js');
    const tokens = await loadDesignTokens(brand);
    const theme = await generateShadcnTheme(brand);
    expect(theme.light).not.toContain('undefined');
    expect(theme.dark).not.toContain('undefined');
    expect(theme.light).toContain(`--muted-foreground: ${tokens.ColorBaseLightMuted};`);
    expect(theme.light).toContain(`--border: ${tokens.ColorBorderLightDefault};`);
    expect(theme.dark).toContain(`--ring: ${tokens.ColorRingDarkDefault};`);
    expect(theme.light).toContain(`--primary-foreground: ${tokens.ColorPrimaryLightContent};`);
  });

  it.each(brands)('%s MUI theme has every palette value defined', async (brand) => {
    const mui = await import('./mui/generators/index.js');
    const generate = brand === 'ixiptla' ? mui.generateIxiptlaMUITheme : mui.generateObsidianaMUITheme;
    const theme = await generate();
    expect(JSON.stringify(theme)).not.toContain('undefined');
    (['light', 'dark'] as const).forEach((mode) => {
      const palette = theme[mode].palette as Record<string, Record<string, string>>;
      expect(palette.primary.contrastText).toBeDefined();
      expect(palette.text.secondary).toBeDefined();
      expect(palette.divider).toBeDefined();
    });
  });

  it('converts rem radius tokens to MUI pixel numbers', async () => {
    const { remToPx } = await import('./common/utils.js');
    expect(remToPx('0rem')).toBe(0);
    expect(remToPx('0.5rem')).toBe(8);
    expect(remToPx('4px')).toBe(4);
  });
});
