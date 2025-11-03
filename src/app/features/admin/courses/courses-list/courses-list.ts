import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";
import Swal from "sweetalert2";

import { Course } from "../../../../core/services/course";
import { Track } from "../../../../core/services/track";
import { User } from "../../../../core/services/user";

declare var bootstrap: any;

@Component({
  selector: "app-courses-list",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./courses-list.html",
  styleUrls: ["./courses-list.scss"],
})
export class CoursesList implements AfterViewInit, OnDestroy {
  @ViewChild("modal") modalElement!: ElementRef;
  bsModal: any;

  courses: any[] = [];
  tracks: any[] = [];
  instructors: any[] = [];

  totalItems = 0;
  hasMore = false;
  currentPage = 1;
  itemsPerPage = 6;

  searchTerm = "";
  selectedTrack = "";
  lectureInstructorFilter = "";
  labInstructorFilter = "";

  searchChanged = new Subject<string>();

  courseForm: any;
  isEditing = false;
  editingId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private courseService: Course,
    private trackService: Track,
    private userService: User
  ) {
    this.courseForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(3)]],
      track: ["", Validators.required],
      lectureInstructor: [""],
      labInstructor: [""],
      description: [""],
    });
  }

  ngAfterViewInit() {
    this.bsModal = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  ngOnDestroy() {
    if (this.bsModal) this.bsModal.dispose();
  }

  ngOnInit() {
    this.loadTracks();
    this.loadInstructors();
    this.loadCourses();

    this.searchChanged
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.applyFilters());
  }

  loadTracks() {
    this.trackService.getTracks().subscribe({
      next: (res: any) => (this.tracks = res.tracks || res),
    });
  }

  loadInstructors() {
    this.userService.getInstructors().subscribe({
      next: (res: any) => (this.instructors = res),
    });
  }

  loadCourses() {
    this.courseService
      .getCourses(
        this.searchTerm,
        this.selectedTrack,
        this.lectureInstructorFilter,
        this.labInstructorFilter,
        this.currentPage,
        this.itemsPerPage
      )
      .subscribe({
        next: (res: any) => {
          const newCourses = res.courses
            ? res.courses.map((c: any, idx: number) => ({
                ...c,
                index: this.courses.length + idx + 1,
              }))
            : res.map((c: any, idx: number) => ({
                ...c,
                index: this.courses.length + idx + 1,
              }));

          this.courses = [...this.courses, ...newCourses];
          this.totalItems = res.total || this.courses.length;
          this.hasMore = this.courses.length < this.totalItems;
        },
        error: () => {
          this.courses = [];
          this.hasMore = false;
        },
      });
  }

  applyFilters() {
    this.currentPage = 1;
    this.courses = [];
    this.loadCourses();
  }
  loadMore() {
    this.currentPage++;
    this.loadCourses();
  }

  openModal() {
    this.isEditing = false;
    this.editingId = null;
    this.courseForm.reset();
    this.bsModal.show();
  }

  closeModal() {
    this.bsModal.hide();
    this.courseForm.reset();
    this.isEditing = false;
    this.editingId = null;
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
          icon: "success",
          title: this.isEditing ? "Course Updated!" : "Course Added!",
          timer: 1500,
          showConfirmButton: false,
        });
        this.applyFilters();
        this.closeModal();
      },
      error: () => {
        Swal.fire("Error", "Something went wrong", "error");
      },
    });
  }

  editCourse(course: any) {
    this.isEditing = true;
    this.editingId = course._id;
    this.courseForm.patchValue({
      title: course.title,
      track: course.track?._id || "",
      lectureInstructor: course.lectureInstructor?._id || "",
      labInstructor: course.labInstructor?._id || "",
      description: course.description || "",
    });
    this.bsModal.show();
  }

  deleteCourse(id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "This course will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#a1171d",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.deleteCourse(id).subscribe(() => {
          Swal.fire("Deleted!", "Course has been removed.", "success");
          this.applyFilters();
        });
      }
    });
  }
}
