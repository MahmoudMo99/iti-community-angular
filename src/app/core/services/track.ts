import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class Track {
  private baseUrl = "http://localhost:4000/api/tracks";

  constructor(private http: HttpClient) {}

  getTracks(
    search: string = "",
    roundId: string = "",
    page: number = 1,
    limit: number = 9
  ): Observable<any> {
    let params = new URLSearchParams();

    if (search) params.append("search", search);
    if (roundId) params.append("roundId", roundId);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const url = `${this.baseUrl}?${params.toString()}`;
    return this.http.get<any>(url);
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
