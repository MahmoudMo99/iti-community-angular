import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-admin-sidebar",
  imports: [CommonModule, RouterModule],
  templateUrl: "./admin-sidebar.html",
  styleUrl: "./admin-sidebar.scss",
})
export class AdminSidebar {
  @Input() isOpen = false;
  @Input() isMobile = false;
  @Output() close = new EventEmitter<void>();
  @Output() collapse = new EventEmitter<boolean>();

  isCollapsed = false;

  navItems = [
    {
      label: "Dashboard",
      icon: "bi bi-speedometer2",
      link: "/admin/dashboard",
    },
    { label: "Rounds", icon: "bi bi-calendar-event", link: "/admin/rounds" },
    { label: "Tracks", icon: "bi bi-diagram-3", link: "/admin/tracks" },
    { label: "Courses", icon: "bi bi-book", link: "/admin/courses" },
    { label: "Users", icon: "bi bi-people", link: "/admin/users" },
  ];

  constructor() {}

  onNavClick() {
    if (this.isMobile) this.close.emit();
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.collapse.emit(this.isCollapsed);
  }
}
