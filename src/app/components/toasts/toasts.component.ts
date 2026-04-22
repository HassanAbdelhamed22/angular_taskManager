import { Component, Input } from '@angular/core';
import { Toast } from '../../models/task.model';

@Component({
  selector: 'app-toasts',
  imports: [],
  templateUrl: './toasts.component.html',
  styleUrl: './toasts.component.css',
})
export class ToastsComponent {
  @Input() toasts: Toast[] = [];
}
