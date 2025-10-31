import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class Track {
  private baseUrl = "http://localhost:4000/api/tracks";

  constructor(private http: HttpClient) {}

  getTracks(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  addTrack(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  updateTrack(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteTrack(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
