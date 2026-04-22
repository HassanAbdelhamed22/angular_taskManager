import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email!: string;
  password!: string;
  isPasswordVisible: boolean = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  handleSubmit(form: NgForm) {
    const loginData = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.authService.saveAuthData(response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login error:', error);
        alert('Invalid email or password');
      },
    });
  }
}
