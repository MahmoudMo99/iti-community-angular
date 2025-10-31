import { Routes } from "@angular/router";
import { Login } from "./features/auth/login/login";
import { ChangePassword } from "./features/auth/change-password/change-password";
import { Dashboard } from "./features/dashboard/dashboard/dashboard";
import { Courses } from "./features/courses/courses/courses";
import { CourseDetails } from "./features/courses/course-details/course-details";
import { Profile } from "./features/profile/profile/profile";
import { Community } from "./features/community/community/community";
import { AdminDashboard } from "./features/admin-dashboard/admin-dashboard/admin-dashboard";
import { AdminLayout } from "./features/admin/admin-layout/admin-layout";
import { RoundsList } from "./features/admin/rounds/rounds-list/rounds-list";
import { TracksList } from "./features/admin/tracks/tracks-list/tracks-list";
import { InstructorDashboard } from "./features/instructor/instructor-dashboard/instructor-dashboard";
import { MyStudents } from "./features/instructor/my-students/my-students";
import { CourseDetailsInstructor } from "./features/instructor/course-details/course-details";
import { StudentDashboard } from "./features/student/student-dashboard/student-dashboard";
import { CourseDetailsStudent } from "./features/student/course-details-student/course-details-student";
import { MyColleagues } from "./features/student/my-colleagues/my-colleagues";
import { authGuard } from "./core/guards/auth-guard";
import { Home } from "./shared/home/home";
import { CoursesList } from "./features/admin/courses/courses-list/courses-list";

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: Home },
  { path: "login", component: Login },
  { path: "change-password", component: ChangePassword },
  { path: "profile", component: Profile },

  {
    path: "admin",
    component: AdminLayout,
    canActivate: [authGuard],
    data: { roles: ["Admin"] },
    children: [
      { path: "dashboard", component: Dashboard },
      { path: "courses", component: CoursesList },
      { path: "courses/:id", component: CourseDetails },
      { path: "rounds", component: RoundsList },
      { path: "tracks", component: TracksList },
      { path: "community", component: Community },
      { path: "admin-dashboard", component: AdminDashboard },
    ],
  },

  {
    path: "instructor",
    canActivate: [authGuard],
    data: { roles: ["Instructor"] },
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "dashboard", component: InstructorDashboard },
      { path: "students", component: MyStudents },
      { path: "course/:id", component: CourseDetailsInstructor },
    ],
  },

  {
    path: "student",
    canActivate: [authGuard],
    data: { roles: ["Student"] },
    children: [
      { path: "dashboard", component: StudentDashboard },
      { path: "course/:id", component: CourseDetailsStudent },
      { path: "colleagues", component: MyColleagues },

      { path: "", redirectTo: "dashboard", pathMatch: "full" },
    ],
  },

  { path: "**", redirectTo: "/login" },
];
