import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent {
  @Input() currentFilter: 'all' | 'not_done' | 'done' = 'all';
  @Input() allCount = 0;
  @Input() notDoneCount = 0;
  @Input() doneCount = 0;
  @Output() filterChange = new EventEmitter<'all' | 'not_done' | 'done'>();

  setFilter(filter: 'all' | 'not_done' | 'done') {
    this.currentFilter = filter;
    this.filterChange.emit(filter);
  }
}
