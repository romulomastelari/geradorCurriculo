import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSun, faMoon, faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { ThemeService, ThemeType } from '../../theme.service';

interface ThemeOption {
  value: ThemeType;
  label: string;
  icon: any;
}

@Component({
  standalone: true,
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
  imports: [CommonModule, TranslateModule, FontAwesomeModule]
})
export class ThemeSwitcherComponent {
  themes: ThemeOption[] = [
    { value: 'light', label: 'THEME.LIGHT', icon: faSun },
    { value: 'dark', label: 'THEME.DARK', icon: faMoon },
    { value: 'black', label: 'THEME.BLACK', icon: faCircleHalfStroke }
  ];

  constructor(public themeService: ThemeService) {}

  setTheme(theme: ThemeType): void {
    this.themeService.setTheme(theme);
  }
}
