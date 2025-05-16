import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faEnvelope, faLock, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    FontAwesomeModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {
  faUser = faUser;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faUserPlus = faUserPlus;
  faGoogle = faGoogle;
  faFacebook = faFacebook;

  signupForm: FormGroup;
  passwordStrength = 'weak';
  signupSuccess = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Listen for password changes to calculate strength
    this.signupForm.get('password')?.valueChanges.subscribe(password => {
      this.calculatePasswordStrength(password);
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  calculatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = 'weak';
      return;
    }

    // Calculate password strength
    let score = 0;

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Complexity checks
    if (/[A-Z]/.test(password)) score++; // Has uppercase
    if (/[a-z]/.test(password)) score++; // Has lowercase
    if (/[0-9]/.test(password)) score++; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score++; // Has special char

    // Determine strength based on score
    if (score < 3) {
      this.passwordStrength = 'weak';
    } else if (score < 5) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const { username, password, email, firstName, lastName } = this.signupForm.value;

      console.log('[DEBUG_LOG] Signing up user:', username);

      // In a real app, we would call an API to register the user
      // For now, we'll just simulate a successful registration
      this.authService.login(username, password);

      // Update user profile with email and name
      this.userService.updateUserProfile({
        email,
        firstName,
        lastName
      });

      // Show success message
      this.signupSuccess = true;

      // Navigate to dashboard after a delay
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
    }
  }

  signupWithGoogle(): void {
    console.log('[DEBUG_LOG] Signing up with Google');
    // Implement Google signup logic here
    this.authService.loginWithSocial('google')
      .then(() => {
        this.signupSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      })
      .catch(error => {
        console.log('[DEBUG_LOG] Google signup failed:', error);
      });
  }

  signupWithFacebook(): void {
    console.log('[DEBUG_LOG] Signing up with Facebook');
    // Implement Facebook signup logic here
    this.authService.loginWithSocial('facebook')
      .then(() => {
        this.signupSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      })
      .catch(error => {
        console.log('[DEBUG_LOG] Facebook signup failed:', error);
      });
  }
}
