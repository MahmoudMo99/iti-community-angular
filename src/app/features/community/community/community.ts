import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { CommunityService } from '../../../core/services/community-service';

@Component({
  selector: 'app-community',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './community.html',
  styleUrl: './community.scss',
})
export class Community {
  posts: any[] = [];
  postForm!: FormGroup;
  user: any;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private communityService: CommunityService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.loadPosts();
  }

  loadPosts() {
    this.communityService.getPostsByTrack(this.user.track._id).subscribe({
      next: (res) => {
        this.posts = res.reverse();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  createPost() {
    if (this.postForm.invalid) return;
    const { content } = this.postForm.value;

    this.communityService
      .createPost(this.user._id, this.user.track._id, content)
      .subscribe({
        next: (res) => {
          this.posts.unshift(res);
          this.postForm.reset();
        },
        error: (err) => console.error(err),
      });
  }

  addComment(postId: string, input: HTMLInputElement) {
    const text = input.value.trim();
    if (!text) return;

    this.communityService.addComment(postId, this.user._id, text).subscribe({
      next: (res: any) => {
        const post = this.posts.find((p) => p._id === postId);
        post.comments.push(res);
        input.value = '';
      },
      error: (err: any) => console.error(err),
    });
  }
}
