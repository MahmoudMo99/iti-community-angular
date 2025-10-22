import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Instructor } from '../../../core/services/instructor';

@Component({
  selector: 'app-my-students',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './my-students.html',
  styleUrl: './my-students.scss',
})
export class MyStudents {
  students: any[] = [];
  filteredStudents: any[] = [];
  tracks: string[] = [];
  loading = true;
  filterForm: any;

  constructor(private instructorService: Instructor, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      track: [''],
    });
  }

  ngOnInit() {
    this.loadStudents();
    this.filterForm.get('track')?.valueChanges.subscribe((val: any) => {
      this.filterStudents(val);
    });
  }

  loadStudents() {
    this.loading = true;
    this.instructorService.getMyStudents().subscribe({
      next: (res) => {
        this.students = res;
        this.filteredStudents = res;
        this.tracks = [...new Set(res.map((s: any) => s.track?.name))];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  filterStudents(trackName: string | null) {
    if (!trackName) {
      this.filteredStudents = this.students;
    } else {
      this.filteredStudents = this.students.filter(
        (s) => s.track?.name === trackName
      );
    }
  }
}
