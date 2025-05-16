import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCreditCard, faCheck, faTimes, faCrown, faBarcode, faQrcode, faCopy } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../../core/services/user.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    FontAwesomeModule
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent implements OnInit {
  faCreditCard = faCreditCard;
  faCheck = faCheck;
  faTimes = faTimes;
  faCrown = faCrown;
  faBarcode = faBarcode;
  faQrcode = faQrcode;
  faCopy = faCopy;

  selectedPlan: 'free' | 'premium' = 'free';
  paymentMethod: 'card' | 'boleto' | 'pix' = 'card';
  cardForm: FormGroup;
  discount = 0;
  total = 49.99; // Example price

  private router = inject(Router);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private clipboard = inject(Clipboard);

  constructor() {
    this.cardForm = this.fb.group({
      cardName: ['', Validators.required],
      cardNumber: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{13,19}$/)
      ]],
      expiryDate: ['', [
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)
      ]],
      cvv: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{3,4}$/)
      ]]
    });
  }

  ngOnInit(): void {
    // Check if user is already premium
    if (this.userService.isPremiumUser()) {
      this.selectedPlan = 'premium';
    }
  }

  selectPlan(plan: 'free' | 'premium'): void {
    this.selectedPlan = plan;

    if (plan === 'free' && this.userService.isPremiumUser()) {
      // Downgrade to free (in a real app, this would involve API calls)
      this.userService.updatePremiumStatus(false);
      this.router.navigate(['/dashboard']);
    }
  }

  setPaymentMethod(method: 'card' | 'boleto' | 'pix'): void {
    this.paymentMethod = method;
  }

  copyPixCode(): void {
    const pixCode = '00020126580014br.gov.bcb.pix0136a629532e-7693-4846-b028-f142082d7b0752040000530398654041.005802BR5925GERADOR DE CURRICULO SA6009SAO PAULO62070503***6304E2CA';
    this.clipboard.copy(pixCode);

    // In a real app, you would show a toast or notification
    console.log('[DEBUG_LOG] PIX code copied to clipboard');
  }

  goBack(): void {
    // In a real app, this would go back to the previous step in the checkout process
    // For now, we'll just reset the payment method to card
    this.paymentMethod = 'card';
  }

  processPayment(): void {
    // In a real app, this would integrate with Stripe or another payment processor
    // For now, we'll just simulate a successful payment
    console.log('[DEBUG_LOG] Processing payment with method:', this.paymentMethod);

    if (this.paymentMethod === 'card' && this.cardForm.invalid) {
      console.log('[DEBUG_LOG] Card form is invalid');
      return;
    }

    // Update user to premium
    this.userService.updatePremiumStatus(true);

    // Navigate to success page
    this.router.navigate(['/checkout/success']);
  }
}
