import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Instructor } from '../../../core/services/instructor';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-instructor-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './instructor-dashboard.html',
  styleUrl: './instructor-dashboard.scss',
})
export class InstructorDashboard {
  courses: any[] = [];
  loading = true;

  constructor(private instructorService: Instructor) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    this.instructorService.getMyCourses().subscribe({
      next: (res) => {
        this.courses = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
