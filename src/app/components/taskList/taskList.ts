import { Component } from '@angular/core';
import { TaskCardComponent } from '../taskCard/taskCard';
import { TabsComponent } from '../tabs/tabs';

@Component({
  selector: 'app-task-list',
  imports: [TaskCardComponent, TabsComponent],
  templateUrl: './taskList.html',
  styleUrls: ['./taskList.css'],
})

export class TaskListComponent {
  filter: 'all' | 'not_done' | 'done' = 'all';

  setFilter(newFilter: 'all' | 'not_done' | 'done') {
    this.filter = newFilter;
  }
}
