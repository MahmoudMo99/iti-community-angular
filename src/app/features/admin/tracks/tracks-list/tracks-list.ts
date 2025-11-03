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
import Swal from "sweetalert2";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";
import { Track } from "../../../../core/services/track";
import { Round } from "../../../../core/services/round";

declare var bootstrap: any;

@Component({
  selector: "app-tracks-list",
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./tracks-list.html",
  styleUrl: "./tracks-list.scss",
})
export class TracksList implements AfterViewInit, OnDestroy {
  @ViewChild("modal") modalElement!: ElementRef;
  bsModal: any;

  tracks: any[] = [];
  rounds: any[] = [];
  totalItems = 0;
  hasMore = false;
  currentPage = 1;
  itemsPerPage = 6;

  searchTerm = "";
  selectedRound = "";

  searchChanged = new Subject<string>();

  trackForm: any;
  isEditing = false;
  editingId: string | null = null;

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

  ngAfterViewInit() {
    this.bsModal = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  ngOnDestroy() {
    if (this.bsModal) this.bsModal.dispose();
  }

  ngOnInit() {
    this.loadRounds();
    this.loadTracks();

    this.searchChanged
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.applyFilters());
  }

  loadRounds() {
    this.roundService.getRounds().subscribe((res: any) => {
      this.rounds = res.rounds || res; // لتوافق مع API rounds
    });
  }

  loadTracks() {
    this.trackService
      .getTracks(
        this.searchTerm,
        this.selectedRound,
        this.currentPage,
        this.itemsPerPage
      )
      .subscribe({
        next: (res: any) => {
          const newTracks = res.tracks.map((t: any, idx: number) => ({
            ...t,
            index: this.tracks.length + idx + 1,
          }));
          this.tracks = [...this.tracks, ...newTracks];
          this.totalItems = res.total;
          this.hasMore = this.tracks.length < this.totalItems;
        },
        error: () => {
          this.tracks = [];
          this.hasMore = false;
        },
      });
  }

  applyFilters() {
    this.currentPage = 1;
    this.tracks = [];
    this.loadTracks();
  }

  loadMore() {
    this.currentPage++;
    this.loadTracks();
  }

  openModal() {
    this.isEditing = false;
    this.trackForm.reset();
    this.bsModal.show();
  }

  closeModal() {
    this.bsModal.hide();
    this.trackForm.reset();
    this.isEditing = false;
    this.editingId = null;
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
        this.applyFilters();
        this.closeModal();
      },
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
    this.bsModal.show();
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
          this.applyFilters();
        });
      }
    });
  }
}
