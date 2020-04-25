import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DatewiseData } from 'src/app/models/date-wise-data';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: [ './countries.component.css' ]
})
export class CountriesComponent implements OnInit {
  data: GlobalDataSummary[];
  countries: string[] = [];
  totalConfirmed = 0;
  totalDeaths = 0;
  totalActive = 0;
  totalRecovered = 0;
  selectedCountryData: DatewiseData[];
  dateWiseData: DatewiseData;
  loading = true;
  datatable = [];
  chart = {
    LineChart: 'LineChart',
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      },
      is3D: true
    }
  }
  constructor(private service: DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.service.getDatewiseData().pipe(
        map(result => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(map(result => {
        this.data = result;
        this.data.forEach(cs => {
          this.countries.push(cs.country);
        })
      }))
    ).subscribe(
      {
        complete: () => {
          this.updateValues('US')
          this.loading = false;
        }
      }
    )


  }

  updateValues(country: string) {
    this.data.forEach(cs => {
      if (cs.country == country) {
        this.totalActive = cs.active;
        this.totalConfirmed = cs.confirmed;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
      }
    })
    this.selectedCountryData = this.dateWiseData[ country ];
    //console.log(this.selectedCountryData);
    this.updateChart();
  }

  updateChart() {
    this.datatable = [];
    this.selectedCountryData.forEach(
      cs => {
        this.datatable.push([ cs.date, cs.cases ])
      }
    )
  }
}
