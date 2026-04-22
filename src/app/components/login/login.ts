import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  username!: string;
  password!: string;
  isPasswordVisible: boolean = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  constructor(private router: Router) {}

  handleSubmit(form: NgForm) {
    if (form.valid) {
      localStorage.setItem('username', this.username);
      console.log('Login successful, username saved:', this.username);

      this.router.navigate(['/home']);
    }
  }
}
