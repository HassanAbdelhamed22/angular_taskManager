import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.html',
  styleUrls: ['./tabs.css'],
})
export class TabsComponent {
  @Input() currentFilter: 'all' | 'not_done' | 'done' = 'all';
  @Output() filterChange = new EventEmitter<'all' | 'not_done' | 'done'>();

  setFilter(filter: 'all' | 'not_done' | 'done') {
    this.currentFilter = filter;
    this.filterChange.emit(filter);
  }
}
