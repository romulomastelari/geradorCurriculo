import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faDownload, faArrowLeft, faPrint } from '@fortawesome/free-solid-svg-icons';
import { ResumeService } from '../../../../core/services/resume.service';
import { Resume } from '../../../../core/models/resume.model';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FontAwesomeModule
  ],
  template: `
    <div class="preview-container">
      <div class="preview-header">
        <button class="btn-back" routerLink="/dashboard">
          <fa-icon [icon]="faArrowLeft"></fa-icon>
          {{ 'PREVIEW.BACK' | translate }}
        </button>

        <h1>{{ 'PREVIEW.TITLE' | translate }}</h1>

        <div class="preview-actions">
          <button class="btn-edit" *ngIf="resume" [routerLink]="['/dashboard/edit', resume.id]">
            <fa-icon [icon]="faEdit"></fa-icon>
            {{ 'PREVIEW.EDIT' | translate }}
          </button>

          <button class="btn-print" (click)="printResume()">
            <fa-icon [icon]="faPrint"></fa-icon>
            {{ 'PREVIEW.PRINT' | translate }}
          </button>

          <button class="btn-download" (click)="downloadPdf()">
            <fa-icon [icon]="faDownload"></fa-icon>
            {{ 'PREVIEW.DOWNLOAD' | translate }}
          </button>
        </div>
      </div>

      <div class="resume-preview" *ngIf="resume">
        <!-- This would be replaced with a dynamic template based on the selected template -->
        <div class="resume-template" [ngClass]="resume.templateId">
          <div class="resume-header">
            <h1>{{ resume.content.personalInfo.firstName }} {{ resume.content.personalInfo.lastName }}</h1>
            <p *ngIf="resume.content.personalInfo.title">{{ resume.content.personalInfo.title }}</p>
          </div>

          <div class="resume-contact">
            <p>{{ resume.content.personalInfo.email }}</p>
            <p *ngIf="resume.content.personalInfo.phone">{{ resume.content.personalInfo.phone }}</p>
          </div>

          <div class="resume-summary" *ngIf="resume.content.personalInfo.summary">
            <h2>{{ 'PREVIEW.SUMMARY' | translate }}</h2>
            <p>{{ resume.content.personalInfo.summary }}</p>
          </div>

          <!-- More sections would be added here for education, experience, skills, etc. -->
        </div>
      </div>

      <div class="loading-state" *ngIf="!resume">
        {{ 'PREVIEW.LOADING' | translate }}
      </div>
    </div>
  `,
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit, OnDestroy {
  faEdit = faEdit;
  faDownload = faDownload;
  faArrowLeft = faArrowLeft;
  faPrint = faPrint;

  resume: Resume | null = null;
  private subscription = new Subscription();

  constructor(
    private resumeService: ResumeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.route.paramMap.pipe(
        switchMap(params => {
          const id = params.get('id');
          if (id) {
            return this.resumeService.getResumeById(id);
          }
          return [];
        })
      ).subscribe(resume => {
        if (resume) {
          this.resume = resume;
        } else {
          // Resume not found, redirect to dashboard
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  printResume(): void {
    window.print();
  }

  downloadPdf(): void {
    if (!this.resume) {
      console.error('No resume to download');
      return;
    }

    // Show loading indicator or message
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'pdf-loading-message';
    loadingMessage.textContent = 'Generating PDF...';
    loadingMessage.style.position = 'fixed';
    loadingMessage.style.top = '50%';
    loadingMessage.style.left = '50%';
    loadingMessage.style.transform = 'translate(-50%, -50%)';
    loadingMessage.style.padding = '20px';
    loadingMessage.style.background = 'rgba(0, 0, 0, 0.7)';
    loadingMessage.style.color = 'white';
    loadingMessage.style.borderRadius = '5px';
    loadingMessage.style.zIndex = '9999';
    document.body.appendChild(loadingMessage);

    // Get the resume element
    const resumeElement = document.querySelector('.resume-template') as HTMLElement;
    if (!resumeElement) {
      console.error('Resume element not found');
      document.body.removeChild(loadingMessage);
      return;
    }

    // Set a timeout to allow the UI to update before generating the PDF
    setTimeout(() => {
      // Generate PDF from the resume element
      html2canvas(resumeElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for images
        logging: false, // Disable logging
        allowTaint: true // Allow tainted canvas
      }).then(canvas => {
        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculate the aspect ratio to fit the content properly
        const canvasRatio = canvas.height / canvas.width;
        const pageRatio = pdfHeight / pdfWidth;

        let renderWidth = pdfWidth;
        let renderHeight = pdfWidth * canvasRatio;

        // If the content is taller than the page, scale it down
        if (renderHeight > pdfHeight) {
          renderHeight = pdfHeight;
          renderWidth = pdfHeight / canvasRatio;
        }

        // Center the content on the page
        const xOffset = (pdfWidth - renderWidth) / 2;

        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', xOffset, 0, renderWidth, renderHeight);

        // Save the PDF
        pdf.save(`${this.resume?.title || 'resume'}.pdf`);

        // Remove loading message
        document.body.removeChild(loadingMessage);
      }).catch(error => {
        console.error('Error generating PDF:', error);
        document.body.removeChild(loadingMessage);
        alert('Failed to generate PDF. Please try again.');
      });
    }, 100);
  }
}
