import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Student } from '../../../core/services/student';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-details-student',
  imports: [CommonModule],
  templateUrl: './course-details-student.html',
  styleUrl: './course-details-student.scss',
})
export class CourseDetailsStudent {
  courseId!: string;
  course: any;
  loading = true;

  constructor(private route: ActivatedRoute, private studentService: Student) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];
    this.loadCourse();
  }

  loadCourse() {
    this.loading = true;
    this.studentService.getCourseDetails(this.courseId).subscribe({
      next: (res) => {
        this.course = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  getFileIcon(fileName: string) {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'bi-file-earmark-pdf';
      case 'ppt':
      case 'pptx':
        return 'bi-file-earmark-slides';
      case 'mp4':
      case 'mov':
        return 'bi-file-earmark-play';
      case 'zip':
      case 'rar':
        return 'bi-file-earmark-zip';
      default:
        return 'bi-file-earmark-text';
    }
  }
}
