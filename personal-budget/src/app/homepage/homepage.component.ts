import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { DataStorageService } from '../data-storage.service';
import * as d3 from 'd3';

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
  private d3dataSource = [{ label: '', value: 1 }];
  public d3data = [];
  // private data = [];
  private svg;
  private margin = 50;
  private width = 500;
  private height = 500;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors;

  private createSvg(): void {
    this.svg = d3.select("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );
  }

  private createColors(): void {
    this.colors = d3.scaleOrdinal()
      .domain(this.d3dataSource.map(d => d.value.toString()))
      .range([
        "#98abc5",
        "#8a89a6",
        "#7b6888",
        "#6b486b",
        "#a05d56",
        "#d0743c",
        "#ff8c00",]);
  }

  private drawChart(): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d.value));

    // Build the pie chart
    this.svg
      .selectAll('pieces')
      .data(pie(this.d3dataSource))
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(this.radius)
      )
      .attr('fill', (d, i) => (this.colors(i)))
      .attr("stroke", "#121926")
      .style("stroke-width", "1px");

    // Add labels
    const labelLocation = d3.arc()
      .innerRadius(100)
      .outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(this.d3dataSource))
      .enter()
      .append('text')
      .text(d => d.data.label)
      .attr("transform", d => "translate(" + labelLocation.centroid(d) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 15);
  }


  constructor(private http: HttpClient, private dataService: DataStorageService) { }

  ngAfterViewInit(): void {
    this.dataService.getBudget().subscribe((res: any) => {
      for (let i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;

        let obj = { label: res.myBudget[i].title, value: res.myBudget[i].budget };
        this.d3data[i] = obj;
      }
      this.d3dataSource = JSON.parse(JSON.stringify(this.d3data));
      this.createChart();
      this.createSvg();
      this.createColors();
      this.drawChart();
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
