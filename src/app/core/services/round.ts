import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Round {
  private baseUrl = 'http://localhost:4000/api/rounds';

  constructor(private http: HttpClient) {}

  getRounds(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
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
