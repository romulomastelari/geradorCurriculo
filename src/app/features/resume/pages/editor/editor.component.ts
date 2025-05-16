import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSave,
  faEye,
  faArrowLeft,
  faPlus,
  faTrash,
  faGraduationCap,
  faBriefcase,
  faLanguage,
  faCertificate,
  faLightbulb,
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faGlobe,
  faChevronDown,
  faChevronUp,
  faGripLines
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { ResumeService } from '../../../../core/services/resume.service';
import {
  Resume,
  ResumeContent,
  EducationItem,
  ExperienceItem,
  SkillItem,
  LanguageItem,
  CertificationItem
} from '../../../../core/models/resume.model';
import { Observable, Subscription, of } from 'rxjs';
import { switchMap, tap, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    FontAwesomeModule
  ],
  template: `
    <div class="editor-container">
      <div class="editor-header">
        <button class="btn-back" routerLink="/dashboard">
          <fa-icon [icon]="faArrowLeft"></fa-icon>
          {{ 'EDITOR.BACK' | translate }}
        </button>

        <h1>{{ isEditMode ? ('EDITOR.EDIT_RESUME' | translate) : ('EDITOR.CREATE_RESUME' | translate) }}</h1>

        <div class="editor-actions">
          <button class="btn-preview" [disabled]="!resumeForm.valid" (click)="previewResume()">
            <fa-icon [icon]="faEye"></fa-icon>
            {{ 'EDITOR.PREVIEW' | translate }}
          </button>

          <button class="btn-save" [disabled]="!resumeForm.valid || !resumeForm.dirty" (click)="saveResume()">
            <fa-icon [icon]="faSave"></fa-icon>
            {{ 'EDITOR.SAVE' | translate }}
          </button>
        </div>
      </div>

      <!-- Progress indicator -->
      <div class="progress-container">
        <div class="progress-label">
          {{ 'EDITOR.COMPLETION' | translate }}: {{ completionPercentage }}%
        </div>
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="completionPercentage"></div>
        </div>
      </div>

      <form [formGroup]="resumeForm" class="resume-form">
        <!-- Basic Info Section -->
        <div class="form-section card">
          <div class="section-header" (click)="toggleSection('basicInfo')">
            <h2>{{ 'EDITOR.BASIC_INFO' | translate }}</h2>
            <fa-icon [icon]="expandedSections.basicInfo ? faChevronUp : faChevronDown"></fa-icon>
          </div>

          <div class="section-content" [class.expanded]="expandedSections.basicInfo">
            <div class="form-group">
              <label for="title">{{ 'EDITOR.RESUME_TITLE' | translate }}</label>
              <input type="text" id="title" formControlName="title" placeholder="{{ 'EDITOR.RESUME_TITLE_PLACEHOLDER' | translate }}">
              <div *ngIf="resumeForm.get('title')?.invalid && resumeForm.get('title')?.touched" class="error-message">
                {{ 'EDITOR.TITLE_REQUIRED' | translate }}
              </div>
            </div>

            <div class="form-group">
              <label for="templateId">{{ 'EDITOR.TEMPLATE' | translate }}</label>
              <select id="templateId" formControlName="templateId">
                <option value="template1">{{ 'EDITOR.TEMPLATE_1' | translate }}</option>
                <option value="template2">{{ 'EDITOR.TEMPLATE_2' | translate }}</option>
                <option value="template3">{{ 'EDITOR.TEMPLATE_3' | translate }}</option>
              </select>
            </div>
          </div>
        </div>

        <div formGroupName="content">
          <!-- Personal Info Section -->
          <div class="form-section card">
            <div class="section-header" (click)="toggleSection('personalInfo')">
              <h2>
                <fa-icon [icon]="faUser"></fa-icon>
                {{ 'EDITOR.PERSONAL_INFO' | translate }}
              </h2>
              <fa-icon [icon]="expandedSections.personalInfo ? faChevronUp : faChevronDown"></fa-icon>
            </div>

            <div class="section-content" [class.expanded]="expandedSections.personalInfo" formGroupName="personalInfo">
              <!-- Photo upload -->
              <div class="photo-upload-container">
                <div class="photo-preview" [class.has-photo]="photoPreviewUrl">
                  <img *ngIf="photoPreviewUrl" [src]="photoPreviewUrl" alt="Profile photo">
                  <div *ngIf="!photoPreviewUrl" class="photo-placeholder">
                    <fa-icon [icon]="faUser"></fa-icon>
                  </div>
                </div>
                <div class="photo-upload-controls">
                  <label for="photo-upload" class="btn-upload">
                    {{ 'EDITOR.UPLOAD_PHOTO' | translate }}
                  </label>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    (change)="onPhotoSelected($event)"
                    style="display: none;">
                </div>
              </div>

              <!-- Name fields -->
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">{{ 'EDITOR.FIRST_NAME' | translate }}</label>
                  <input type="text" id="firstName" formControlName="firstName" placeholder="{{ 'EDITOR.FIRST_NAME_PLACEHOLDER' | translate }}">
                  <div *ngIf="personalInfoForm.get('firstName')?.invalid && personalInfoForm.get('firstName')?.touched" class="error-message">
                    {{ 'EDITOR.FIRST_NAME_REQUIRED' | translate }}
                  </div>
                </div>

                <div class="form-group">
                  <label for="lastName">{{ 'EDITOR.LAST_NAME' | translate }}</label>
                  <input type="text" id="lastName" formControlName="lastName" placeholder="{{ 'EDITOR.LAST_NAME_PLACEHOLDER' | translate }}">
                  <div *ngIf="personalInfoForm.get('lastName')?.invalid && personalInfoForm.get('lastName')?.touched" class="error-message">
                    {{ 'EDITOR.LAST_NAME_REQUIRED' | translate }}
                  </div>
                </div>
              </div>

              <!-- Contact information -->
              <div class="form-row">
                <div class="form-group">
                  <label for="email">
                    <fa-icon [icon]="faEnvelope"></fa-icon>
                    {{ 'EDITOR.EMAIL' | translate }}
                  </label>
                  <input type="email" id="email" formControlName="email" placeholder="{{ 'EDITOR.EMAIL_PLACEHOLDER' | translate }}">
                  <div *ngIf="personalInfoForm.get('email')?.invalid && personalInfoForm.get('email')?.touched" class="error-message">
                    <span *ngIf="personalInfoForm.get('email')?.errors?.['required']">
                      {{ 'EDITOR.EMAIL_REQUIRED' | translate }}
                    </span>
                    <span *ngIf="personalInfoForm.get('email')?.errors?.['email']">
                      {{ 'EDITOR.EMAIL_INVALID' | translate }}
                    </span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="phone">
                    <fa-icon [icon]="faPhone"></fa-icon>
                    {{ 'EDITOR.PHONE' | translate }}
                  </label>
                  <input type="tel" id="phone" formControlName="phone" placeholder="{{ 'EDITOR.PHONE_PLACEHOLDER' | translate }}">
                </div>
              </div>

              <!-- Address fields -->
              <div class="form-row">
                <div class="form-group">
                  <label for="address">
                    <fa-icon [icon]="faMapMarkerAlt"></fa-icon>
                    {{ 'EDITOR.ADDRESS' | translate }}
                  </label>
                  <input type="text" id="address" formControlName="address" placeholder="{{ 'EDITOR.ADDRESS_PLACEHOLDER' | translate }}">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="city">{{ 'EDITOR.CITY' | translate }}</label>
                  <input type="text" id="city" formControlName="city" placeholder="{{ 'EDITOR.CITY_PLACEHOLDER' | translate }}">
                </div>

                <div class="form-group">
                  <label for="state">{{ 'EDITOR.STATE' | translate }}</label>
                  <input type="text" id="state" formControlName="state" placeholder="{{ 'EDITOR.STATE_PLACEHOLDER' | translate }}">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="zipCode">{{ 'EDITOR.ZIP_CODE' | translate }}</label>
                  <input type="text" id="zipCode" formControlName="zipCode" placeholder="{{ 'EDITOR.ZIP_CODE_PLACEHOLDER' | translate }}">
                </div>

                <div class="form-group">
                  <label for="country">{{ 'EDITOR.COUNTRY' | translate }}</label>
                  <input type="text" id="country" formControlName="country" placeholder="{{ 'EDITOR.COUNTRY_PLACEHOLDER' | translate }}">
                </div>
              </div>

              <!-- Professional information -->
              <div class="form-group">
                <label for="jobTitle">{{ 'EDITOR.JOB_TITLE' | translate }}</label>
                <input type="text" id="jobTitle" formControlName="title" placeholder="{{ 'EDITOR.JOB_TITLE_PLACEHOLDER' | translate }}">
              </div>

              <div class="form-group">
                <label for="summary">{{ 'EDITOR.SUMMARY' | translate }}</label>
                <textarea
                  id="summary"
                  formControlName="summary"
                  rows="4"
                  placeholder="{{ 'EDITOR.SUMMARY_PLACEHOLDER' | translate }}"></textarea>
                <div class="field-tip">{{ 'EDITOR.SUMMARY_TIP' | translate }}</div>
              </div>

              <!-- Online presence -->
              <div class="form-row">
                <div class="form-group">
                  <label for="website">
                    <fa-icon [icon]="faGlobe"></fa-icon>
                    {{ 'EDITOR.WEBSITE' | translate }}
                  </label>
                  <input type="url" id="website" formControlName="website" placeholder="{{ 'EDITOR.WEBSITE_PLACEHOLDER' | translate }}">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="linkedin">
                    <fa-icon [icon]="faLinkedin"></fa-icon>
                    {{ 'EDITOR.LINKEDIN' | translate }}
                  </label>
                  <input type="url" id="linkedin" formControlName="linkedin" placeholder="{{ 'EDITOR.LINKEDIN_PLACEHOLDER' | translate }}">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="github">
                    <fa-icon [icon]="faGithub"></fa-icon>
                    {{ 'EDITOR.GITHUB' | translate }}
                  </label>
                  <input type="url" id="github" formControlName="github" placeholder="{{ 'EDITOR.GITHUB_PLACEHOLDER' | translate }}">
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="twitter">
                    <fa-icon [icon]="faTwitter"></fa-icon>
                    {{ 'EDITOR.TWITTER' | translate }}
                  </label>
                  <input type="url" id="twitter" formControlName="twitter" placeholder="{{ 'EDITOR.TWITTER_PLACEHOLDER' | translate }}">
                </div>
              </div>
            </div>
          </div>

          <!-- Education Section -->
          <div class="form-section card">
            <div class="section-header" (click)="toggleSection('education')">
              <h2>
                <fa-icon [icon]="faGraduationCap"></fa-icon>
                {{ 'EDITOR.EDUCATION' | translate }}
              </h2>
              <fa-icon [icon]="expandedSections.education ? faChevronUp : faChevronDown"></fa-icon>
            </div>

            <div class="section-content" [class.expanded]="expandedSections.education">
              <div class="array-items" formArrayName="education">
                <div *ngFor="let educationGroup of educationArray.controls; let i = index" [formGroupName]="i" class="array-item">
                  <div class="item-header">
                    <div class="drag-handle">
                      <fa-icon [icon]="faGripLines"></fa-icon>
                    </div>
                    <h3>{{ educationGroup.get('institution')?.value || 'EDITOR.NEW_EDUCATION' | translate }}</h3>
                    <button type="button" class="btn-remove" (click)="removeEducation(i)">
                      <fa-icon [icon]="faTrash"></fa-icon>
                    </button>
                  </div>

                  <div class="form-group">
                    <label for="institution-{{i}}">{{ 'EDITOR.INSTITUTION' | translate }}</label>
                    <input type="text" [id]="'institution-'+i" formControlName="institution" placeholder="{{ 'EDITOR.INSTITUTION_PLACEHOLDER' | translate }}">
                    <div *ngIf="educationGroup.get('institution')?.invalid && educationGroup.get('institution')?.touched" class="error-message">
                      {{ 'EDITOR.INSTITUTION_REQUIRED' | translate }}
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="degree-{{i}}">{{ 'EDITOR.DEGREE' | translate }}</label>
                    <input type="text" [id]="'degree-'+i" formControlName="degree" placeholder="{{ 'EDITOR.DEGREE_PLACEHOLDER' | translate }}">
                    <div *ngIf="educationGroup.get('degree')?.invalid && educationGroup.get('degree')?.touched" class="error-message">
                      {{ 'EDITOR.DEGREE_REQUIRED' | translate }}
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="field-{{i}}">{{ 'EDITOR.FIELD' | translate }}</label>
                    <input type="text" [id]="'field-'+i" formControlName="field" placeholder="{{ 'EDITOR.FIELD_PLACEHOLDER' | translate }}">
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="startDate-{{i}}">{{ 'EDITOR.START_DATE' | translate }}</label>
                      <input type="date" [id]="'startDate-'+i" formControlName="startDate">
                    </div>

                    <div class="form-group" *ngIf="!educationGroup.get('isCurrentlyStudying')?.value">
                      <label for="endDate-{{i}}">{{ 'EDITOR.END_DATE' | translate }}</label>
                      <input type="date" [id]="'endDate-'+i" formControlName="endDate">
                    </div>
                  </div>

                  <div class="form-group checkbox-group">
                    <input type="checkbox" [id]="'isCurrentlyStudying-'+i" formControlName="isCurrentlyStudying">
                    <label for="isCurrentlyStudying-{{i}}">{{ 'EDITOR.CURRENTLY_STUDYING' | translate }}</label>
                  </div>

                  <div class="form-group">
                    <label for="location-{{i}}">{{ 'EDITOR.LOCATION' | translate }}</label>
                    <input type="text" [id]="'location-'+i" formControlName="location" placeholder="{{ 'EDITOR.LOCATION_PLACEHOLDER' | translate }}">
                  </div>

                  <div class="form-group">
                    <label for="description-{{i}}">{{ 'EDITOR.DESCRIPTION' | translate }}</label>
                    <textarea [id]="'description-'+i" formControlName="description" rows="3" placeholder="{{ 'EDITOR.EDUCATION_DESCRIPTION_PLACEHOLDER' | translate }}"></textarea>
                  </div>

                  <div class="form-group">
                    <label for="gpa-{{i}}">{{ 'EDITOR.GPA' | translate }}</label>
                    <input type="text" [id]="'gpa-'+i" formControlName="gpa" placeholder="{{ 'EDITOR.GPA_PLACEHOLDER' | translate }}">
                  </div>
                </div>
              </div>

              <button type="button" class="btn-add" (click)="addEducation()">
                <fa-icon [icon]="faPlus"></fa-icon>
                {{ 'EDITOR.ADD_EDUCATION' | translate }}
              </button>
            </div>
          </div>

          <!-- Experience Section -->
          <div class="form-section card">
            <div class="section-header" (click)="toggleSection('experience')">
              <h2>
                <fa-icon [icon]="faBriefcase"></fa-icon>
                {{ 'EDITOR.EXPERIENCE' | translate }}
              </h2>
              <fa-icon [icon]="expandedSections.experience ? faChevronUp : faChevronDown"></fa-icon>
            </div>

            <div class="section-content" [class.expanded]="expandedSections.experience">
              <div class="array-items" formArrayName="experience">
                <div *ngFor="let experienceGroup of experienceArray.controls; let i = index" [formGroupName]="i" class="array-item">
                  <div class="item-header">
                    <div class="drag-handle">
                      <fa-icon [icon]="faGripLines"></fa-icon>
                    </div>
                    <h3>{{ experienceGroup.get('company')?.value || 'EDITOR.NEW_EXPERIENCE' | translate }}</h3>
                    <button type="button" class="btn-remove" (click)="removeExperience(i)">
                      <fa-icon [icon]="faTrash"></fa-icon>
                    </button>
                  </div>

                  <div class="form-group">
                    <label for="company-{{i}}">{{ 'EDITOR.COMPANY' | translate }}</label>
                    <input type="text" [id]="'company-'+i" formControlName="company" placeholder="{{ 'EDITOR.COMPANY_PLACEHOLDER' | translate }}">
                    <div *ngIf="experienceGroup.get('company')?.invalid && experienceGroup.get('company')?.touched" class="error-message">
                      {{ 'EDITOR.COMPANY_REQUIRED' | translate }}
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="position-{{i}}">{{ 'EDITOR.POSITION' | translate }}</label>
                    <input type="text" [id]="'position-'+i" formControlName="position" placeholder="{{ 'EDITOR.POSITION_PLACEHOLDER' | translate }}">
                    <div *ngIf="experienceGroup.get('position')?.invalid && experienceGroup.get('position')?.touched" class="error-message">
                      {{ 'EDITOR.POSITION_REQUIRED' | translate }}
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="expStartDate-{{i}}">{{ 'EDITOR.START_DATE' | translate }}</label>
                      <input type="date" [id]="'expStartDate-'+i" formControlName="startDate">
                    </div>

                    <div class="form-group" *ngIf="!experienceGroup.get('isCurrentlyWorking')?.value">
                      <label for="expEndDate-{{i}}">{{ 'EDITOR.END_DATE' | translate }}</label>
                      <input type="date" [id]="'expEndDate-'+i" formControlName="endDate">
                    </div>
                  </div>

                  <div class="form-group checkbox-group">
                    <input type="checkbox" [id]="'isCurrentlyWorking-'+i" formControlName="isCurrentlyWorking">
                    <label for="isCurrentlyWorking-{{i}}">{{ 'EDITOR.CURRENTLY_WORKING' | translate }}</label>
                  </div>

                  <div class="form-group">
                    <label for="expLocation-{{i}}">{{ 'EDITOR.LOCATION' | translate }}</label>
                    <input type="text" [id]="'expLocation-'+i" formControlName="location" placeholder="{{ 'EDITOR.LOCATION_PLACEHOLDER' | translate }}">
                  </div>

                  <div class="form-group">
                    <label for="expDescription-{{i}}">{{ 'EDITOR.DESCRIPTION' | translate }}</label>
                    <textarea
                      [id]="'expDescription-'+i"
                      formControlName="description"
                      rows="4"
                      placeholder="{{ 'EDITOR.EXPERIENCE_DESCRIPTION_PLACEHOLDER' | translate }}"></textarea>
                    <div class="field-tip">{{ 'EDITOR.EXPERIENCE_DESCRIPTION_TIP' | translate }}</div>
                  </div>
                </div>
              </div>

              <button type="button" class="btn-add" (click)="addExperience()">
                <fa-icon [icon]="faPlus"></fa-icon>
                {{ 'EDITOR.ADD_EXPERIENCE' | translate }}
              </button>
            </div>
          </div>

          <!-- Skills Section -->
          <div class="form-section card">
            <div class="section-header" (click)="toggleSection('skills')">
              <h2>
                <fa-icon [icon]="faLightbulb"></fa-icon>
                {{ 'EDITOR.SKILLS' | translate }}
              </h2>
              <fa-icon [icon]="expandedSections.skills ? faChevronUp : faChevronDown"></fa-icon>
            </div>

            <div class="section-content" [class.expanded]="expandedSections.skills">
              <div class="array-items" formArrayName="skills">
                <div *ngFor="let skillGroup of skillsArray.controls; let i = index" [formGroupName]="i" class="array-item skill-item">
                  <div class="item-header">
                    <div class="drag-handle">
                      <fa-icon [icon]="faGripLines"></fa-icon>
                    </div>
                    <h3>{{ skillGroup.get('name')?.value || 'EDITOR.NEW_SKILL' | translate }}</h3>
                    <button type="button" class="btn-remove" (click)="removeSkill(i)">
                      <fa-icon [icon]="faTrash"></fa-icon>
                    </button>
                  </div>

                  <div class="form-row">
                    <div class="form-group skill-name">
                      <label for="skillName-{{i}}">{{ 'EDITOR.SKILL_NAME' | translate }}</label>
                      <input type="text" [id]="'skillName-'+i" formControlName="name" placeholder="{{ 'EDITOR.SKILL_NAME_PLACEHOLDER' | translate }}">
                      <div *ngIf="skillGroup.get('name')?.invalid && skillGroup.get('name')?.touched" class="error-message">
                        {{ 'EDITOR.SKILL_NAME_REQUIRED' | translate }}
                      </div>
                    </div>

                    <div class="form-group skill-level">
                      <label for="skillLevel-{{i}}">{{ 'EDITOR.SKILL_LEVEL' | translate }}</label>
                      <select [id]="'skillLevel-'+i" formControlName="level">
                        <option value="beginner">{{ 'EDITOR.SKILL_LEVEL_BEGINNER' | translate }}</option>
                        <option value="intermediate">{{ 'EDITOR.SKILL_LEVEL_INTERMEDIATE' | translate }}</option>
                        <option value="advanced">{{ 'EDITOR.SKILL_LEVEL_ADVANCED' | translate }}</option>
                        <option value="expert">{{ 'EDITOR.SKILL_LEVEL_EXPERT' | translate }}</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="yearsOfExperience-{{i}}">{{ 'EDITOR.YEARS_OF_EXPERIENCE' | translate }}</label>
                    <input type="number" [id]="'yearsOfExperience-'+i" formControlName="yearsOfExperience" min="0" max="50">
                  </div>
                </div>
              </div>

              <button type="button" class="btn-add" (click)="addSkill()">
                <fa-icon [icon]="faPlus"></fa-icon>
                {{ 'EDITOR.ADD_SKILL' | translate }}
              </button>
            </div>
          </div>

          <!-- Languages Section -->
          <div class="form-section card">
            <div class="section-header" (click)="toggleSection('languages')">
              <h2>
                <fa-icon [icon]="faLanguage"></fa-icon>
                {{ 'EDITOR.LANGUAGES' | translate }}
              </h2>
              <fa-icon [icon]="expandedSections.languages ? faChevronUp : faChevronDown"></fa-icon>
            </div>

            <div class="section-content" [class.expanded]="expandedSections.languages">
              <div class="array-items" formArrayName="languages">
                <div *ngFor="let languageGroup of languagesArray.controls; let i = index" [formGroupName]="i" class="array-item language-item">
                  <div class="item-header">
                    <div class="drag-handle">
                      <fa-icon [icon]="faGripLines"></fa-icon>
                    </div>
                    <h3>{{ languageGroup.get('name')?.value || 'EDITOR.NEW_LANGUAGE' | translate }}</h3>
                    <button type="button" class="btn-remove" (click)="removeLanguage(i)">
                      <fa-icon [icon]="faTrash"></fa-icon>
                    </button>
                  </div>

                  <div class="form-row">
                    <div class="form-group language-name">
                      <label for="languageName-{{i}}">{{ 'EDITOR.LANGUAGE_NAME' | translate }}</label>
                      <input type="text" [id]="'languageName-'+i" formControlName="name" placeholder="{{ 'EDITOR.LANGUAGE_NAME_PLACEHOLDER' | translate }}">
                      <div *ngIf="languageGroup.get('name')?.invalid && languageGroup.get('name')?.touched" class="error-message">
                        {{ 'EDITOR.LANGUAGE_NAME_REQUIRED' | translate }}
                      </div>
                    </div>

                    <div class="form-group language-proficiency">
                      <label for="languageProficiency-{{i}}">{{ 'EDITOR.LANGUAGE_PROFICIENCY' | translate }}</label>
                      <select [id]="'languageProficiency-'+i" formControlName="proficiency">
                        <option value="elementary">{{ 'EDITOR.LANGUAGE_PROFICIENCY_ELEMENTARY' | translate }}</option>
                        <option value="limited_working">{{ 'EDITOR.LANGUAGE_PROFICIENCY_LIMITED' | translate }}</option>
                        <option value="professional_working">{{ 'EDITOR.LANGUAGE_PROFICIENCY_PROFESSIONAL' | translate }}</option>
                        <option value="full_professional">{{ 'EDITOR.LANGUAGE_PROFICIENCY_FULL' | translate }}</option>
                        <option value="native">{{ 'EDITOR.LANGUAGE_PROFICIENCY_NATIVE' | translate }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button type="button" class="btn-add" (click)="addLanguage()">
                <fa-icon [icon]="faPlus"></fa-icon>
                {{ 'EDITOR.ADD_LANGUAGE' | translate }}
              </button>
            </div>
          </div>

          <!-- Certifications Section -->
          <div class="form-section card">
            <div class="section-header" (click)="toggleSection('certifications')">
              <h2>
                <fa-icon [icon]="faCertificate"></fa-icon>
                {{ 'EDITOR.CERTIFICATIONS' | translate }}
              </h2>
              <fa-icon [icon]="expandedSections.certifications ? faChevronUp : faChevronDown"></fa-icon>
            </div>

            <div class="section-content" [class.expanded]="expandedSections.certifications">
              <div class="array-items" formArrayName="certifications">
                <div *ngFor="let certificationGroup of certificationsArray.controls; let i = index" [formGroupName]="i" class="array-item">
                  <div class="item-header">
                    <div class="drag-handle">
                      <fa-icon [icon]="faGripLines"></fa-icon>
                    </div>
                    <h3>{{ certificationGroup.get('name')?.value || 'EDITOR.NEW_CERTIFICATION' | translate }}</h3>
                    <button type="button" class="btn-remove" (click)="removeCertification(i)">
                      <fa-icon [icon]="faTrash"></fa-icon>
                    </button>
                  </div>

                  <div class="form-group">
                    <label for="certificationName-{{i}}">{{ 'EDITOR.CERTIFICATION_NAME' | translate }}</label>
                    <input type="text" [id]="'certificationName-'+i" formControlName="name" placeholder="{{ 'EDITOR.CERTIFICATION_NAME_PLACEHOLDER' | translate }}">
                    <div *ngIf="certificationGroup.get('name')?.invalid && certificationGroup.get('name')?.touched" class="error-message">
                      {{ 'EDITOR.CERTIFICATION_NAME_REQUIRED' | translate }}
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="certificationIssuer-{{i}}">{{ 'EDITOR.CERTIFICATION_ISSUER' | translate }}</label>
                    <input type="text" [id]="'certificationIssuer-'+i" formControlName="issuer" placeholder="{{ 'EDITOR.CERTIFICATION_ISSUER_PLACEHOLDER' | translate }}">
                    <div *ngIf="certificationGroup.get('issuer')?.invalid && certificationGroup.get('issuer')?.touched" class="error-message">
                      {{ 'EDITOR.CERTIFICATION_ISSUER_REQUIRED' | translate }}
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="certificationIssueDate-{{i}}">{{ 'EDITOR.CERTIFICATION_ISSUE_DATE' | translate }}</label>
                      <input type="date" [id]="'certificationIssueDate-'+i" formControlName="issueDate">
                    </div>

                    <div class="form-group">
                      <label for="certificationExpirationDate-{{i}}">{{ 'EDITOR.CERTIFICATION_EXPIRATION_DATE' | translate }}</label>
                      <input type="date" [id]="'certificationExpirationDate-'+i" formControlName="expirationDate">
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="certificationCredentialId-{{i}}">{{ 'EDITOR.CERTIFICATION_CREDENTIAL_ID' | translate }}</label>
                    <input type="text" [id]="'certificationCredentialId-'+i" formControlName="credentialId" placeholder="{{ 'EDITOR.CERTIFICATION_CREDENTIAL_ID_PLACEHOLDER' | translate }}">
                  </div>

                  <div class="form-group">
                    <label for="certificationUrl-{{i}}">{{ 'EDITOR.CERTIFICATION_URL' | translate }}</label>
                    <input type="url" [id]="'certificationUrl-'+i" formControlName="url" placeholder="{{ 'EDITOR.CERTIFICATION_URL_PLACEHOLDER' | translate }}">
                  </div>
                </div>
              </div>

              <button type="button" class="btn-add" (click)="addCertification()">
                <fa-icon [icon]="faPlus"></fa-icon>
                {{ 'EDITOR.ADD_CERTIFICATION' | translate }}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div *ngIf="saveSuccess" class="success-message">
        {{ 'EDITOR.SAVE_SUCCESS' | translate }}
      </div>
    </div>
  `,
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent implements OnInit, OnDestroy {
  // Icons
  faSave = faSave;
  faEye = faEye;
  faArrowLeft = faArrowLeft;
  faPlus = faPlus;
  faTrash = faTrash;
  faGraduationCap = faGraduationCap;
  faBriefcase = faBriefcase;
  faLanguage = faLanguage;
  faCertificate = faCertificate;
  faLightbulb = faLightbulb;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faMapMarkerAlt = faMapMarkerAlt;
  faGlobe = faGlobe;
  faLinkedin = faLinkedin;
  faGithub = faGithub;
  faTwitter = faTwitter;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faGripLines = faGripLines;

  resumeForm!: FormGroup;
  isEditMode = false;
  currentResumeId: string | null = null;
  saveSuccess = false;
  photoPreviewUrl: string | null = null;
  completionPercentage = 0;

  // Track expanded/collapsed sections
  expandedSections = {
    basicInfo: true,
    personalInfo: true,
    education: true,
    experience: true,
    skills: false,
    languages: false,
    certifications: false,
    additionalInfo: false
  };

  private subscription = new Subscription();
  private autoSaveSubscription = new Subscription();

  get personalInfoForm(): FormGroup {
    return this.resumeForm.get('content')?.get('personalInfo') as FormGroup;
  }

  get educationArray(): FormArray {
    return this.resumeForm.get('content')?.get('education') as FormArray;
  }

  get experienceArray(): FormArray {
    return this.resumeForm.get('content')?.get('experience') as FormArray;
  }

  get skillsArray(): FormArray {
    return this.resumeForm.get('content')?.get('skills') as FormArray;
  }

  get languagesArray(): FormArray {
    return this.resumeForm.get('content')?.get('languages') as FormArray;
  }

  get certificationsArray(): FormArray {
    return this.resumeForm.get('content')?.get('certifications') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.subscription.add(
      this.route.paramMap.pipe(
        switchMap(params => {
          const id = params.get('id');
          if (id) {
            this.isEditMode = true;
            this.currentResumeId = id;
            return this.resumeService.getResumeById(id);
          }
          return of(null);
        })
      ).subscribe(resume => {
        if (resume) {
          this.populateForm(resume);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.resumeForm = this.fb.group({
      title: ['', Validators.required],
      templateId: ['template1', Validators.required],
      content: this.fb.group({
        personalInfo: this.fb.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          phone: [''],
          address: [''],
          city: [''],
          state: [''],
          zipCode: [''],
          country: [''],
          title: [''],
          summary: [''],
          website: [''],
          linkedin: [''],
          github: [''],
          twitter: [''],
          photoUrl: ['']
        }),
        education: this.fb.array([]),
        experience: this.fb.array([]),
        skills: this.fb.array([]),
        languages: this.fb.array([]),
        certifications: this.fb.array([]),
        projects: this.fb.array([]),
        references: this.fb.array([]),
        customSections: this.fb.array([])
      })
    });

    // Setup auto-save
    this.setupAutoSave();

    // Add default empty items to arrays
    this.addEducation();
    this.addExperience();
    this.addSkill();
    this.addLanguage();
    this.addCertification();
  }

  /**
   * Setup auto-save functionality
   */
  setupAutoSave(): void {
    this.autoSaveSubscription = this.resumeForm.valueChanges
      .pipe(debounceTime(3000)) // Wait for 3 seconds of inactivity
      .subscribe(() => {
        if (this.resumeForm.valid && this.resumeForm.dirty) {
          this.saveResume(true); // true for auto-save
        }

        // Update completion percentage
        this.updateCompletionPercentage();
      });
  }

  /**
   * Update the completion percentage based on filled fields
   */
  updateCompletionPercentage(): void {
    const requiredFields = [
      this.personalInfoForm.get('firstName'),
      this.personalInfoForm.get('lastName'),
      this.personalInfoForm.get('email')
    ];

    const optionalFields = [
      this.personalInfoForm.get('phone'),
      this.personalInfoForm.get('address'),
      this.personalInfoForm.get('city'),
      this.personalInfoForm.get('title'),
      this.personalInfoForm.get('summary')
    ];

    // Count filled required fields
    const filledRequired = requiredFields.filter(field => field?.value).length;
    const requiredPercentage = (filledRequired / requiredFields.length) * 60; // Required fields are 60% of total

    // Count filled optional fields
    const filledOptional = optionalFields.filter(field => field?.value).length;
    const optionalPercentage = (filledOptional / optionalFields.length) * 40; // Optional fields are 40% of total

    // Calculate total percentage
    this.completionPercentage = Math.round(requiredPercentage + optionalPercentage);
  }

  populateForm(resume: Resume): void {
    // Clear existing arrays
    while (this.educationArray.length) {
      this.educationArray.removeAt(0);
    }
    while (this.experienceArray.length) {
      this.experienceArray.removeAt(0);
    }
    while (this.skillsArray.length) {
      this.skillsArray.removeAt(0);
    }
    while (this.languagesArray.length) {
      this.languagesArray.removeAt(0);
    }
    while (this.certificationsArray.length) {
      this.certificationsArray.removeAt(0);
    }

    // Patch basic values
    this.resumeForm.patchValue({
      title: resume.title,
      templateId: resume.templateId,
      content: {
        personalInfo: resume.content.personalInfo
      }
    });

    // Populate arrays
    if (resume.content.education && resume.content.education.length) {
      resume.content.education.forEach(item => this.addEducation(item));
    } else {
      this.addEducation();
    }

    if (resume.content.experience && resume.content.experience.length) {
      resume.content.experience.forEach(item => this.addExperience(item));
    } else {
      this.addExperience();
    }

    if (resume.content.skills && resume.content.skills.length) {
      resume.content.skills.forEach(item => this.addSkill(item));
    } else {
      this.addSkill();
    }

    if (resume.content.languages && resume.content.languages.length) {
      resume.content.languages.forEach(item => this.addLanguage(item));
    } else {
      this.addLanguage();
    }

    if (resume.content.certifications && resume.content.certifications.length) {
      resume.content.certifications.forEach(item => this.addCertification(item));
    } else {
      this.addCertification();
    }

    // If there's a photo URL, set the preview
    if (resume.content.personalInfo.photoUrl) {
      this.photoPreviewUrl = resume.content.personalInfo.photoUrl;
    }
  }

  /**
   * Toggle section expansion
   */
  toggleSection(section: string): void {
    this.expandedSections[section as keyof typeof this.expandedSections] =
      !this.expandedSections[section as keyof typeof this.expandedSections];
  }

  /**
   * Add a new education item
   */
  addEducation(item?: Partial<EducationItem>): void {
    const educationGroup = this.fb.group({
      id: [item?.id || this.generateId()],
      institution: [item?.institution || '', Validators.required],
      degree: [item?.degree || '', Validators.required],
      field: [item?.field || ''],
      startDate: [item?.startDate || null],
      endDate: [item?.endDate || null],
      isCurrentlyStudying: [item?.isCurrentlyStudying || false],
      location: [item?.location || ''],
      description: [item?.description || ''],
      gpa: [item?.gpa || '']
    });

    this.educationArray.push(educationGroup);
  }

  /**
   * Remove an education item
   */
  removeEducation(index: number): void {
    this.educationArray.removeAt(index);
  }

  /**
   * Add a new experience item
   */
  addExperience(item?: Partial<ExperienceItem>): void {
    const experienceGroup = this.fb.group({
      id: [item?.id || this.generateId()],
      company: [item?.company || '', Validators.required],
      position: [item?.position || '', Validators.required],
      startDate: [item?.startDate || null],
      endDate: [item?.endDate || null],
      isCurrentlyWorking: [item?.isCurrentlyWorking || false],
      location: [item?.location || ''],
      description: [item?.description || ''],
      achievements: [item?.achievements || []]
    });

    this.experienceArray.push(experienceGroup);
  }

  /**
   * Remove an experience item
   */
  removeExperience(index: number): void {
    this.experienceArray.removeAt(index);
  }

  /**
   * Add a new skill item
   */
  addSkill(item?: Partial<SkillItem>): void {
    const skillGroup = this.fb.group({
      id: [item?.id || this.generateId()],
      name: [item?.name || '', Validators.required],
      level: [item?.level || 'intermediate'],
      yearsOfExperience: [item?.yearsOfExperience || null]
    });

    this.skillsArray.push(skillGroup);
  }

  /**
   * Remove a skill item
   */
  removeSkill(index: number): void {
    this.skillsArray.removeAt(index);
  }

  /**
   * Add a new language item
   */
  addLanguage(item?: Partial<LanguageItem>): void {
    const languageGroup = this.fb.group({
      id: [item?.id || this.generateId()],
      name: [item?.name || '', Validators.required],
      proficiency: [item?.proficiency || 'professional_working']
    });

    this.languagesArray.push(languageGroup);
  }

  /**
   * Remove a language item
   */
  removeLanguage(index: number): void {
    this.languagesArray.removeAt(index);
  }

  /**
   * Add a new certification item
   */
  addCertification(item?: Partial<CertificationItem>): void {
    const certificationGroup = this.fb.group({
      id: [item?.id || this.generateId()],
      name: [item?.name || '', Validators.required],
      issuer: [item?.issuer || '', Validators.required],
      issueDate: [item?.issueDate || null],
      expirationDate: [item?.expirationDate || null],
      credentialId: [item?.credentialId || ''],
      url: [item?.url || '']
    });

    this.certificationsArray.push(certificationGroup);
  }

  /**
   * Remove a certification item
   */
  removeCertification(index: number): void {
    this.certificationsArray.removeAt(index);
  }

  /**
   * Handle file upload for photo
   */
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.photoPreviewUrl = reader.result as string;
        this.personalInfoForm.patchValue({
          photoUrl: reader.result
        });
      };

      reader.readAsDataURL(file);
    }
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  saveResume(isAutoSave = false): void {
    if (this.resumeForm.valid) {
      const formValue = this.resumeForm.value;

      if (this.isEditMode && this.currentResumeId) {
        this.resumeService.updateResume(this.currentResumeId, formValue).subscribe(
          resume => {
            if (!isAutoSave) {
              this.handleSaveSuccess();
            }
            this.resumeForm.markAsPristine();
          }
        );
      } else {
        this.resumeService.createResume(formValue).subscribe(
          resume => {
            if (!isAutoSave) {
              this.handleSaveSuccess();
            }
            // Update URL to edit mode
            this.isEditMode = true;
            this.currentResumeId = resume.id;
            this.router.navigate(['/dashboard/edit', resume.id], { replaceUrl: true });
            this.resumeForm.markAsPristine();
          }
        );
      }
    }
  }

  previewResume(): void {
    if (this.resumeForm.valid) {
      if (this.isEditMode && this.currentResumeId) {
        // Save first, then preview
        this.resumeService.updateResume(this.currentResumeId, this.resumeForm.value).subscribe(
          resume => this.router.navigate(['/dashboard/preview', this.currentResumeId])
        );
      } else {
        // Create first, then preview
        this.resumeService.createResume(this.resumeForm.value).subscribe(
          resume => this.router.navigate(['/dashboard/preview', resume.id])
        );
      }
    }
  }

  private handleSaveSuccess(): void {
    this.saveSuccess = true;
    this.resumeForm.markAsPristine();

    // Hide success message after 3 seconds
    setTimeout(() => {
      this.saveSuccess = false;
    }, 3000);
  }
}
