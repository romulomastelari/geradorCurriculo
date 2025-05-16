import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Resume } from '../models/resume.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private mockResumes: Resume[] = [];

  constructor(private userService: UserService) {
    // In a real app, we would load resumes from an API or localStorage
    this.loadResumesFromStorage();
  }

  /**
   * Get all resumes for the current user
   */
  getUserResumes(): Observable<Resume[]> {
    return of(this.mockResumes.filter(resume =>
      resume.userId === this.userService.getUser().id
    ));
  }

  /**
   * Get a specific resume by ID
   */
  getResumeById(id: string): Observable<Resume | undefined> {
    return of(this.mockResumes.find(resume => resume.id === id));
  }

  /**
   * Create a new resume
   */
  createResume(resume: Omit<Resume, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Observable<Resume> {
    const newResume: Resume = {
      ...resume,
      id: this.generateId(),
      userId: this.userService.getUser().id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockResumes.push(newResume);
    this.saveResumesToStorage();

    return of(newResume);
  }

  /**
   * Update an existing resume
   */
  updateResume(id: string, resumeUpdate: Partial<Resume>): Observable<Resume | undefined> {
    const index = this.mockResumes.findIndex(r => r.id === id);

    if (index === -1) {
      return of(undefined);
    }

    const updatedResume: Resume = {
      ...this.mockResumes[index],
      ...resumeUpdate,
      updatedAt: new Date()
    };

    this.mockResumes[index] = updatedResume;
    this.saveResumesToStorage();

    return of(updatedResume);
  }

  /**
   * Delete a resume
   */
  deleteResume(id: string): Observable<boolean> {
    const initialLength = this.mockResumes.length;
    this.mockResumes = this.mockResumes.filter(resume => resume.id !== id);

    if (initialLength !== this.mockResumes.length) {
      this.saveResumesToStorage();
      return of(true);
    }

    return of(false);
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  /**
   * Load resumes from localStorage
   */
  private loadResumesFromStorage(): void {
    const storedResumes = localStorage.getItem('userResumes');

    if (storedResumes) {
      try {
        const parsedResumes = JSON.parse(storedResumes);

        // Convert string dates back to Date objects
        this.mockResumes = parsedResumes.map((resume: any) => ({
          ...resume,
          createdAt: new Date(resume.createdAt),
          updatedAt: new Date(resume.updatedAt)
        }));
      } catch (e) {
        console.error('Error parsing stored resumes', e);
        this.mockResumes = [];
      }
    }
  }

  /**
   * Save resumes to localStorage
   */
  private saveResumesToStorage(): void {
    localStorage.setItem('userResumes', JSON.stringify(this.mockResumes));
  }
}
