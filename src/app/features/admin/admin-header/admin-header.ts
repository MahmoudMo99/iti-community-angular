import { Component, EventEmitter, Output } from "@angular/core";
import { Auth } from "../../../core/services/auth";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-admin-header",
  imports: [CommonModule, RouterModule],
  templateUrl: "./admin-header.html",
  styleUrl: "./admin-header.scss",
})
export class AdminHeader {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  user: any = null;

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  constructor(private authService: Auth, private router: Router) {
    this.user = this.authService.getCurrentUser();
  }

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  logout() {
    this.menuOpen = false;
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
