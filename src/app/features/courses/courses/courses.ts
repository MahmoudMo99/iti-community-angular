import { Component } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoursesService } from '../../../core/services/courses';

@Component({
  selector: 'app-courses',
  imports: [CommonModule],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses {
  courses: any[] = [];
  user: any;
  isLoading = true;

  constructor(
    private courseService: CoursesService,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCoursesByTrack(this.user.track).subscribe({
      next: (res) => {
        this.courses = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  openCourse(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }
}
