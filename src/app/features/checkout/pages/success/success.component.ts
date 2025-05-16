import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle, faFileAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FontAwesomeModule
  ],
  template: `
    <div class="success-container">
      <div class="success-icon">
        <fa-icon [icon]="faCheckCircle"></fa-icon>
      </div>

      <h1>{{ 'CHECKOUT.SUCCESS.TITLE' | translate }}</h1>

      <p class="success-message">
        {{ 'CHECKOUT.SUCCESS.MESSAGE' | translate }}
      </p>

      <div class="action-buttons">
        <a routerLink="/dashboard" class="btn-primary">
          {{ 'CHECKOUT.SUCCESS.GO_TO_DASHBOARD' | translate }}
        </a>

        <a routerLink="/dashboard/create" class="btn-secondary">
          <fa-icon [icon]="faFileAlt"></fa-icon>
          {{ 'CHECKOUT.SUCCESS.CREATE_RESUME' | translate }}
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./success.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuccessComponent {
  faCheckCircle = faCheckCircle;
  faFileAlt = faFileAlt;
}
