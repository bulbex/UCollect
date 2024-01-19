import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  imports: [TranslateModule],
  standalone: true
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
