import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { Track } from "../../../../core/services/track";
import { Round } from "../../../../core/services/round";

@Component({
  selector: "app-tracks-list",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./tracks-list.html",
  styleUrl: "./tracks-list.scss",
})
export class TracksList {
  tracks: any[] = [];
  rounds: any[] = [];

  trackForm: any;

  isEditing = false;
  editingId: string | null = null;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private trackService: Track,
    private roundService: Round
  ) {
    this.trackForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      roundId: ["", Validators.required],
      description: [""],
    });
  }

  ngOnInit() {
    this.loadTracks();
    this.loadRounds();
  }

  loadTracks() {
    this.loading = true;
    this.trackService.getTracks().subscribe({
      next: (res) => {
        this.tracks = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  loadRounds() {
    this.roundService.getRounds().subscribe({
      next: (res) => (this.rounds = res),
    });
  }

  onSubmit() {
    if (this.trackForm.invalid) return;
    const data = this.trackForm.value;

    const action = this.isEditing
      ? this.trackService.updateTrack(this.editingId!, data)
      : this.trackService.addTrack(data);

    action.subscribe({
      next: () => {
        Swal.fire({
          icon: "success",
          title: this.isEditing ? "Track Updated!" : "Track Added!",
          timer: 1500,
          showConfirmButton: false,
        });
        this.trackForm.reset();
        this.isEditing = false;
        this.loadTracks();
      },
      error: (err) => console.error(err),
    });
  }

  editTrack(track: any) {
    this.isEditing = true;
    this.editingId = track._id;
    this.trackForm.patchValue({
      name: track.name,
      roundId: track.round?._id || "",
      description: track.description || "",
    });
  }

  deleteTrack(id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "This track will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#a1171d",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.trackService.deleteTrack(id).subscribe(() => {
          Swal.fire("Deleted!", "Track has been removed.", "success");
          this.loadTracks();
        });
      }
    });
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingId = null;
    this.trackForm.reset();
  }
  scrollToForm() {
    document.querySelector("form")?.scrollIntoView({ behavior: "smooth" });
  }
}
