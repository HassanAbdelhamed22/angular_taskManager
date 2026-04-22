import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  form = new FormGroup(
    {
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_]+$/),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
      ]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    },
    {
      validators: this.passwordMatchValidator,
    },
  );

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  handleSubmit() {
    if (this.form.valid) {
      const userData = {
        username: this.form.value.username!,
        email: this.form.value.email!,
        password: this.form.value.password!,
      };

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.authService.saveAuthData(response);
          this.toastService.showToast('You registered successfully', 'success');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Register error:', error);
          this.toastService.showToast('Email already exists', 'error');
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
