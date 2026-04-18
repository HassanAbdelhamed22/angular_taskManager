import { Component, Input } from '@angular/core';
import { Toast } from '../../types';

@Component({
  selector: 'app-toasts',
  imports: [],
  templateUrl: './toasts.html',
  styleUrl: './toasts.css',
})
export class Toasts {
  @Input() toasts: Toast[] = [];
}
