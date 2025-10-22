import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { User } from '../../../../core/services/user';
import { Track } from '../../../../core/services/track';
@Component({
  selector: 'app-users-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList {
  users: any[] = [];
  tracks: any[] = [];
  loading = true;
  isUploading = false;
  selectedFile: File | null = null;

  userForm: any;

  constructor(
    private fb: FormBuilder,
    private userService: User,
    private trackService: Track
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['Student', Validators.required],
      track: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadUsers();
    this.trackService.getTracks().subscribe((res) => (this.tracks = res));
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onAddUser() {
    if (this.userForm.invalid) return;
    const data = this.userForm.value;

    this.userService.addUser(data).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'User Added!',
          timer: 1500,
          showConfirmButton: false,
        });
        this.userForm.reset({ role: 'Student' });
        this.loadUsers();
      },
      error: (err) => console.error(err),
    });
  }

  onDeleteUser(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#a1171d',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe(() => {
          Swal.fire('Deleted!', 'User removed successfully.', 'success');
          this.loadUsers();
        });
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadExcel() {
    if (!this.selectedFile) return;
    this.isUploading = true;
    this.userService.uploadExcel(this.selectedFile).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Excel Uploaded!',
          text: 'Users imported successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
        this.isUploading = false;
        this.selectedFile = null;
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        this.isUploading = false;
      },
    });
  }
}
