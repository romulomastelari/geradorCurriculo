import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faEnvelope, faSave, faSignOutAlt, faCrown, faKey, faHistory, faCog } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../../core/models/user.model';
import { Order } from '../../../../core/models/order.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    FontAwesomeModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  faUser = faUser;
  faEnvelope = faEnvelope;
  faSave = faSave;
  faSignOutAlt = faSignOutAlt;
  faCrown = faCrown;
  faKey = faKey;
  faHistory = faHistory;
  faCog = faCog;

  activeTab = 'personal';
  profileForm: FormGroup;
  passwordForm: FormGroup;
  updateSuccess = false;
  user = signal<User | null>(null);
  orders: Order[] = [];
  settings = {
    emailNotifications: true,
    marketingEmails: false,
    language: 'en',
    theme: 'light'
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private translateService: TranslateService
  ) {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      email: ['', [Validators.email]],
      firstName: [''],
      lastName: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator for password matching
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {
    // Load user data
    const userData = this.userService.getUser();
    this.user.set(userData);

    // Populate form
    this.profileForm.patchValue({
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName || '',
      lastName: userData.lastName || ''
    });

    // Load orders
    this.loadOrders();

    // Load settings
    this.loadSettings();
  }

  loadOrders(): void {
    // In a real app, this would be a service call
    this.orders = [
      {
        id: '1001',
        date: new Date(2023, 5, 15),
        status: 'completed',
        productName: 'Premium Subscription - 1 Year',
        amount: 49.99
      },
      {
        id: '1002',
        date: new Date(2023, 8, 22),
        status: 'processing',
        productName: 'Resume Template Pack',
        amount: 19.99
      }
    ];
  }

  loadSettings(): void {
    // In a real app, this would be loaded from a service
    this.settings = {
      emailNotifications: true,
      marketingEmails: false,
      language: this.translateService.currentLang || 'en',
      theme: this.themeService.getCurrentTheme() || 'light'
    };
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.profileForm.dirty) {
      const formValues = this.profileForm.getRawValue();

      // Update user profile
      const updatedUser = this.userService.updateUserProfile({
        email: formValues.email,
        firstName: formValues.firstName || undefined,
        lastName: formValues.lastName || undefined
      });

      // Update the signal
      this.user.set(updatedUser);

      // Show success message
      this.updateSuccess = true;
      setTimeout(() => {
        this.updateSuccess = false;
      }, 3000);
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;

      // In a real app, this would call a service method
      console.log('[DEBUG_LOG] Changing password');

      // Show success message
      this.updateSuccess = true;
      setTimeout(() => {
        this.updateSuccess = false;
      }, 3000);

      // Reset form
      this.passwordForm.reset();
    }
  }

  toggleSetting(setting: string): void {
    if (this.settings.hasOwnProperty(setting)) {
      this.settings[setting] = !this.settings[setting];
      console.log(`[DEBUG_LOG] Setting ${setting} changed to ${this.settings[setting]}`);

      // In a real app, this would save the setting to a service
    }
  }

  changeLanguage(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const language = select.value;
    this.settings.language = language;

    // In a real app, this would call the translate service
    this.translateService.use(language);
    console.log(`[DEBUG_LOG] Language changed to ${language}`);
  }

  changeTheme(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const theme = select.value;
    this.settings.theme = theme;

    // In a real app, this would call a theme service
    this.themeService.setTheme(theme);
    console.log(`[DEBUG_LOG] Theme changed to ${theme}`);
  }

  deleteAccount(): void {
    if (confirm(this.translateService.instant('PROFILE.CONFIRM_DELETE_ACCOUNT'))) {
      console.log('[DEBUG_LOG] Deleting account');

      // In a real app, this would call a service method
      this.authService.logout();
      this.router.navigate(['/account/login']);
    }
  }

  logout(): void {
    console.log('[DEBUG_LOG] Logging out');
    this.authService.logout();
    // Navigate to the login page using Angular Router
    this.router.navigate(['/account/login']);
  }
}
