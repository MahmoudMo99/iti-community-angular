import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Admin } from '../../../core/services/admin';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule, NgxEchartsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  stats: any = null;
  isLoading = true;
  rounds: any[] = [];
  tracks: any[] = [];
  selectedRound: string = '';
  selectedTrack: string = '';
  // Charts
  studentTrackChart!: EChartsOption;
  coursesRoundChart!: EChartsOption;
  constructor(private adminService: Admin) {}

  ngOnInit(): void {
    this.loadFilters();
    this.loadStats();
  }
  loadFilters() {
    this.adminService.getRounds().subscribe((res) => (this.rounds = res));
    this.adminService.getTracks().subscribe((res) => (this.tracks = res));
  }
  onFilterChange() {
    this.loadStats();
  }
  loadStats() {
    this.isLoading = true;
    this.adminService
      .getFilteredStats(this.selectedRound, this.selectedTrack)
      .subscribe({
        next: (res) => {
          this.stats = res;
          this.isLoading = false;
          this.initializeCharts(res);
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        },
      });
  }

  initializeCharts(data: any) {
    this.studentTrackChart = {
      title: {
        text: 'Students per Track',
        left: 'center',
        textStyle: { color: '#333', fontSize: 16 },
      },
      tooltip: { trigger: 'item' },
      series: [
        {
          name: 'Students',
          type: 'pie',
          radius: '60%',
          data: data.studentsPerTrack?.map((t: any) => ({
            name: t.trackName,
            value: t.count,
          })),
          label: { color: '#444', fontSize: 13 },
          color: ['#a1171d', '#64b5f6', '#81c784', '#ba68c8', '#ffb74d'],
        },
      ],
    };

    this.coursesRoundChart = {
      title: {
        text: 'Courses per Round',
        left: 'center',
        textStyle: { color: '#333', fontSize: 16 },
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: data.coursesPerRound?.map((r: any) => r.roundName),
        axisLabel: { color: '#555', fontWeight: 500 },
      },
      yAxis: { type: 'value', axisLabel: { color: '#555' } },
      series: [
        {
          data: data.coursesPerRound?.map((r: any) => r.count),
          type: 'bar',
          itemStyle: { color: '#a1171d', borderRadius: [5, 5, 0, 0] },
          barWidth: '40%',
        },
      ],
    };
  }
}
