/**
 * Common utilities for theme generation
 */

import type { BrandName } from './types.js';

/**
 * Dynamically imports design tokens for a specific brand
 * Handles both development (relative paths) and production (package scope) contexts
 */
export async function loadDesignTokens(brand: BrandName) {
  try {
    // Try production package scope first
    return await import(`@codigo-obsidiana/design-tokens/${brand}`);
  } catch (error) {
    try {
      // Fallback to relative path for development/testing
      return await import(`../../../design-tokens/dist/${brand}/index.js`);
    } catch (fallbackError) {
      throw new Error(`Failed to load design tokens for brand: ${brand}. Tried package scope and relative path. Errors: ${error}, ${fallbackError}`);
    }
  }
}

/**
 * Converts a rem or px token value to a pixel number (16px root), as MUI's shape.borderRadius expects
 */
export function remToPx(value: string, rootFontSize = 16): number {
  const amount = Number.parseFloat(value);
  if (Number.isNaN(amount)) return 0;
  return value.trim().endsWith('rem') ? amount * rootFontSize : amount;
}

/**
 * Generic function to generate DaisyUI theme CSS for any brand
 */
export async function generateDaisyUITheme(brand: BrandName) {
  const tokens = await loadDesignTokens(brand);
  
  const lightTheme = `
@plugin "daisyui/theme" {
  name: "${brand}";
  color-scheme: light;

  --color-base-100: ${tokens.ColorBaseLight100};
  --color-base-200: ${tokens.ColorBaseLight200};
  --color-base-300: ${tokens.ColorBaseLight300};
  --color-base-content: ${tokens.ColorBaseLightContent};

  --color-primary: ${tokens.ColorPrimaryLightDefault};
  --color-primary-content: ${tokens.ColorPrimaryLightContent};

  --color-secondary: ${tokens.ColorSecondaryLightDefault};
  --color-secondary-content: ${tokens.ColorSecondaryLightContent};

  --color-accent: ${tokens.ColorAccentLightDefault};
  --color-accent-content: ${tokens.ColorAccentLightContent};

  --color-neutral: ${tokens.ColorNeutralLightDefault};
  --color-neutral-content: ${tokens.ColorNeutralLightContent};

  --color-info: ${tokens.ColorInfoLightDefault};
  --color-success: ${tokens.ColorSuccessLightDefault};
  --color-warning: ${tokens.ColorWarningLightDefault};
  --color-error: ${tokens.ColorErrorLightDefault};
  --color-info-content: ${tokens.ColorInfoLightContent};
  --color-success-content: ${tokens.ColorSuccessLightContent};
  --color-warning-content: ${tokens.ColorWarningLightContent};
  --color-error-content: ${tokens.ColorErrorLightContent};

  --radius-selector: ${tokens.DesignRadiusSelector};
  --radius-field: ${tokens.DesignRadiusField};
  --radius-box: ${tokens.DesignRadiusBox};
  --size-selector: ${tokens.DesignSizeSelector};
  --size-field: ${tokens.DesignSizeField};
  --border: ${tokens.DesignBorderWidth};
  --depth: ${tokens.DesignEffectDepth};
  --noise: ${tokens.DesignEffectNoise};
}`;

  const darkTheme = `
@plugin "daisyui/theme" {
  name: "${brand}-dark";
  color-scheme: dark;

  --color-base-100: ${tokens.ColorBaseDark100};
  --color-base-200: ${tokens.ColorBaseDark200};
  --color-base-300: ${tokens.ColorBaseDark300};
  --color-base-content: ${tokens.ColorBaseDarkContent};

  --color-primary: ${tokens.ColorPrimaryDarkDefault};
  --color-primary-content: ${tokens.ColorPrimaryDarkContent};

  --color-secondary: ${tokens.ColorSecondaryDarkDefault};
  --color-secondary-content: ${tokens.ColorSecondaryDarkContent};

  --color-accent: ${tokens.ColorAccentDarkDefault};
  --color-accent-content: ${tokens.ColorAccentDarkContent};

  --color-neutral: ${tokens.ColorNeutralDarkDefault};
  --color-neutral-content: ${tokens.ColorNeutralDarkContent};

  --color-info: ${tokens.ColorInfoDarkDefault};
  --color-success: ${tokens.ColorSuccessDarkDefault};
  --color-warning: ${tokens.ColorWarningDarkDefault};
  --color-error: ${tokens.ColorErrorDarkDefault};
  --color-info-content: ${tokens.ColorInfoDarkContent};
  --color-success-content: ${tokens.ColorSuccessDarkContent};
  --color-warning-content: ${tokens.ColorWarningDarkContent};
  --color-error-content: ${tokens.ColorErrorDarkContent};

  --radius-selector: ${tokens.DesignRadiusSelector};
  --radius-field: ${tokens.DesignRadiusField};
  --radius-box: ${tokens.DesignRadiusBox};
  --size-selector: ${tokens.DesignSizeSelector};
  --size-field: ${tokens.DesignSizeField};
  --border: ${tokens.DesignBorderWidth};
  --depth: ${tokens.DesignEffectDepth};
  --noise: ${tokens.DesignEffectNoise};
}`;

  return {
    light: lightTheme,
    dark: darkTheme
  };
} 

/**
 * Generic function to generate Shadcn/UI CSS custom properties for any brand
 */
export async function generateShadcnTheme(brand: BrandName) {
  const tokens = await loadDesignTokens(brand);

  const variables = (mode: 'Light' | 'Dark') => {
    const t = (name: string) => tokens[`Color${name.replace('{mode}', mode)}`];
    return `
    --background: ${t('Base{mode}100')};
    --foreground: ${t('Base{mode}Content')};
    --card: ${t('Base{mode}100')};
    --card-foreground: ${t('Base{mode}Content')};
    --popover: ${t('Base{mode}100')};
    --popover-foreground: ${t('Base{mode}Content')};
    --primary: ${t('Primary{mode}Default')};
    --primary-foreground: ${t('Primary{mode}Content')};
    --secondary: ${t('Secondary{mode}Default')};
    --secondary-foreground: ${t('Secondary{mode}Content')};
    --muted: ${t('Base{mode}200')};
    --muted-foreground: ${t('Base{mode}Muted')};
    --accent: ${t('Accent{mode}Default')};
    --accent-foreground: ${t('Accent{mode}Content')};
    --destructive: ${t('Error{mode}Default')};
    --destructive-foreground: ${t('Error{mode}Content')};
    --border: ${t('Border{mode}Default')};
    --input: ${t('Border{mode}Default')};
    --ring: ${t('Ring{mode}Default')};`;
  };

  return {
    light: `
  :root {${variables('Light')}
    --radius: ${tokens.DesignRadiusField};
  }`,
    dark: `
  .dark {${variables('Dark')}
  }`,
  };
}
