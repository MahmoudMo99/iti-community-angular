import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-instructor-layout',
  imports: [RouterOutlet],
  templateUrl: './instructor-layout.html',
  styleUrl: './instructor-layout.scss',
})
export class InstructorLayout {
  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
