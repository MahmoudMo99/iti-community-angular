import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.createForm();
  }

  private createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.isLoading = false;

        // ✅ حفظ بيانات المستخدم
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.user.role);
        localStorage.setItem('name', res.user.name);

        // ✅ لو محتاج يغير الباسورد أول مرة
        if (res.user.forcePasswordChange) {
          Swal.fire({
            icon: 'info',
            title: 'Change your password',
            text: 'Please update your password before continuing.',
            confirmButtonColor: '#a1171d',
          }).then(() => {
            this.router.navigate(['/change-password']);
          });
          return;
        }

        // ✅ توجيه حسب الدور
        switch (res.user.role) {
          case 'Admin':
            this.router.navigate(['/admin/dashboard']);
            break;
          case 'Instructor':
            this.router.navigate(['/instructor/dashboard']);
            break;
          case 'Student':
            this.router.navigate(['/student/dashboard']);
            break;
        }

        // ✅ رسالة ترحيب
        Swal.fire({
          icon: 'success',
          title: `Welcome back, ${res.user.name}!`,
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid email or password';

        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: this.errorMessage,
          confirmButtonColor: '#a1171d',
        });
      },
    });
  }
}
