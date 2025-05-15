import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'geradorDeCurriculo';

  constructor(
    private translate: TranslateService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    // Define o idioma padrão e carrega as traduções
    this.translate.setDefaultLang('pt');
    this.translate.use('pt');
  }
}
