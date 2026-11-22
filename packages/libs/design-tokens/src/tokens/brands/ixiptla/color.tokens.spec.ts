/* eslint-disable @typescript-eslint/no-explicit-any */
import colorTokens from './color.tokens.json' assert { type: 'json' };

type ColorToken = {
  value: string;
  type: string;
};

type ColorTheme = {
  [key: string]: ColorToken;
};

type ColorCategory = {
  light: ColorTheme;
  dark: ColorTheme;
};

type ColorTokens = {
  color: {
    [key: string]: ColorCategory;
  };
};

const tokens = colorTokens as unknown as ColorTokens;

describe('Ixiptla Color Tokens', () => {
  describe('Structure', () => {
    it('should have a valid color object structure', () => {
      expect(tokens).toHaveProperty('color');
      expect(typeof tokens.color).toBe('object');
    });

    it('should have all required color categories', () => {
      const requiredCategories = ['base', 'primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'];
      requiredCategories.forEach(category => {
        expect(tokens.color).toHaveProperty(category);
      });
    });

    it('should have light and dark variants for each category', () => {
      Object.keys(tokens.color).forEach(category => {
        expect(tokens.color[category]).toHaveProperty('light');
        expect(tokens.color[category]).toHaveProperty('dark');
      });
    });
  });

  describe('Color Values', () => {
    const validateOKLCHColor = (value: string) => {
      const oklchRegex = /^oklch\(\d+\.?\d*% \d+\.?\d* \d+\.?\d*\)$/;
      expect(value).toMatch(oklchRegex);

      const matches = value.match(/oklch\((\d+\.?\d*)% (\d+\.?\d*) (\d+\.?\d*)\)/);
      if (!matches) throw new Error('Invalid OKLCH format');

      const [, lightness, chroma, hue] = matches.map(Number);

      expect(lightness).toBeGreaterThanOrEqual(0);
      expect(lightness).toBeLessThanOrEqual(100);
      expect(chroma).toBeGreaterThanOrEqual(0);
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThanOrEqual(360);
    };

    it('should have valid OKLCH color values', () => {
      const validateColorObject = (obj: any) => {
        if (obj.value && obj.type === 'color') {
          validateOKLCHColor(obj.value);
        }
        Object.values(obj).forEach(value => {
          if (typeof value === 'object' && value !== null) {
            validateColorObject(value);
          }
        });
      };

      validateColorObject(tokens.color);
    });
  });

  describe('Token Properties', () => {
    const validateTokenProperties = (token: ColorToken) => {
      expect(token).toHaveProperty('value');
      expect(token).toHaveProperty('type');
      expect(token.type).toBe('color');
    };

    it('should have required properties for each token', () => {
      const validateObject = (obj: any) => {
        if (obj.value && obj.type) {
          validateTokenProperties(obj);
        }
        Object.values(obj).forEach(value => {
          if (typeof value === 'object' && value !== null) {
            validateObject(value);
          }
        });
      };

      validateObject(tokens.color);
    });
  });

  describe('Theme Consistency', () => {
    it('should have matching properties in light and dark themes', () => {
      Object.keys(tokens.color).forEach(category => {
        const lightKeys = Object.keys(tokens.color[category].light);
        const darkKeys = Object.keys(tokens.color[category].dark);
        expect(lightKeys).toEqual(darkKeys);
      });
    });

    it('should have consistent token structure across themes', () => {
      Object.keys(tokens.color).forEach(category => {
        const lightTokens = tokens.color[category].light;
        const darkTokens = tokens.color[category].dark;

        Object.keys(lightTokens).forEach(tokenKey => {
          expect(lightTokens[tokenKey].type).toBe(darkTokens[tokenKey].type);
        });
      });
    });
  });

  describe('Color Token Naming', () => {
    it('should follow consistent naming patterns', () => {
      const validateNaming = (obj: any, path: string[] = []) => {
        Object.entries(obj).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            if ('value' in value && 'type' in value) {
              expect(key).toMatch(/^(default|content|text|muted|subtle|lowest|low|container|high|highest|bright|\d+)$/);
            }
            validateNaming(value, [...path, key]);
          }
        });
      };

      validateNaming(tokens.color);
    });
  });

  describe('Color Token Completeness', () => {
    it('should have all required color variants', () => {
      const requiredVariants = ['default', 'content'];
      const baseVariants = ['100', '200', '300', 'content', 'muted'];

      const roles = ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'];
      const textRoles = roles.filter((role) => role !== 'neutral');

      expect(tokens.color.border.light).toHaveProperty('default');
      expect(tokens.color.border.dark).toHaveProperty('default');
      expect(tokens.color.ring.light).toHaveProperty('default');
      expect(tokens.color.ring.dark).toHaveProperty('default');

      Object.entries(tokens.color).forEach(([category, themes]) => {
        if (!roles.includes(category) && category !== 'base') return;
        if (category === 'base') {
          expect(Object.keys(themes.light)).toEqual(expect.arrayContaining(baseVariants));
          expect(Object.keys(themes.dark)).toEqual(expect.arrayContaining(baseVariants));
        } else {
          if (textRoles.includes(category)) {
            expect(themes.light).toHaveProperty('text');
            expect(themes.dark).toHaveProperty('text');
          }
          expect(Object.keys(themes.light)).toEqual(expect.arrayContaining(requiredVariants));
          expect(Object.keys(themes.dark)).toEqual(expect.arrayContaining(requiredVariants));
        }
      });
    });
  });

  describe('Ixiptla Brand Specific Validations', () => {
    const hue = (value: string) => Number(value.match(/oklch\([\d.]+% [\d.]+ ([\d.]+)\)/)?.[1]);
    const lightness = (value: string) => Number(value.match(/oklch\(([\d.]+)%/)?.[1]);

    it('should keep the Obsidian Codex terracotta primary hue', () => {
      expect(hue(tokens.color.primary.light.default.value)).toBeGreaterThanOrEqual(35);
      expect(hue(tokens.color.primary.light.default.value)).toBeLessThanOrEqual(45);
      expect(hue(tokens.color.primary.dark.default.value)).toBeGreaterThanOrEqual(35);
      expect(hue(tokens.color.primary.dark.default.value)).toBeLessThanOrEqual(45);
    });

    it('should default to a near-black canvas in dark and warm paper in light', () => {
      expect(lightness(tokens.color.base.dark['100'].value)).toBeLessThan(20);
      expect(lightness(tokens.color.base.light['100'].value)).toBeGreaterThan(95);
      expect(lightness(tokens.color.base.light.content.value)).toBeLessThan(50);
      expect(lightness(tokens.color.base.dark.content.value)).toBeGreaterThan(50);
    });

    it('should provide the tonal surface ladder in both modes', () => {
      const ladder = ['lowest', 'low', 'container', 'high', 'highest', 'bright'];
      expect(Object.keys(tokens.color.surface.light)).toEqual(ladder);
      expect(Object.keys(tokens.color.surface.dark)).toEqual(ladder);
    });

    it('should maintain semantic hues for status colors', () => {
      (['light', 'dark'] as const).forEach((mode) => {
        expect(hue(tokens.color.info[mode].default.value)).toBe(220);
        expect(hue(tokens.color.success[mode].default.value)).toBe(140);
        expect(hue(tokens.color.warning[mode].default.value)).toBe(80);
        expect(hue(tokens.color.error[mode].default.value)).toBeGreaterThanOrEqual(25);
        expect(hue(tokens.color.error[mode].default.value)).toBeLessThanOrEqual(30);
      });
    });
  });
});
