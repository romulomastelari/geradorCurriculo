import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faEdit, faEye, faTrash, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { ResumeService } from '../../../../core/services/resume.service';
import { UserService } from '../../../../core/services/user.service';
import { Resume } from '../../../../core/models/resume.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FontAwesomeModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>{{ 'DASHBOARD.TITLE' | translate }}</h1>
        <button class="btn-create" routerLink="create">
          <fa-icon [icon]="faPlus"></fa-icon>
          {{ 'DASHBOARD.CREATE_RESUME' | translate }}
        </button>
      </div>

      <ng-container *ngIf="resumes$ | async as resumes">
        <div *ngIf="resumes.length === 0" class="empty-state">
          <fa-icon [icon]="faFileAlt"></fa-icon>
          <h2>{{ 'DASHBOARD.NO_RESUMES' | translate }}</h2>
          <p>{{ 'DASHBOARD.NO_RESUMES_MESSAGE' | translate }}</p>
          <button class="btn-primary" routerLink="create">
            {{ 'DASHBOARD.CREATE_FIRST_RESUME' | translate }}
          </button>
        </div>

        <div *ngIf="resumes.length > 0" class="resume-list">
          <div *ngFor="let resume of resumes" class="resume-card">
          <div class="resume-info">
            <h3>{{ resume.title }}</h3>
            <p class="resume-date">{{ resume.updatedAt | date }}</p>
          </div>

          <div class="resume-actions">
            <button class="btn-icon" [routerLink]="['edit', resume.id]" title="{{ 'DASHBOARD.EDIT' | translate }}">
              <fa-icon [icon]="faEdit"></fa-icon>
            </button>

            <button class="btn-icon" [routerLink]="['preview', resume.id]" title="{{ 'DASHBOARD.PREVIEW' | translate }}">
              <fa-icon [icon]="faEye"></fa-icon>
            </button>

            <button class="btn-icon delete" (click)="deleteResume(resume.id)" title="{{ 'DASHBOARD.DELETE' | translate }}">
              <fa-icon [icon]="faTrash"></fa-icon>
            </button>
          </div>
        </div>
      </div>

      </ng-container>

      <ng-container *ngIf="resumes$ | async as resumes">
        <div *ngIf="!isPremiumUser && resumes.length === 1" class="upgrade-banner">
          <div class="upgrade-message">
            <h3>{{ 'DASHBOARD.UPGRADE.TITLE' | translate }}</h3>
            <p>{{ 'DASHBOARD.UPGRADE.MESSAGE' | translate }}</p>
          </div>
          <a routerLink="/checkout" class="btn-upgrade">
            {{ 'DASHBOARD.UPGRADE.BUTTON' | translate }}
          </a>
        </div>
      </ng-container>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  faPlus = faPlus;
  faEdit = faEdit;
  faEye = faEye;
  faTrash = faTrash;
  faFileAlt = faFileAlt;

  resumes$!: Observable<Resume[]>;
  isPremiumUser = false;

  constructor(
    private resumeService: ResumeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.resumes$ = this.resumeService.getUserResumes();
    this.isPremiumUser = this.userService.isPremiumUser();
  }

  deleteResume(id: string): void {
    if (confirm('Are you sure you want to delete this resume?')) {
      this.resumeService.deleteResume(id).subscribe(success => {
        if (success) {
          // Refresh the list
          this.resumes$ = this.resumeService.getUserResumes();
        }
      });
    }
  }
}
