import { inject } from '@angular/core';
import { Router, UrlTree, CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResumeService } from '../services/resume.service';
import { UserService } from '../services/user.service';

export const resumeCountGuard: CanActivateFn = () => {
  const resumeService = inject(ResumeService);
  const userService = inject(UserService);
  const router = inject(Router);

  console.log('[DEBUG_LOG] ResumeCountGuard - Checking if user can create a resume');

  // If user is premium, allow creating unlimited resumes
  if (userService.isPremiumUser()) {
    console.log('[DEBUG_LOG] ResumeCountGuard - User is premium, allowing resume creation');
    return true;
  }

  console.log('[DEBUG_LOG] ResumeCountGuard - User is not premium, checking resume count');

  // For free users, check if they already have a resume
  return resumeService.getUserResumes().pipe(
    map(resumes => {
      console.log('[DEBUG_LOG] ResumeCountGuard - User has', resumes.length, 'resumes');

      // Free users can only create 1 resume
      if (resumes.length < 1) {
        console.log('[DEBUG_LOG] ResumeCountGuard - User has no resumes, allowing creation');
        return true;
      } else {
        console.log('[DEBUG_LOG] ResumeCountGuard - User already has a resume, redirecting to checkout');
        // Redirect to checkout page if they try to create more
        return router.parseUrl('/checkout');
      }
    })
  );
};
