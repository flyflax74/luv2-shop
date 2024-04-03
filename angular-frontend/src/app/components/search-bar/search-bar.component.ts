import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  constructor(private router : Router ) {}
  
  ngOnInit(): void {
      
  }

  doSearch(value: string) {
    this.router.navigateByUrl(`/search/${value}`);
  }
}
