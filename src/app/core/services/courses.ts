import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private baseUrl = 'http://localhost:4000/api/courses';

  constructor(private http: HttpClient) {}

  getCoursesByTrack(trackId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/track/${trackId}`);
  }

  getCourseById(courseId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${courseId}`);
  }
}
