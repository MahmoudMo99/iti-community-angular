import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Admin {
  private baseUrl = 'http://localhost:4000/api/admin';

  constructor(private http: HttpClient) {}

  getAdminStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`);
  }
  getFilteredStats(roundId?: string, trackId?: string): Observable<any> {
    let params = new HttpParams();
    if (roundId) params = params.set('round', roundId);
    if (trackId) params = params.set('track', trackId);
    return this.http.get(`${this.baseUrl}/stats`, { params });
  }
  getRounds(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:4000/api/rounds');
  }
  getTracks(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:4000/api/tracks');
  }
}
