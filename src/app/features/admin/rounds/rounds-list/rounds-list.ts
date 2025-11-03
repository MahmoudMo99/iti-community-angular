import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Round } from "../../../../core/services/round";
import { CommonModule } from "@angular/common";
import Swal from "sweetalert2";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Subject } from "rxjs";

declare var bootstrap: any;

@Component({
  selector: "app-rounds-list",
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./rounds-list.html",
  styleUrl: "./rounds-list.scss",
})
export class RoundsList implements OnDestroy, AfterViewInit {
  @ViewChild("modal") modalElement!: ElementRef;
  bsModal: any;

  roundForm: any;
  rounds: any[] = [];

  isEditing = false;
  editingId: string | null = null;

  searchTerm = "";
  filterStartDate: string = "";
  filterEndDate: string = "";

  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;
  hasMore = false;
  searchChanged = new Subject<string>();

  constructor(private fb: FormBuilder, private roundService: Round) {
    this.roundForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
    });
  }

  ngAfterViewInit() {
    this.bsModal = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  ngOnDestroy() {
    if (this.bsModal) {
      this.bsModal.dispose();
    }
  }

  ngOnInit() {
    this.searchChanged
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.applyFilters());
    this.loadRounds();
  }

  applyFilters() {
    this.currentPage = 1;
    this.rounds = [];
    this.loadRounds();
  }

  onFilterChange() {
    this.applyFilters();
  }

  loadRounds() {
    this.roundService
      .getRounds(
        this.searchTerm,
        this.filterStartDate,
        this.filterEndDate,
        this.currentPage,
        this.itemsPerPage
      )
      .subscribe({
        next: (res: any) => {
          const newRounds = res.rounds.map((r: any, idx: number) => ({
            ...r,
            index: this.rounds.length + idx + 1,
          }));

          this.rounds = [...this.rounds, ...newRounds];
          this.totalItems = res.total;

          this.hasMore = this.rounds.length < this.totalItems;
        },
        error: () => {
          this.rounds = [];
          this.hasMore = false;
        },
      });
  }

  loadMore() {
    this.currentPage++;
    this.loadRounds();
  }

  openModal() {
    this.isEditing = false;
    this.roundForm.reset();
    this.bsModal.show();
  }

  closeModal() {
    this.bsModal.hide();
    this.editingId = null;
    this.isEditing = false;
    this.roundForm.reset();
  }

  onSubmit() {
    if (this.roundForm.invalid) return;
    const data = this.roundForm.value;
    const action = this.isEditing
      ? this.roundService.updateRound(this.editingId!, data)
      : this.roundService.addRound(data);

    action.subscribe({
      next: () => {
        Swal.fire({
          icon: "success",
          title: this.isEditing ? "Round Updated!" : "Round Added!",
          timer: 1500,
          showConfirmButton: false,
        });
        this.rounds = [];
        this.currentPage = 1;
        this.loadRounds();
        this.closeModal();
      },
    });
  }

  editRound(r: any) {
    this.isEditing = true;
    this.editingId = r._id;
    this.roundForm.patchValue({
      name: r.name,
      startDate: r.startDate.split("T")[0],
      endDate: r.endDate.split("T")[0],
    });
    this.bsModal.show();
  }

  deleteRound(id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "This round will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#a1171d",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.roundService.deleteRound(id).subscribe(() => {
          Swal.fire("Deleted!", "Round has been removed.", "success");
          this.rounds = [];
          this.currentPage = 1;
          this.loadRounds();
        });
      }
    });
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingId = null;
    this.roundForm.reset();
  }
}
