/**
 * Shadcn/UI Theme Generator for Ixiptla Brand
 */

import { generateShadcnTheme } from '../../common/utils.js';

export interface IxiptlaShadcnTheme {
  light: string;
  dark: string;
}

/**
 * Generates Shadcn/UI CSS custom properties for Ixiptla brand
 */
export async function generateIxiptlaShadcnTheme(): Promise<IxiptlaShadcnTheme> {
  return await generateShadcnTheme('ixiptla');
}
