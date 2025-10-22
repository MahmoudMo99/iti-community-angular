import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Instructor } from '../../../core/services/instructor';

@Component({
  selector: 'app-course-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-details.html',
  styleUrl: './course-details.scss',
})
export class CourseDetailsInstructor {
  courseId!: string;
  course: any;
  loading = true;
  selectedFile!: File;

  constructor(
    private route: ActivatedRoute,
    private instructorService: Instructor,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];
    this.loadCourse();
  }

  loadCourse() {
    this.loading = true;
    this.instructorService.getCourseDetails(this.courseId).subscribe({
      next: (res) => {
        this.course = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadMaterial() {
    if (!this.selectedFile) {
      Swal.fire('No file selected', 'Please choose a file first.', 'warning');
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.instructorService.uploadMaterial(this.courseId, formData).subscribe({
      next: (res) => {
        Swal.fire('Uploaded!', 'Material added successfully.', 'success');
        this.selectedFile = null as any;
        this.loadCourse();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to upload file.', 'error');
      },
    });
  }

  deleteMaterial(materialId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This file will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#a1171d',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Implement delete request here if you have API for it
        Swal.fire('Deleted!', 'Material removed successfully.', 'success');
      }
    });
  }
}
