/* eslint-disable @typescript-eslint/no-explicit-any */
import colorTokens from './color.tokens.json' assert { type: 'json' };
import designTokens from './design.tokens.json' assert { type: 'json' };
import fontTokens from './font.tokens.json' assert { type: 'json' };

describe('Ixiptla Brand Token Integration', () => {
  describe('Token Structure Consistency', () => {
    it('should have all required token categories', () => {
      expect(colorTokens).toHaveProperty('color');
      expect(designTokens).toHaveProperty('design');
      expect(fontTokens).toHaveProperty('font');
    });

    it('should follow consistent token property structure', () => {
      const validateTokenStructure = (obj: any, path: string[] = []) => {
        Object.entries(obj).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            if ('value' in value && 'type' in value) {
              // This is a token
              expect(value).toHaveProperty('value');
              expect(value).toHaveProperty('type');
              expect(typeof (value as any).type).toBe('string');
            } else {
              // This is a token group, recurse
              validateTokenStructure(value, [...path, key]);
            }
          }
        });
      };

      validateTokenStructure(colorTokens);
      validateTokenStructure(designTokens);
      validateTokenStructure(fontTokens);
    });
  });

  describe('Brand Consistency Across Token Types', () => {
    it('should keep square corners across every radius slot', () => {
      const designRadius = designTokens.design.radius;

      expect(designRadius.box.value).toBe('0rem');
      expect(designRadius.field.value).toBe('0rem');
      expect(designRadius.selector.value).toBe('0rem');
    });

    it('should use consistent measurement units', () => {
      const designRadius = designTokens.design.radius;
      const designSize = designTokens.design.size;
      
      // All radius values should use rem
      expect(designRadius.box.value).toMatch(/rem$/);
      expect(designRadius.field.value).toMatch(/rem$/);
      expect(designRadius.selector.value).toMatch(/rem$/);
      
      // All size values should use rem
      expect(designSize.selector.value).toMatch(/rem$/);
      expect(designSize.field.value).toMatch(/rem$/);
    });

    it('should have consistent font family fallbacks', () => {
      const fontFamily = fontTokens.font.family;
      
      // Headers should have serif fallbacks
      expect(fontFamily.headers.value).toContain('serif');
      
      // Base should have sans-serif fallbacks
      expect(fontFamily.base.value).toContain('sans-serif');
    });
  });

  describe('Theme Support Validation', () => {
    it('should have complete light and dark theme support for colors', () => {
      const colorCategories = Object.keys(colorTokens.color);
      
      colorCategories.forEach(category => {
        expect((colorTokens.color as any)[category]).toHaveProperty('light');
        expect((colorTokens.color as any)[category]).toHaveProperty('dark');
        
        const lightTheme = (colorTokens.color as any)[category].light;
        const darkTheme = (colorTokens.color as any)[category].dark;
        
        // Light and dark themes should have the same structure
        expect(Object.keys(lightTheme)).toEqual(Object.keys(darkTheme));
      });
    });

    it('should have proper contrast ratios between themes', () => {
      const lightBase = colorTokens.color.base.light;
      const darkBase = colorTokens.color.base.dark;
      
      // Light theme should have dark content
      const lightContentLightness = parseFloat(lightBase.content.value.match(/oklch\((\d+\.?\d*)%/)?.[1] || '0');
      expect(lightContentLightness).toBeLessThan(50);
      
      // Dark theme should have light content
      const darkContentLightness = parseFloat(darkBase.content.value.match(/oklch\((\d+\.?\d*)%/)?.[1] || '0');
      expect(darkContentLightness).toBeGreaterThan(50);
    });
  });

  describe('CSS Variable Mapping', () => {
    it('should match expected CSS variable names and values', () => {
      // Validate color mappings
      expect(colorTokens.color.base.light['100'].value).toBe('oklch(98.4% 0.011 76.6)');
      expect(colorTokens.color.primary.light.default.value).toBe('oklch(48.3% 0.094 42.6)');
      
      // Validate design mappings
      expect(designTokens.design.radius.box.value).toBe('0rem');
      expect(designTokens.design.radius.field.value).toBe('0rem');
      expect(designTokens.design.radius.selector.value).toBe('0rem');
      expect(designTokens.design.border.width.value).toBe('0px');
      expect(designTokens.design.effect.depth.value).toBe('0');
      
      // Validate transition mappings
      expect(designTokens.design.transition.duration.theme.value).toBe('0.3s');
      expect(designTokens.design.transition.timing.theme.value).toBe('ease-in-out');
    });
  });

  describe('Token Type Validation', () => {
    it('should have correct token types for each category', () => {
      // Color tokens should be 'color' type
      const validateColorTokens = (obj: any) => {
        Object.values(obj).forEach(value => {
          if (typeof value === 'object' && value !== null) {
            if ('type' in value) {
              expect((value as any).type).toBe('color');
            } else {
              validateColorTokens(value);
            }
          }
        });
      };
      validateColorTokens(colorTokens.color);

      // Design tokens should have appropriate types
      expect(designTokens.design.radius.box.type).toBe('borderRadius');
      expect(designTokens.design.border.width.type).toBe('borderWidth');
      expect(designTokens.design.effect.depth.type).toBe('number');
      expect(designTokens.design.transition.duration.theme.type).toBe('duration');
      expect(designTokens.design.transition.timing.theme.type).toBe('cubicBezier');

      // Font tokens should have appropriate types
      expect(fontTokens.font.family.base.type).toBe('fontFamily');
      expect(fontTokens.font.weight.headers.default.type).toBe('fontWeight');
    });
  });

  describe('Brand Identity Validation', () => {
    it('should maintain Ixiptla color scheme identity', () => {
      // Terracotta primary (light #8a4b31, dark #ffb59e) and ochre accent
      expect(colorTokens.color.primary.light.default.value).toBe('oklch(48.3% 0.094 42.6)');
      expect(colorTokens.color.primary.dark.default.value).toBe('oklch(83.7% 0.092 38)');
      expect(colorTokens.color.accent.dark.default.value).toBe('oklch(82.9% 0.143 91.4)');
    });

    it('should use brand-specific typography', () => {
      // Should use Newsreader for headers and Space Grotesk for labels
      expect(fontTokens.font.family.headers.value[0]).toBe('Newsreader');
      expect(fontTokens.font.family.label.value[0]).toBe('Space Grotesk');
      
      // Should use Inter for body text
      expect(fontTokens.font.family.base.value[0]).toBe('Inter');
      
      // Headers should be bold by default
      expect(fontTokens.font.weight.headers.default.value).toBe('700');
    });

    it('should support accessibility requirements', () => {
      // The brand is borderless by design; separation comes from the surface ladder
      expect(designTokens.design.border.width.value).toBe('0px');
      expect(colorTokens.color.surface.dark).toHaveProperty('container');

      // Transition duration should be reasonable for accessibility
      const transitionDuration = parseFloat(designTokens.design.transition.duration.theme.value);
      expect(transitionDuration).toBeLessThanOrEqual(0.5); // Max 500ms
      expect(transitionDuration).toBeGreaterThan(0); // Should have some transition
    });
  });

  describe('Token Completeness', () => {
    it('should have all semantic color categories', () => {
      const requiredColorCategories = [
        'base', 'primary', 'secondary', 'accent', 'neutral',
        'info', 'success', 'warning', 'error'
      ];
      
      requiredColorCategories.forEach(category => {
        expect(colorTokens.color).toHaveProperty(category);
      });
    });

    it('should have all design system properties', () => {
      expect(designTokens.design).toHaveProperty('radius');
      expect(designTokens.design).toHaveProperty('size');
      expect(designTokens.design).toHaveProperty('border');
      expect(designTokens.design).toHaveProperty('effect');
      expect(designTokens.design).toHaveProperty('transition');
    });

    it('should have complete typography system', () => {
      expect(fontTokens.font).toHaveProperty('family');
      expect(fontTokens.font).toHaveProperty('weight');
      
      // Should have both header and base font families
      expect(fontTokens.font.family).toHaveProperty('headers');
      expect(fontTokens.font.family).toHaveProperty('base');
      
      // Should have weight variations
      expect(fontTokens.font.weight).toHaveProperty('headers');
      expect(fontTokens.font.weight).toHaveProperty('base');
    });
  });
}); 