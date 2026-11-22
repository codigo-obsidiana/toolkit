/**
 * Material-UI Theme Generator for Obsidiana Brand
 */

import type { ThemeMode } from '../../common/types.js';
import { loadDesignTokens, remToPx } from '../../common/utils.js';

export interface ObsidianaMUITheme {
  light: Record<string, unknown>; // MUI theme object
  dark: Record<string, unknown>;  // MUI theme object
}

/**
 * Generates Material-UI theme object for Obsidiana brand
 */
export async function generateObsidianaMUITheme(): Promise<ObsidianaMUITheme> {
  const tokens = await loadDesignTokens('obsidiana');
  
  const baseTheme = {
    typography: {
      fontFamily: tokens.FontFamilyBase.join(','),
      h1: { fontFamily: tokens.FontFamilyHeaders.join(',') },
      h2: { fontFamily: tokens.FontFamilyHeaders.join(',') },
      h3: { fontFamily: tokens.FontFamilyHeaders.join(',') },
      h4: { fontFamily: tokens.FontFamilyHeaders.join(',') },
      h5: { fontFamily: tokens.FontFamilyHeaders.join(',') },
      h6: { fontFamily: tokens.FontFamilyHeaders.join(',') },
    },
    shape: {
      borderRadius: remToPx(tokens.DesignRadiusField),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: tokens.DesignRadiusBox,
            textTransform: 'none' as const,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: tokens.DesignRadiusField,
            },
          },
        },
      },
    },
  };

  const lightTheme = {
    ...baseTheme,
    palette: {
      mode: 'light' as const,
      primary: {
        main: tokens.ColorPrimaryLightDefault,
        contrastText: tokens.ColorPrimaryLightContent,
      },
      secondary: {
        main: tokens.ColorSecondaryLightDefault,
        contrastText: tokens.ColorSecondaryLightContent,
      },
      error: {
        main: tokens.ColorErrorLightDefault,
        contrastText: tokens.ColorErrorLightContent,
      },
      warning: {
        main: tokens.ColorWarningLightDefault,
        contrastText: tokens.ColorWarningLightContent,
      },
      info: {
        main: tokens.ColorInfoLightDefault,
        contrastText: tokens.ColorInfoLightContent,
      },
      success: {
        main: tokens.ColorSuccessLightDefault,
        contrastText: tokens.ColorSuccessLightContent,
      },
      background: {
        default: tokens.ColorBaseLight100,
        paper: tokens.ColorBaseLight200,
      },
      text: {
        primary: tokens.ColorBaseLightContent,
        secondary: tokens.ColorBaseLightMuted,
      },
      divider: tokens.ColorBorderLightDefault,
    },
  };

  const darkTheme = {
    ...baseTheme,
    palette: {
      mode: 'dark' as const,
      primary: {
        main: tokens.ColorPrimaryDarkDefault,
        contrastText: tokens.ColorPrimaryDarkContent,
      },
      secondary: {
        main: tokens.ColorSecondaryDarkDefault,
        contrastText: tokens.ColorSecondaryDarkContent,
      },
      error: {
        main: tokens.ColorErrorDarkDefault,
        contrastText: tokens.ColorErrorDarkContent,
      },
      warning: {
        main: tokens.ColorWarningDarkDefault,
        contrastText: tokens.ColorWarningDarkContent,
      },
      info: {
        main: tokens.ColorInfoDarkDefault,
        contrastText: tokens.ColorInfoDarkContent,
      },
      success: {
        main: tokens.ColorSuccessDarkDefault,
        contrastText: tokens.ColorSuccessDarkContent,
      },
      background: {
        default: tokens.ColorBaseDark100,
        paper: tokens.ColorBaseDark200,
      },
      text: {
        primary: tokens.ColorBaseDarkContent,
        secondary: tokens.ColorBaseDarkMuted,
      },
      divider: tokens.ColorBorderDarkDefault,
    },
  };

  return {
    light: lightTheme,
    dark: darkTheme
  };
}

/**
 * Get specific theme by mode
 */
export async function getObsidianaMUITheme(mode: ThemeMode = 'light'): Promise<Record<string, unknown>> {
  const themes = await generateObsidianaMUITheme();
  return themes[mode];
} 