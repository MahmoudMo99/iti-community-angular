import { Component } from '@angular/core';
import { Student } from '../../../core/services/student';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-colleagues',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './my-colleagues.html',
  styleUrl: './my-colleagues.scss',
})
export class MyColleagues {
  tracks: any[] = [];
  students: any[] = [];
  filteredStudents: any[] = [];
  loading = true;

  filterForm: any;

  constructor(private studentService: Student, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      trackId: [''],
    });
  }

  ngOnInit() {
    this.loadTracks();
    this.filterForm.get('trackId')?.valueChanges.subscribe((id: any) => {
      if (id) this.loadStudentsByTrack(id);
    });
  }

  loadTracks() {
    this.loading = true;
    this.studentService.getOtherTracks().subscribe({
      next: (res) => {
        this.tracks = res;
        this.loading = false;

        // Automatically select the first track (the student's own)
        if (this.tracks.length) {
          const currentTrack = this.tracks.find((t) => t.isCurrent);
          if (currentTrack) {
            this.filterForm.patchValue({ trackId: currentTrack._id });
            this.loadStudentsByTrack(currentTrack._id);
          }
        }
      },
      error: () => (this.loading = false),
    });
  }

  loadStudentsByTrack(trackId: string) {
    this.loading = true;
    this.studentService.getStudentsByTrack(trackId).subscribe({
      next: (res) => {
        this.students = res;
        this.filteredStudents = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
