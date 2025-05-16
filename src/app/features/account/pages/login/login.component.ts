import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    FontAwesomeModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  faUser = faUser;
  faLock = faLock;
  faSignInAlt = faSignInAlt;
  faGoogle = faGoogle;
  faFacebook = faFacebook;

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      const success = this.authService.login(username, password);

      if (success) {
        console.log('[DEBUG_LOG] Login successful');
        // Navigate to the redirectUrl if it exists, otherwise to the dashboard
        const redirectUrl = this.authService.redirectUrl || '/dashboard';
        console.log('[DEBUG_LOG] Redirecting to:', redirectUrl);
        this.router.navigateByUrl(redirectUrl);
      } else {
        console.log('[DEBUG_LOG] Login failed');
        // Handle login failure (could show an error message)
      }
    }
  }

  loginWithGoogle(): void {
    console.log('[DEBUG_LOG] Login with Google');
    // Implement Google login logic here
    this.authService.loginWithSocial('google')
      .then(() => {
        const redirectUrl = this.authService.redirectUrl || '/dashboard';
        this.router.navigateByUrl(redirectUrl);
      })
      .catch(error => {
        console.log('[DEBUG_LOG] Google login failed:', error);
      });
  }

  loginWithFacebook(): void {
    console.log('[DEBUG_LOG] Login with Facebook');
    // Implement Facebook login logic here
    this.authService.loginWithSocial('facebook')
      .then(() => {
        const redirectUrl = this.authService.redirectUrl || '/dashboard';
        this.router.navigateByUrl(redirectUrl);
      })
      .catch(error => {
        console.log('[DEBUG_LOG] Facebook login failed:', error);
      });
  }
}
