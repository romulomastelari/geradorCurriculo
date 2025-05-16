import { Injectable, signal } from '@angular/core';

export type ThemeType = 'light' | 'dark' | 'black';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'resume-builder-theme';
  private readonly themeSignal = signal<ThemeType>('light');

  constructor() {
    this.initTheme();
  }

  get currentTheme() {
    return this.themeSignal();
  }

  get theme() {
    return this.themeSignal.asReadonly();
  }

  setTheme(theme: ThemeType): void {
    this.themeSignal.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as ThemeType | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    this.themeSignal.set(initialTheme);
    this.applyTheme(initialTheme);
  }

  private applyTheme(theme: ThemeType): void {
    // Remove any previous theme classes
    document.body.classList.remove('light-theme', 'dark-theme', 'black-theme');

    // Add the new theme class
    document.body.classList.add(`${theme}-theme`);
  }

  private getThemeVariables(theme: ThemeType): Record<string, string> {
    switch (theme) {
      case 'light':
        return {
          '--primary': '#3f51b5',
          '--primary-light': '#c5cae9',
          '--primary-dark': '#303f9f',
          '--accent': '#ff4081',
          '--text-primary': '#212121',
          '--text-secondary': '#757575',
          '--surface': '#ffffff',
          '--background': '#f5f5f5',
          '--error': '#f44336',
          '--success': '#4caf50',
          '--warning': '#ff9800',
          '--info': '#2196f3',
          '--divider': '#e0e0e0'
        };
      case 'dark':
        return {
          '--primary': '#7986cb',
          '--primary-light': '#9fa8da',
          '--primary-dark': '#5c6bc0',
          '--accent': '#ff80ab',
          '--text-primary': '#ffffff',
          '--text-secondary': '#b0bec5',
          '--surface': '#424242',
          '--background': '#303030',
          '--error': '#ef9a9a',
          '--success': '#a5d6a7',
          '--warning': '#ffcc80',
          '--info': '#90caf9',
          '--divider': '#616161'
        };
      case 'black':
        return {
          '--primary': '#bb86fc',
          '--primary-light': '#e2b9ff',
          '--primary-dark': '#8858c8',
          '--accent': '#03dac6',
          '--text-primary': '#ffffff',
          '--text-secondary': '#a0a0a0',
          '--surface': '#121212',
          '--background': '#000000',
          '--error': '#cf6679',
          '--success': '#01a299',
          '--warning': '#ff9e00',
          '--info': '#56c8d8',
          '--divider': '#2d2d2d'
        };
      default:
        return this.getThemeVariables('light');
    }
  }
}
