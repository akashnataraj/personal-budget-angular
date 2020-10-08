import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Chart} from 'chart.js';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements AfterViewInit {
  public dataSource = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
          '#0cda85',
          '#7748d2',
          '#ff0000',
        ]
      }
    ],
    labels: [],
  };
  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.http.get('http://localhost:3000/budget')
      .subscribe((res: any) => {
        for (let i = 0; i < res.myBudget.length; i++) {
          this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
          this.dataSource.labels[i] = res.myBudget[i].title;
        }
        this.createChart();
      });
  }

  createChart() {
    const ctx = document.getElementById("myChart");
    const myPieChart = new Chart(ctx, {
      type: "pie",
      data: this.dataSource,
    });
  }

}
