import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class Course {
  private baseUrl = "http://localhost:4000/api/courses";

  constructor(private http: HttpClient) {}

  getCourses(
    search: string = "",
    track: string = "",
    lectureInstructor: string = "",
    labInstructor: string = "",
    page: number = 1,
    limit: number = 9
  ): Observable<any> {
    let params = new URLSearchParams();

    if (search) params.append("search", search);
    if (track) params.append("track", track);
    if (lectureInstructor)
      params.append("lectureInstructor", lectureInstructor);
    if (labInstructor) params.append("labInstructor", labInstructor);

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const url = `${this.baseUrl}?${params.toString()}`;
    return this.http.get<any>(url);
  }

  addCourse(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  updateCourse(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
