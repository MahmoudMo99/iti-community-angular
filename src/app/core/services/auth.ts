import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class Auth {
  private baseUrl = "http://localhost:4000/api/auth";

  tokenKey = "token";

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        this.saveToken(res.token);
        this.saveUser(res.user);
      })
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/change-password`, {
      oldPassword,
      newPassword,
    });
  }

  getCurrentUser() {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  saveUser(user: any) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}
