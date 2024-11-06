import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalUsers: number = 0;
  totalTasks: number = 0;
  completedTasks: number = 0;
  Pending: number = 0;
  topUsers: any[] = [];
  latestTasks: any[] = [];

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions?: Highcharts.Options; 

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchStatistics();
    this.fetchTopUsers();
    this.fetchLatestTasks();
  }

  fetchStatistics() {
   
    this.adminService.getNumberOfUsers().subscribe(totalUsers => {
      this.totalUsers = totalUsers;
    });

    
    this.adminService.getNumberOfTasks().subscribe(totalTasks => {
      this.totalTasks = totalTasks;
    });

    
    this.adminService.getNumberOfCompletedTasks().subscribe(completedTasks => {
      this.completedTasks = completedTasks;

      this.adminService.getNumberOfPendingTasks().subscribe(Pending => {
        this.Pending = Pending;

        
        this.chartOptions = {
          chart: {
            type: 'column'
          },
          title: {
            text: 'Task Status Statistics'
          },
          xAxis: {
            categories: ['Tasks']
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Number of Tasks'
            }
          },
          series: [
            {
              name: 'Completed',
              type: 'column',
              data: [this.completedTasks],
              color: '#4CAF50'
            },
            {
              name: 'Pending',
              type: 'column',
              data: [this.Pending],
              color: '#FF9800'
            }
          ],
          plotOptions: {
            column: {
              dataLabels: {
                enabled: true
              }
            }
          },
          legend: {
            enabled: true
          }
        };
      });
    });
  }

  fetchTopUsers() {
    this.adminService.getUsersByTopNumberOfTasks(5).subscribe(topUsers => {
      this.topUsers = topUsers;
    });
  }

  fetchLatestTasks() {
    this.adminService.getAllTasks().subscribe(tasks => {
      this.latestTasks = tasks.slice(0, 5); 
    });
  }
}