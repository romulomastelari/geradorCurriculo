import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cancel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FontAwesomeModule
  ],
  template: `
    <div class="cancel-container">
      <div class="cancel-icon">
        <fa-icon [icon]="faTimes"></fa-icon>
      </div>

      <h1>{{ 'CHECKOUT.CANCEL.TITLE' | translate }}</h1>

      <p class="cancel-message">
        {{ 'CHECKOUT.CANCEL.MESSAGE' | translate }}
      </p>

      <div class="action-buttons">
        <a routerLink="/checkout" class="btn-primary">
          {{ 'CHECKOUT.CANCEL.TRY_AGAIN' | translate }}
        </a>

        <a routerLink="/dashboard" class="btn-secondary">
          <fa-icon [icon]="faArrowLeft"></fa-icon>
          {{ 'CHECKOUT.CANCEL.BACK_TO_DASHBOARD' | translate }}
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./cancel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CancelComponent {
  faTimes = faTimes;
  faArrowLeft = faArrowLeft;
}
