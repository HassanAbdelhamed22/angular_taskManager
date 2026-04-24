import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/task.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  showToast(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    const newToast: Toast = {
      id: uuidv4(),
      message,
      type
    };

    this.toasts.update(currentToasts => [...currentToasts, newToast]);

    setTimeout(() => {
      this.removeToast(newToast.id);
    }, 3000);
  }

  removeToast(id: string) {
    this.toasts.update(currentToasts => currentToasts.filter(t => t.id !== id));
  }
}
