import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Round } from "../../../../core/services/round";
import { CommonModule } from "@angular/common";
import Swal from "sweetalert2";

@Component({
  selector: "app-rounds-list",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./rounds-list.html",
  styleUrl: "./rounds-list.scss",
})
export class RoundsList {
  roundForm: any;

  rounds: any[] = [];

  isEditing = false;
  editingId: string | null = null;
  loading = true;

  constructor(private fb: FormBuilder, private roundService: Round) {
    this.roundForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.loadRounds();
  }

  loadRounds() {
    this.loading = true;
    this.roundService.getRounds().subscribe({
      next: (res) => {
        this.rounds = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.roundForm.invalid) return;

    const formData = this.roundForm.value;
    const action = this.isEditing
      ? this.roundService.updateRound(this.editingId!, formData)
      : this.roundService.addRound(formData);

    action.subscribe({
      next: () => {
        Swal.fire({
          icon: "success",
          title: this.isEditing ? "Round Updated!" : "Round Added!",
          timer: 1500,
          showConfirmButton: false,
        });
        this.roundForm.reset();
        this.isEditing = false;
        this.loadRounds();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  editRound(round: any) {
    this.isEditing = true;
    this.editingId = round._id;
    this.roundForm.patchValue({
      name: round.name,
      startDate: round.startDate.split("T")[0],
      endDate: round.endDate.split("T")[0],
    });
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
