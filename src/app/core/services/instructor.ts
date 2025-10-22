import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Instructor {
  private baseUrl = 'http://localhost:4000/api/instructor';

  constructor(private http: HttpClient) {}

  getMyCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses`);
  }

  getCourseDetails(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/courses/${id}`);
  }

  uploadMaterial(courseId: string, data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/materials/${courseId}`, data);
  }
  getMyStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/students`);
  }
}
