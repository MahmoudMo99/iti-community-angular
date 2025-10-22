import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Student {
  constructor(private http: HttpClient) {}

  private baseUrl = 'http://localhost:4000/api/student';

  getMyTrack(): Observable<any> {
    return this.http.get(`${this.baseUrl}/track`);
  }

  getMyCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses`);
  }

  getCourseDetails(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/courses/${id}`);
  }

  getOtherTracks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/other-tracks`);
  }

  getStudentsByTrack(trackId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tracks/${trackId}/students`);
  }
}
