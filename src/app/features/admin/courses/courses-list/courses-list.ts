import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Course } from '../../../../core/services/course';
import { Track } from '../../../../core/services/track';
import { Round } from '../../../../core/services/round';
import { User } from '../../../../core/services/user';

@Component({
  selector: 'app-courses-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './courses-list.html',
  styleUrl: './courses-list.scss',
})
export class CoursesList {
  courses: any[] = [];
  tracks: any[] = [];
  rounds: any[] = [];
  instructors: any[] = [];
  loading = true;
  isEditing = false;
  editingId: string | null = null;

  courseForm: any;

  constructor(
    private fb: FormBuilder,
    private courseService: Course,
    private trackService: Track,
    private roundService: Round,
    private userService: User
  ) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      track: ['', Validators.required],
      round: ['', Validators.required],
      lectureInstructor: ['', Validators.required],
      labInstructor: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.loadCourses();
    this.trackService.getTracks().subscribe((res) => (this.tracks = res));
    this.roundService.getRounds().subscribe((res) => (this.rounds = res));
    this.userService
      .getInstructors()
      .subscribe((res) => (this.instructors = res));
  }

  loadCourses() {
    this.loading = true;
    this.courseService.getCourses().subscribe({
      next: (res) => {
        this.courses = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onSubmit() {
    if (this.courseForm.invalid) return;
    const data = this.courseForm.value;

    const action = this.isEditing
      ? this.courseService.updateCourse(this.editingId!, data)
      : this.courseService.addCourse(data);

    action.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.isEditing ? 'Course Updated!' : 'Course Added!',
          timer: 1500,
          showConfirmButton: false,
        });
        this.courseForm.reset();
        this.isEditing = false;
        this.loadCourses();
      },
      error: (err) => console.error(err),
    });
  }

  editCourse(course: any) {
    this.isEditing = true;
    this.editingId = course._id;
    this.courseForm.patchValue({
      title: course.title,
      track: course.track?._id,
      round: course.round?._id,
      lectureInstructor: course.lectureInstructor?._id,
      labInstructor: course.labInstructor?._id,
    });
  }

  deleteCourse(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This course will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#a1171d',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.deleteCourse(id).subscribe(() => {
          Swal.fire('Deleted!', 'Course has been removed.', 'success');
          this.loadCourses();
        });
      }
    });
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingId = null;
    this.courseForm.reset();
  }
}
