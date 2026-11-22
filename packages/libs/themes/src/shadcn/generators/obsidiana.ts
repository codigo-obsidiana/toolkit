/**
 * Shadcn/UI Theme Generator for Obsidiana Brand
 */

import { generateShadcnTheme } from '../../common/utils.js';

export interface ObsidianaShadcnTheme {
  light: string;
  dark: string;
}

/**
 * Generates Shadcn/UI CSS custom properties for Obsidiana brand
 */
export async function generateObsidianaShadcnTheme(): Promise<ObsidianaShadcnTheme> {
  return await generateShadcnTheme('obsidiana');
}
