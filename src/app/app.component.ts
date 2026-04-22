import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastsComponent } from './components/toasts/toasts.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastsComponent, ConfirmModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
}
