import { Component, EventEmitter, Output } from "@angular/core";
import { Auth } from "../../../core/services/auth";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin-header",
  imports: [],
  templateUrl: "./admin-header.html",
  styleUrl: "./admin-header.scss",
})
export class AdminHeader {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  user: any = null;

  constructor(private authService: Auth, private router: Router) {
    this.user = this.authService.getCurrentUser();
  }

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
