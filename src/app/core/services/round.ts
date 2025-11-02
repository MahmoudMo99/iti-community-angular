import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class Round {
  private baseUrl = "http://localhost:4000/api/rounds";

  constructor(private http: HttpClient) {}

  getRounds(
    search: string = "",
    startDate: string = "",
    endDate: string = "",
    page: number = 1,
    limit: number = 9
  ): Observable<any> {
    let params = new URLSearchParams();

    if (search) params.append("search", search);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const url = `${this.baseUrl}?${params.toString()}`;

    return this.http.get<any>(url);
  }

  addRound(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  updateRound(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteRound(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
