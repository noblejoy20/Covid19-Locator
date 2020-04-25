import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { GlobalDataSummary } from '../models/global-data';
import { DatewiseData } from '../models/date-wise-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-23-2020.csv'
  private datewiseUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
  constructor(private http: HttpClient) { }
  getDatewiseData() {
    return this.http.get(this.datewiseUrl, { responseType: 'text' }).pipe(
      map(result => {
        let rows = result.split('\n');
        let mainData = {};
        let header = rows[ 0 ];
        let dates = header.split(/,(?=\S)/)
        dates.splice(0, 4);
        rows.splice(0, 1);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/)
          let con = cols[ 1 ];
          cols.splice(0, 4);
          mainData[ con ] = [];
          cols.forEach((value, index) => {
            let dw: DatewiseData = {
              cases: +value,
              country: con,
              date: new Date(Date.parse(dates[ index ]))
            }
            mainData[ con ].push(dw)
          })
        })
        //console.log(mainData);
        return mainData;
      })
    )
  }
  getGlobalData() {
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map(result => {
        let data: GlobalDataSummary[] = [];
        let rows = result.split('\n');
        let raw = {};
        rows.splice(0, 1);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/)
          let cs = {
            country: cols[ 3 ],
            confirmed: +cols[ 7 ],
            deaths: +cols[ 8 ],
            recovered: +cols[ 9 ],
            active: +cols[ 10 ],
          };
          let temp: GlobalDataSummary = raw[ cs.country ];
          if (temp) {
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;

            raw[ cs.country ] = temp;
          }
          else {
            raw[ cs.country ] = cs;
          }

        }
        )



        return <GlobalDataSummary[]> Object.values(raw);
      })
    )
  }
}
