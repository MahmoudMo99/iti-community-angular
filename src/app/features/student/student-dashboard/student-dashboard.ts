import { Component } from '@angular/core';
import { Student } from '../../../core/services/student';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboard {
  track: any;
  courses: any[] = [];
  loading = true;

  constructor(private studentService: Student) {}

  ngOnInit() {
    this.loadStudentData();
  }

  loadStudentData() {
    this.loading = true;
    this.studentService.getMyTrack().subscribe({
      next: (res) => {
        this.track = res;
        this.loadCourses();
      },
      error: () => (this.loading = false),
    });
  }
  loadCourses() {
    this.studentService.getMyCourses().subscribe({
      next: (res) => {
        this.courses = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
