import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  private baseUrl = 'http://localhost:4000/api/posts';

  constructor(private http: HttpClient) {}

  getPostsByTrack(trackId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/track/${trackId}`);
  }

  createPost(
    authorId: string,
    trackId: string,
    content: string
  ): Observable<any> {
    return this.http.post<any>(this.baseUrl, {
      author: authorId,
      track: trackId,
      content,
    });
  }

  addComment(postId: string, authorId: string, text: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${postId}/comments`, {
      author: authorId,
      text,
    });
  }
}
