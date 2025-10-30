import { CommonModule } from "@angular/common";
import { Component, HostListener } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AdminSidebar } from "../admin-sidebar/admin-sidebar";
import { AdminHeader } from "../admin-header/admin-header";

@Component({
  selector: "app-admin-layout",
  imports: [CommonModule, RouterOutlet, AdminSidebar, AdminHeader],
  templateUrl: "./admin-layout.html",
  styleUrl: "./admin-layout.scss",
})
export class AdminLayout {
  sidebarOpen = false;
  isMobile = false;
  isCollapsed = false;

  constructor() {
    this.checkScreen();
  }

  @HostListener("window:resize")
  onResize() {
    this.checkScreen();
  }

  checkScreen() {
    this.isMobile = window.innerWidth < 992;
    this.sidebarOpen = !this.isMobile;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  onCollapse(state: boolean) {
    this.isCollapsed = state;
  }
}
